import { Router } from 'express';
import { stats, adminListMessages, adminMarkMessageStatus, adminDeleteMessage } from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import config from '../config/index.js';

const router = Router();

router.use((req, res, next) => {
  const apikey = req.headers['x-api-key'];
  if (!apikey || apikey !== config.adminApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});

router.get('/stats', authenticate, authorize(['ADMIN']), stats);
router.get('/messages', authenticate, authorize(['ADMIN']), adminListMessages);
router.patch('/messages/:id/status', authenticate, authorize(['ADMIN']), adminMarkMessageStatus);
router.delete('/messages/:id', authenticate, authorize(['ADMIN']), adminDeleteMessage);

export default router;
