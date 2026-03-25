import rateLimit from 'express-rate-limit';

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`Contact spam protection triggered for IP ${req.ip}`);
    res.status(429).json({ error: 'Too many contact attempts. Please wait and try again.' });
  }
});

export default contactLimiter;
