import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Invocation method disallowed' });
  }

  const { name, email, message, captchaToken, honeypot } = req.body;

  const mailBody = `📧 New Message Received

  👤 Email: ${email}
  
  📝 Message:
  ${message}
  `;

  if (honeypot) {
    return res.status(400).json({ error: 'Bot detected' });
  }

  if (!name || !email || !message || !captchaToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;
  
  try {
    const captchaResponse = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaResponse.json();
    
    if (!captchaData.success || captchaData.score < 0.45) {
      return res.status(400).json({ error: 'Failed captcha verification' });
    }
  } catch (err) {
    console.error('Captcha verification failed:', err);
    return res.status(500).json({ error: 'Captcha verification error' });
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
    to: 'pitoursirak26@gmail.com', 
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
