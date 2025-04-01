import React, { useEffect, useState, useRef } from 'react';
import "./Contact.css";
import HamsterLoadingUI from "../LoadingUI/HamsterLoader";

const RECAPTCHA_SITE_KEY = '6LdzCQUrAAAAAG0MJViwm2SjBUwKg0npkAdkaVm_';

const loadReCaptcha = (siteKey) => {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve(window.grecaptcha);
      return;
    }
    
    const scriptId = 'recaptcha-script';
    if (document.getElementById(scriptId)) {
      resolve(window.grecaptcha);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}&badge=inline`;
    script.async = true;
    script.defer = true;
    
    const timeoutId = setTimeout(() => {
      reject(new Error('reCAPTCHA load timeout'));
    }, 10000); // 10 second timeout

    script.onload = () => {
      clearTimeout(timeoutId);
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => resolve(window.grecaptcha));
      } else {
        reject(new Error('reCAPTCHA failed to load'));
      }
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error('Failed to load reCAPTCHA script'));
    };
    
    document.body.appendChild(script);
  });
};

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaError, setCaptchaError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const initializeCaptcha = async () => {
      try {
        const grecaptcha = await loadReCaptcha(RECAPTCHA_SITE_KEY);
        if (mounted) {
          setCaptchaReady(true);
          setCaptchaError(null);
        }
      } catch (error) {
        if (mounted) {
          console.error('reCAPTCHA initialization failed:', error);
          setCaptchaError('Failed to load security verification. Please refresh the page.');
        }
      }
    };

    initializeCaptcha();

    return () => {
      mounted = false;
      // Cleanup reCAPTCHA script if component unmounts
      const script = document.getElementById('recaptcha-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaReady) {
      alert("Security verification is not ready yet. Please wait or refresh the page.");
      return;
    }
    
    setLoading(true);
    
    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact_form' });
      if (!token) {
        throw new Error('Failed to get security token');
      }

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
        alert(result.error || 'An error occurred sending message.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      alert(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
  };

  useEffect(() => {
    if (isSubmitted) {
      setTimeout(() => {
        setShowSuccess(true);
      }, 100); 
    } else {
      setShowSuccess(false);
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (!isSubmitted && formRef.current) {
      formRef.current.classList.remove("visible");
      setTimeout(() => {
        formRef.current.classList.add("visible");
      }, 100);
    }
  }, [isSubmitted]);

  if (loading) {
    return (
      <div className='form-loading'>
        <HamsterLoadingUI />
        <h3>Sending...</h3>
      </div>
    );
  } else if (captchaError) {
    return <div className="error-message">{captchaError}</div>;
  } else if (isSubmitted) {
    return (
      <div className={`success-message ${showSuccess ? "visible" : ""}`}>
        <h3>Thank you! I'll be in touch soon.</h3>
        <button onClick={resetForm}>Submitting another? Click Here.</button>
      </div>
    );
  } else {
    return (
      <div>
        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
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
        <p style={{ height: '100%', marginBottom: '-20px', fontSize: '0.8em', color: '#eee', marginTop: '20px', textAlign: 'center' }}>
          This site is protected by reCAPTCHA and the Google 
          <a href="https://policies.google.com/privacy" style={{ textDecoration: 'none', color: 'pink' }}> Privacy Policy</a> and
          <a href="https://policies.google.com/terms" style={{ textDecoration: 'none', color: 'pink' }}> Terms of Service</a> apply.
        </p>
      </div>
    );
  }
};

export default ContactForm;
