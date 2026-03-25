# Portfolio Application - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Updated Project Structure](#updated-project-structure)
3. [Local Setup](#local-setup)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Admin Panel](#admin-panel)
7. [API Documentation](#api-documentation)
8. [Database](#database)
9. [Security](#security)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a production-ready portfolio website with:
- **Modern, responsive frontend** with animations and theme toggle
- **Contact form** with validation and database storage
- **Admin panel** for managing submissions
- **RESTful API** with proper error handling
- **Security features** including CSRF protection, rate limiting, and input sanitization
- **Email notifications** for new submissions
- **CSV export** functionality

**Tech Stack:**
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Backend: Node.js, Express.js
- Database: SQLite (with Prisma ORM)
- Email: Nodemailer
- Cache: Redis

---

## 📁 Updated Project Structure

```
portfolio/
├── frontend/
│   ├── public/
│   │   ├── index.html          # Main portfolio page
│   │   └── admin.html          # Admin dashboard
│   └── src/
│       ├── css/
│       │   ├── main.css        # Core styles
│       │   ├── components.css  # Reusable components
│       │   └── responsive.css  # Mobile-first responsive
│       └── js/
│           ├── main.js         # Main app logic
│           └── form.js         # Contact form & validation
│
├── backend/
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── config/
│   │   └── index.js            # Configuration & env vars
│   ├── controllers/
│   │   ├── contactController.js # Contact endpoints
│   │   └── authController.js    # Authentication
│   ├── services/
│   │   ├── contactService.js   # Contact logic
│   │   └── authService.js      # Auth logic
│   ├── middlewares/
│   │   ├── authMiddleware.js   # JWT auth
│   │   ├── validate.js         # Input validation
│   │   ├── errorHandler.js     # Error handling
│   │   ├── rateLimiter.js      # Rate limiting
│   │   └── contactRateLimiter.js
│   ├── routes/
│   │   ├── index.js            # Main router
│   │   ├── contact.js          # Contact routes
│   │   └── auth.js             # Auth routes
│   ├── utils/
│   │   └── sanitize.js         # Input sanitization
│   └── prisma/
│       ├── schema.prisma       # Database schema
│       └── migrations/         # Database migrations
│
├── docs/
│   └── DEPLOYMENT.md           # Deployment guide
│
├── .env.example                # Example environment file
├── package.json
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v16+ (Check: `node --version`)
- npm v7+ (Check: `npm --version`)
- SQLite3 (Usually included with Node)

### Step 1: Install Dependencies

```bash
cd portfolio
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Setup Environment Variables

Create `.env` file in the `backend` directory:

```env
# Server
PORT=4000
NODE_ENV=development
API_VERSION=v1

# Database
DATABASE_URL="file:./prisma/dev.db"

# Redis (Optional, for caching)
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Admin
ADMIN_API_KEY=your-admin-api-key

# Email Configuration
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your-email@ethereal.email
SMTP_PASS=your-email-password
ADMIN_NOTIFICATION_EMAIL=admin@example.com

# reCAPTCHA (Optional)
RECAPTCHA_SECRET=your-recaptcha-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000

# Cookies
COOKIE_SECURE=false
COOKIE_DOMAIN=localhost

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

**For Development:**
Use Ethereal Email (fake SMTP service) for testing:
1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy credentials to `.env`

### Step 3: Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npx prisma seed  # Optional: seed with sample data
cd ..
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
npm start
# Frontend runs on http://localhost:3000
```

Or use npm scripts from root:

```bash
npm run dev:backend   # Start backend with nodemon
npm run dev:frontend  # Start frontend
npm run dev           # Start both
```

---

## ⚙️ Configuration

### Key Configuration Files

#### `.env` (Environment Variables)
All sensitive configuration is stored here. Never commit this to Git!

#### `backend/config/index.js`
Loads and validates environment variables on startup.

#### `backend/prisma/schema.prisma`
Database schema definition. Modify when adding new models.

---

## 🎮 Running the Application

### Development Mode

```bash
# Install nodemon for auto-restart
npm install -D nodemon

# Run with auto-reload
npm run dev
```

### Production Mode

```bash
# Set NODE_ENV
export NODE_ENV=production

# Start server
npm start
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api/v1
- **Admin Panel**: http://localhost:3000/admin.html
- **Health Check**: http://localhost:4000/health
- **API Metrics**: http://localhost:4000/metrics

---

## 👨‍💼 Admin Panel

### Access
1. Navigate to `http://localhost:3000/admin.html`
2. Authenticate with admin credentials (set up required)

### Features
- ✅ View all contact submissions
- ✅ Filter by status (Pending, Read, Replied, Spam)
- ✅ Search by name, email, or message
- ✅ Mark as read/replied/spam
- ✅ Add admin notes
- ✅ Delete individual or multiple contacts
- ✅ View statistics
- ✅ Export to CSV

### Admin Statistics
- Total messages received
- Pending messages count
- Read messages count
- Spam messages count
- Recent messages (last 7 days)

---

## 📡 API Documentation

### Contact Endpoints

#### Submit Contact Form
```http
POST /api/v1/contacts

Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project...",
  "recaptchaToken": "token_from_frontend"
}

Response (201):
{
  "success": true,
  "message": "Your message has been received...",
  "id": "msg-123",
  "createdAt": "2024-03-25T10:00:00Z"
}
```

**Rate Limiting:** 5 messages per IP per minute

#### Get All Contacts (Admin)
```http
GET /api/v1/admin/contacts?page=1&limit=10&status=PENDING&search=john

Headers:
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "msg-123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 1234567890",
      "subject": "Project Inquiry",
      "message": "...",
      "status": "PENDING",
      "createdAt": "2024-03-25T10:00:00Z",
      "readAt": null,
      "notes": null
    }
  ],
  "pagination": {
    "total": 50,
    "pages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

#### Get Single Contact (Admin)
```http
GET /api/v1/admin/contacts/:id

Headers:
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": { /* contact object */ }
}
```

#### Update Contact Status (Admin)
```http
PATCH /api/v1/admin/contacts/:id

Headers:
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "REPLIED",
  "notes": "Customer inquiry about pricing"
}

Response (200):
{
  "success": true,
  "message": "Contact updated successfully",
  "data": { /* updated contact */ }
}
```

#### Delete Contact (Admin)
```http
DELETE /api/v1/admin/contacts/:id

Headers:
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

#### Get Statistics (Admin)
```http
GET /api/v1/admin/contacts/stats

Headers:
Authorization: Bearer <admin-token>

Response (200):
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 25,
    "read": 100,
    "spam": 10,
    "recentCount": 30,
    "archived": 15
  }
}
```

#### Export to CSV (Admin)
```http
GET /api/v1/admin/contacts/export/csv?status=all

Headers:
Authorization: Bearer <admin-token>

Response (200): CSV file download
```

---

## 🗄️ Database

### Schema Overview

#### ContactMessage Table
```prisma
model ContactMessage {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String
  status    String   @default("PENDING")  // PENDING, READ, REPLIED, SPAM, ARCHIVED
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  readAt    DateTime?

  @@index([email])
  @@index([status])
  @@index([createdAt])
}
```

### Database Operations

**View database:**
```bash
cd backend
npx prisma studio
```

**Reset database:**
```bash
cd backend
npx prisma migrate reset
```

**Create migration after schema change:**
```bash
cd backend
npx prisma migrate dev --name add_new_field
```

---

## 🔐 Security

### Features Implemented

1. **Input Validation**
   - All inputs are validated using Joi schemas
   - Max length limits to prevent abuse
   - Email format validation
   - Sanitization to prevent XSS

2. **CSRF Protection**
   - CSRF tokens on forms
   - SameSite cookie policies
   - HTTP-only cookies

3. **Rate Limiting**
   - 5 messages per IP per minute (contact form)
   - 100 requests per minute (general API)
   - Configurable per endpoint

4. **Security Headers**
   - Helmet.js for HTTP security headers
   - Content Security Policy (CSP)
   - X-Frame-Options to prevent clickjacking
   - HSTS for HTTPS enforcement

5. **Authentication**
   - JWT-based admin authentication
   - Refresh token rotation
   - Session management with Redis

6. **Data Protection**
   - SQL injection prevention (Prisma ORM)
   - XSS prevention via input sanitization
   - Proper error messages (no sensitive info leakage)

### Best Practices

1. **Change Default Secrets**
   ```env
   JWT_SECRET=<generate-random-string>
   JWT_REFRESH_SECRET=<generate-random-string>
   ADMIN_API_KEY=<generate-random-string>
   ```

2. **Use Strong Passwords**
   - SMTP password is secure
   - Database credentials are strong

3. **Enable HTTPS in Production**
   ```env
   COOKIE_SECURE=true
   NODE_ENV=production
   ```

4. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

---

## 🌍 Deployment

### Option 1: Deploy to Vercel (Recommended for Frontend)

Frontend only (static files):
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Option 2: Deploy Backend to Railway/Heroku/DigitalOcean

#### Railway.app (Recommended)
1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Railway detects `package.json` and deploys

#### Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=xxxx
```

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Auto-build from Dockerfile
3. Set environment variables
4. Deploy

### Option 3: Self-Hosted VPS (Ubuntu)

#### Prerequisites
```bash
# SSH into server
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install SQLite
apt install -y sqlite3
```

#### Deploy Application
```bash
# Clone repository
git clone https://github.com/your-repo/portfolio.git
cd portfolio

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Setup database
cd backend
npx prisma migrate deploy
cd ..

# Start with PM2
pm2 start backend/server.js --name portfolio-api
pm2 start npm --name portfolio-frontend -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
nano /etc/nginx/sites-available/default

# Add this config:
# upstream api_backend {
#   server localhost:4000;
# }
# 
# upstream frontend {
#   server localhost:3000;
# }
#
# server {
#   listen 80;
#   server_name yourdomain.com;
#
#   location /api/ {
#     proxy_pass http://api_backend;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
#   }
#
#   location / {
#     proxy_pass http://frontend;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection 'upgrade';
#     proxy_set_header Host $host;
#     proxy_cache_bypass $http_upgrade;
#   }
# }

# Enable SSL with Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com

# Restart Nginx
systemctl restart nginx
```

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Setup email service credentials
- [ ] Monitor error logs
- [ ] Setup database backups
- [ ] Enable CDN for static assets
- [ ] Setup monitoring and alerts
- [ ] Test email notifications

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

### Port 4000 Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or change in .env
PORT=4001
```

### Database Connection Error
```bash
# Reinitialize database
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
cd ..
```

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify email service is active
3. Check spam folder
4. See logs: `tail -f backend/logs/error.log`

### CORS Error
```bash
# Fix: Update ALLOWED_ORIGINS in .env
ALLOWED_ORIGINS=http://localhost:3000,http://your-domain.com
```

### JWT Token Expired
- Tokens expire after JWT_EXPIRES_IN (default 15m)
- Use refresh token to get new access token
- Check browser localStorage for token

---

## 📞 Support & Contact

For issues, questions:
1. Check this documentation
2. Review API logs
3. Check browser console for frontend errors
4. Submit issue on GitHub

---

## 📄 License

This project is provided as-is. Modify and use as needed for your portfolio.

---

**Last Updated:** March 25, 2024
**Version:** 1.0.0
