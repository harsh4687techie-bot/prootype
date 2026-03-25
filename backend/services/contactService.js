import { prisma } from '../app.js';
import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass
  }
});

/**
 * Send Notification Email to Admin
 */
export async function sendNotificationEmail(message) {
  if (!config.notificationEmail) return;

  const mail = {
    from: config.smtpUser,
    to: config.notificationEmail,
    subject: `New contact message from ${message.name}`,
    text: `New contact:
Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone || 'Not provided'}
Subject: ${message.subject}
Message: ${message.message}
Received: ${message.createdAt}

View in admin panel: [Your Domain]/admin/contacts/${message.id}`
  };

  return transporter.sendMail(mail);
}

/**
 * Send Auto Reply to User
 */
export async function sendAutoReply(message) {
  if (!message?.email) return;

  const mail = {
    from: config.smtpUser,
    to: message.email,
    subject: 'Thanks for contacting us',
    text: `Hi ${message.name},\n\nThank you for reaching out to us. We have received your message:\n\n"${message.message}"\n\nWe will get back to you as soon as possible.\n\nBest regards`
  };

  return transporter.sendMail(mail);
}

/**
 * Create Contact Message
 */
export async function createContactMessage(data) {
  const message = await prisma.contactMessage.create({ 
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      status: data.status || 'PENDING'
    }
  });
  return message;
}

/**
 * Get Contact by ID
 */
export async function getContactById(id) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

/**
 * List Contact Messages with Filtering
 */
export async function listContactMessages({ page = 1, perPage = 20, status, search }) {
  const skip = (page - 1) * perPage;
  
  const where = {};
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } }
    ];
  }

  const [data, total] = await Promise.all([
    prisma.contactMessage.findMany({ 
      where,
      skip, 
      take: perPage, 
      orderBy: { createdAt: 'desc' } 
    }),
    prisma.contactMessage.count({ where })
  ]);

  return { 
    data,
    pagination: {
      total,
      pages: Math.ceil(total / perPage),
      currentPage: page,
      perPage
    }
  };
}

/**
 * Get Contacts Count
 */
export async function getContactsCount({ status, search }) {
  const where = {};
  
  if (status) {
    where.status = status;
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { message: { contains: search, mode: 'insensitive' } }
    ];
  }

  return prisma.contactMessage.count({ where });
}

/**
 * Update Contact Message Status
 */
export async function updateContactMessageStatus(id, status, notes = null) {
  return prisma.contactMessage.update({ 
    where: { id }, 
    data: { 
      status,
      notes,
      readAt: status === 'READ' ? new Date() : undefined,
      updatedAt: new Date()
    } 
  });
}

/**
 * Mark Contact as Read
 */
export async function markContactAsRead(id) {
  return prisma.contactMessage.update({
    where: { id },
    data: {
      status: 'READ',
      readAt: new Date()
    }
  });
}

/**
 * Delete Contact Message
 */
export async function deleteContactMessage(id) {
  const deleted = await prisma.contactMessage.delete({ where: { id } });
  return deleted ? true : false;
}

/**
 * Delete Multiple Contacts
 */
export async function deleteMultipleContacts(ids) {
  const result = await prisma.contactMessage.deleteMany({
    where: {
      id: { in: ids }
    }
  });
  return result.count;
}

/**
 * Get Contact Statistics
 */
export async function getContactStats() {
  const [total, pending, read, spam] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { status: 'READ' } }),
    prisma.contactMessage.count({ where: { status: 'SPAM' } })
  ]);

  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = await prisma.contactMessage.count({
    where: {
      createdAt: { gte: last7Days }
    }
  });

  return {
    total,
    pending,
    read,
    spam,
    recentCount,
    archived: total - pending - read - spam
  };
}

/**
 * Export Contacts to CSV
 */
export async function exportContactsToCSV({ status }) {
  const where = status ? { status } : {};
  
  const contacts = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  if (contacts.length === 0) {
    return 'No contacts found\n';
  }

  // CSV Headers
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Created At', 'Notes'];
  const rows = [headers.join(',')];

  // CSV Rows
  contacts.forEach(contact => {
    const row = [
      contact.id,
      `"${contact.name.replace(/"/g, '""')}"`,
      contact.email,
      contact.phone || '',
      `"${contact.subject.replace(/"/g, '""')}"`,
      `"${contact.message.replace(/"/g, '""')}"`,
      contact.status,
      contact.createdAt.toISOString(),
      contact.notes ? `"${contact.notes.replace(/"/g, '""')}"` : ''
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

