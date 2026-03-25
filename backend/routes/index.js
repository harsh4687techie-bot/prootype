import { Router } from 'express';
import authRoutes from './auth.js';
import projectsRoutes from './projects.js';
import contactRoutes from './contact.js';
import adminRoutes from './admin.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/projects', projectsRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

export default router;
