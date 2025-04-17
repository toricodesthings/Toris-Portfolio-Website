import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import validator from 'validator';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return validator.escape(validator.trim(input));
}

function validateFields({ name, email, message, captchaToken, honeypot }) {
  if (honeypot) return { error: 'Bot detected' };
  if (!name || !email || !message || !captchaToken) return { error: 'Missing required fields' };
  return null;
}

async function verifyCaptcha(secretKey, captchaToken) {
  try {
    const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`, { method: 'POST' });
    const captchaData = await captchaResponse.json();
    if (!captchaData.success || captchaData.score < 0.45) return false;
    return true;
  } catch (error) {
    console.error('Error with captcha:', error);
    throw new Error('Captcha verification error');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invocation method disallowed' });
  }

  const name = sanitizeInput(req.body.name);
  const email = validator.normalizeEmail(sanitizeInput(req.body.email)) || '';
  const message = sanitizeInput(req.body.message);
  const honeypot = sanitizeInput(req.body.honeypot);
  const captchaToken = sanitizeInput(req.body.captchaToken);

  const mailBody = `📧 New Message Received

  👤 Email: ${email}
  
  📝 Message:
  ${message}
  `;

  const validationError = validateFields({ name, email, message, captchaToken, honeypot });
  if (validationError) return res.status(400).json(validationError);

  try {
    const captchaOk = await verifyCaptcha(process.env.RECAPTCHA_SECRET, captchaToken);
    if (!captchaOk) return res.status(400).json({ error: 'Failed captcha verification' });
  } catch (err) {
    console.error('Captcha verification failed:', err);
    return res.status(500).json({ error: err.message });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, 
    subject: `Oh look! New contact submission form from ${name}`,
    text: mailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Form sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send form.' });
  }
  
}
