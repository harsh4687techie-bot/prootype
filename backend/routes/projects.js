import { Router } from 'express';
import { getProjects, createNewProject, editProject, removeProject } from '../controllers/projectController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validate.js';
import cache from '../middlewares/cache.js';
import Joi from 'joi';

const router = Router();

const projectSchema = Joi.object({
  title: Joi.string().min(1).max(150).required(),
  description: Joi.string().max(1000).required(),
  url: Joi.string().uri().allow('', null),
  public: Joi.boolean().default(true)
});

router.get('/', cache(60), getProjects);
router.post('/', authenticate, validate(projectSchema), createNewProject);
router.put('/:id', authenticate, validate(projectSchema), editProject);
router.delete('/:id', authenticate, authorize(['ADMIN']), removeProject);

export default router;
