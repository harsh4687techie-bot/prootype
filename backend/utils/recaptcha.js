import fetch from 'node-fetch';
import config from '../config/index.js';

export async function verifyRecaptcha(token) {
  if (!config.recaptchaSecret) {
    return true;
  }

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${encodeURIComponent(config.recaptchaSecret)}&response=${encodeURIComponent(token)}`
  });

  const data = await response.json();
  return data.success && data.score >= 0.5;
}
