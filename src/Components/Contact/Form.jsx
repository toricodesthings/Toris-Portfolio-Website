import React, { useEffect, useState } from 'react';
import "./Contact.css";

const loadReCaptcha = (siteKey) => {
  return new Promise((resolve, reject) => {

    if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
      resolve(window.grecaptcha);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.grecaptcha) resolve(window.grecaptcha);
      else reject(new Error('reCAPTCHA failed to load'));
    };
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));
    document.body.appendChild(script);
  });
};

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    loadReCaptcha('6LdzCQUrAAAAAG0MJViwm2SjBUwKg0npkAdkaVm_')
      .then((grecaptcha) => console.log('reCAPTCHA loaded', grecaptcha))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.grecaptcha) {
      alert("reCAPTCHA is not loaded yet. Please try again later.");
      return;
    }

    try {
      const token = await window.grecaptcha.execute('6LdzCQUrAAAAAG0MJViwm2SjBUwKg0npkAdkaVm_', { action: 'contact_form' });
      const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        message: e.target.message.value,
        captchaToken: token,
        honeypot: e.target.honeypot ? e.target.honeypot.value : '',
      };

      const response = await fetch('/api/submitform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(result.error || 'An error occured sending message.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during submission.');
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (isSubmitted) {
      setTimeout(() => {
        setShowSuccess(true);
      }, 50); // small delay to trigger transition
    } else {
      setShowSuccess(false);
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <div className={`success-message ${showSuccess ? "visible" : ""}`}>
        <h3>Thank you! I'll be in touch soon.</h3>
        <button onClick={resetForm}>Submit another?</button>
      </div>
    );
  }

  return (
    <div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" placeholder="Your Name" />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Your Email" required />
        </div>
        <div className="form-group">
          <textarea name="message" placeholder="Your Message" rows="6" required></textarea>
        </div>
        <input type="text" name="honeypot" style={{ display: 'none' }} />
        <div className="contact-form-buttons">
          <button type="submit">Send Message</button>
          <button type="reset">Clear</button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;