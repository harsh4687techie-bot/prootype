import { verifyRecaptcha } from '../utils/recaptcha.js';

export default async function recaptchaMiddleware(req, res, next) {
  const token = req.body.recaptchaToken;
  if (!token) {
    return res.status(400).json({ error: 'Missing reCAPTCHA token' });
  }

  const valid = await verifyRecaptcha(token);
  if (!valid) {
    return res.status(429).json({ error: 'reCAPTCHA validation failed' });
  }

  next();
}
