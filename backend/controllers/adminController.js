import asyncHandler from 'express-async-handler';
import { prisma } from '../app.js';
import { listContactMessages, updateContactMessageStatus, deleteContactMessage } from '../services/contactService.js';

export const stats = asyncHandler(async (req, res) => {
  const [users, projects, contacts] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.contactMessage.count()
  ]);
  res.json({ users, projects, contacts });
});

export const adminListMessages = asyncHandler(async (req, res) => {
  const { page = 1, perPage = 20 } = req.query;
  const result = await listContactMessages({ page: Number(page), perPage: Number(perPage) });
  res.json(result);
});

export const adminMarkMessageStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['PENDING', 'REVIEWED', 'CLOSED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const message = await updateContactMessageStatus(id, status);
  res.json(message);
});

export const adminDeleteMessage = asyncHandler(async (req, res) => {
  await deleteContactMessage(req.params.id);
  res.status(204).send();
});
