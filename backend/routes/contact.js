import { Router } from 'express';
import { 
  submitContact, 
  listMessages, 
  getContact,
  markMessageStatus, 
  deleteMessage,
  bulkDeleteContacts,
  getStats,
  exportCSV
} from '../controllers/contactController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validate.js';
import recaptchaMiddleware from '../middlewares/recaptcha.js';
import contactRateLimiter from '../middlewares/contactRateLimiter.js';
import Joi from 'joi';

const router = Router();

// Validation Schema for Contact Submission
const contactSubmitSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().max(20).optional().allow(''),
  subject: Joi.string().trim().max(200).required(),
  message: Joi.string().trim().max(2000).required(),
  recaptchaToken: Joi.string().required()
});

// Validation Schema for Status Update
const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED').required(),
  notes: Joi.string().trim().max(500).optional().allow('')
});

// PUBLIC ROUTES
// Submit contact form
router.post('/', 
  contactRateLimiter, 
  validate(contactSubmitSchema), 
  recaptchaMiddleware, 
  submitContact
);

// ADMIN ROUTES (Requires authentication and admin role)

// Get all contacts
router.get('/admin/contacts', 
  authenticate, 
  authorize(['ADMIN']), 
  listMessages
);

// Get contact statistics
router.get('/admin/contacts/stats', 
  authenticate, 
  authorize(['ADMIN']), 
  getStats
);

// Export contacts to CSV
router.get('/admin/contacts/export/csv', 
  authenticate, 
  authorize(['ADMIN']), 
  exportCSV
);

// Get single contact
router.get('/admin/contacts/:id', 
  authenticate, 
  authorize(['ADMIN']), 
  getContact
);

// Update contact status
router.patch('/admin/contacts/:id', 
  authenticate, 
  authorize(['ADMIN']), 
  validate(statusUpdateSchema), 
  markMessageStatus
);

// Delete contact
router.delete('/admin/contacts/:id', 
  authenticate, 
  authorize(['ADMIN']), 
  deleteMessage
);

// Bulk delete contacts
router.post('/admin/contacts/bulk-delete', 
  authenticate, 
  authorize(['ADMIN']), 
  bulkDeleteContacts
);

export default router;
