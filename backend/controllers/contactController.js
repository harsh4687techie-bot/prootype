import asyncHandler from 'express-async-handler';
import sanitizeHtml from 'sanitize-html';
import { sanitizeContactInput } from '../utils/sanitize.js';
import { 
  createContactMessage, 
  listContactMessages, 
  updateContactMessageStatus, 
  deleteContactMessage, 
  sendNotificationEmail, 
  sendAutoReply,
  getContactById,
  getContactStats,
  deleteMultipleContacts,
  exportContactsToCSV
} from '../services/contactService.js';

/**
 * Submit Contact Form
 * POST /api/v1/contacts
 */
export const submitContact = asyncHandler(async (req, res) => {
  const clean = sanitizeContactInput(req.body);
  const message = await createContactMessage({ ...clean, status: 'PENDING' });

  // Send notification and reply concurrently (non-blocking for response)
  sendNotificationEmail(message).catch((err) => console.error('Admin notification error', err));
  sendAutoReply(message).catch((err) => console.error('Auto-reply error', err));

  res.status(201).json({ 
    success: true,
    message: 'Your message has been received. Thank you for reaching out!',
    id: message.id, 
    status: 'submitted',
    createdAt: message.createdAt
  });
});

/**
 * List All Messages (Admin)
 * GET /api/v1/admin/contacts
 */
export const listMessages = asyncHandler(async (req, res) => {
  const { page = 1, perPage = 20, status = 'all', search = '' } = req.query;
  const result = await listContactMessages({ 
    page: Number(page), 
    perPage: Number(perPage),
    status: status === 'all' ? undefined : status,
    search
  });
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

/**
 * Get Single Contact (Admin)
 * GET /api/v1/admin/contacts/:id
 */
export const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  res.json({
    success: true,
    data: contact
  });
});

/**
 * Mark Message Status
 * PATCH /api/v1/admin/contacts/:id
 */
export const markMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  
  const validStatuses = ['PENDING', 'READ', 'REPLIED', 'SPAM', 'ARCHIVED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid status' 
    });
  }

  const message = await updateContactMessageStatus(id, status, notes);
  res.json({
    success: true,
    message: 'Contact updated successfully',
    data: message
  });
});

/**
 * Delete Message
 * DELETE /api/v1/admin/contacts/:id
 */
export const deleteMessage = asyncHandler(async (req, res) => {
  const result = await deleteContactMessage(req.params.id);
  
  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  res.json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

/**
 * Bulk Delete Contacts
 * POST /api/v1/admin/contacts/bulk-delete
 */
export const bulkDeleteContacts = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide valid contact IDs'
    });
  }

  const deleted = await deleteMultipleContacts(ids);

  res.json({
    success: true,
    message: `${deleted} contacts deleted successfully`,
    data: { deletedCount: deleted }
  });
});

/**
 * Get Contact Statistics
 * GET /api/v1/admin/contacts/stats
 */
export const getStats = asyncHandler(async (req, res) => {
  const stats = await getContactStats();

  res.json({
    success: true,
    data: stats
  });
});

/**
 * Export Contacts to CSV
 * GET /api/v1/admin/contacts/export/csv
 */
export const exportCSV = asyncHandler(async (req, res) => {
  const { status = 'all' } = req.query;

  const csv = await exportContactsToCSV({
    status: status === 'all' ? undefined : status
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');
  res.send(csv);
});
