# Shinde Harshvardhan - Professional Portfolio

A modern, production-ready portfolio website with contact form, admin panel, and REST APIs. Built with clean architecture and industry best practices.

## ✨ Features

### Frontend
- 🎨 **Modern, Responsive Design** - Mobile-first approach with Glassmorphism
- 🌓 **Dark/Light Theme Toggle** - Persistent theme preference
- ✨ **Smooth Animations** - Intersection Observer for scroll animations
- 📱 **Mobile Optimized** - Works seamlessly on all devices
- ♿ **Accessible** - WCAG 2.1 compliant

### Contact Form & Admin Panel
- ✅ **Comprehensive Validation** - Frontend and backend validation
- 📧 **Email Notifications** - Auto-reply to users, admin notification
- 🛡️ **Security Features** - CSRF protection, rate limiting
- 💾 **Database Storage** - All submissions saved in SQLite
- 📊 **Admin Dashboard** - Manage submissions, export CSV
- 🏷️ **Status Management** - Pending, Read, Replied, Spam, Archived

### Backend APIs
- 🔐 **RESTful Design** - Clean, consistent API endpoints
- 🛡️ **Rate Limiting** - Prevent abuse with smart rate limiting
- ✔️ **Error Handling** - Comprehensive error messages
- 🔍 **Input Validation** - Best practice validation
- 🗄️ **Database ORM** - Prisma for type-safe queries

## 🎯 Quick Start

### Prerequisites
- Node.js v16+ 
- npm v7+

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example backend/.env

# 4. Initialize database
cd backend
npx prisma migrate dev --name init
cd ..

# 5. Start application
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Admin: http://localhost:3000/admin.html

## 📁 Project Structure

```
portfolio/
├── frontend/
│   ├── public/
│   │   ├── index.html          # Main portfolio
│   │   └── admin.html          # Admin dashboard
│   └── src/
│       ├── css/                # Stylesheets
│       └── js/                 # Scripts
│
├── backend/
│   ├── config/                 # Configuration
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── middlewares/            # Express middlewares
│   ├── prisma/                 # Database
│   ├── app.js                  # Express app
│   └── server.js               # Server entry
│
└── docs/
    └── DEPLOYMENT.md           # Full documentation
```

## 🚀 Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start backend only with auto-reload
npm run dev:frontend     # Start frontend only

# Production
npm start                # Start production backend
npm run build            # Build for production

# Database
npm run db:migrate       # Run migrations
npm run db:reset         # Reset database
npm run db:studio        # Open Prisma Studio
```

## 🌍 Deployment

### Deploy Frontend to Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Deploy Backend

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for:
- Railway deployment
- Heroku deployment  
- DigitalOcean deployment
- Self-hosted VPS setup

## 🔐 Security Features

✅ Input validation and sanitization  
✅ CSRF token protection  
✅ Rate limiting (5 msgs/min per IP)  
✅ SQL injection prevention  
✅ XSS prevention  
✅ Secure HTTP headers  
✅ JWT authentication  
✅ Environment variable management  

## 📡 API Endpoints

### Public Endpoints
```
POST /api/v1/contacts              # Submit contact form
```

### Admin Endpoints (Protected)
```
GET    /api/v1/admin/contacts      # List all
GET    /api/v1/admin/contacts/:id  # Get one
PATCH  /api/v1/admin/contacts/:id  # Update
DELETE /api/v1/admin/contacts/:id  # Delete
GET    /api/v1/admin/contacts/stats     # Statistics
GET    /api/v1/admin/contacts/export/csv # Export CSV
```

Full API docs: See [docs/DEPLOYMENT.md#-api-documentation](./docs/DEPLOYMENT.md#-api-documentation)

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | SQLite, Prisma ORM |
| Email | Nodemailer |
| Validation | Joi |
| Security | Helmet, CORS, rate-limit |
| Process Manager | PM2 (Production) |

## 📝 Environment Configuration

See [.env.example](./.env.example) for all available options.

Essential variables:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.ethereal.email
SMTP_USER=your-email@ethereal.email
SMTP_PASS=your-password
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Port 4000 in use | `lsof -ti:4000 \| xargs kill -9` |
| DB connection error | `cd backend && npx prisma migrate dev` |
| Email not working | Check SMTP credentials in `.env` |
| CORS error | Update `ALLOWED_ORIGINS` in `.env` |

See [docs/DEPLOYMENT.md#-troubleshooting](./docs/DEPLOYMENT.md#-troubleshooting) for more.

## 📚 Documentation

- [Full Setup Guide](./docs/DEPLOYMENT.md) - Complete deployment & configuration
- [API Documentation](./docs/DEPLOYMENT.md#-api-documentation) - All endpoints
- [Security Guide](./docs/DEPLOYMENT.md#-security) - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT License - see LICENSE file for details

## 👤 Author

**Shinde Harshvardhan**

- LinkedIn: linkedin.com/in/harshvardhan
- GitHub: github.com/harshvardhan
- Email: contact@harshvardhan.com

## 🙏 Acknowledgments

- Built with industry best practices
- Inspired by modern web design principles
- Thanks to the open-source community