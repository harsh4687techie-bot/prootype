import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import morgan from 'morgan';
import pinoHttp from 'pino-http';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import router from './routes/index.js';
import config from './config/index.js';
import errorHandler from './middlewares/errorHandler.js';
import rateLimiter from './middlewares/rateLimiter.js';
import { metricsMiddleware, metricsRoute } from './middlewares/prometheus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const prisma = new PrismaClient();

export const redisClient = createClient({ url: config.redisUrl });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
  referrerPolicy: { policy: 'no-referrer' }
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csurf({ cookie: { httpOnly: true, secure: config.cookieSecure, sameSite: 'strict' } }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use(pinoHttp());

app.use(rateLimiter);
app.use(metricsMiddleware);

app.use(express.static(path.join(__dirname, '../..')));

app.use(`/api/${config.apiVersion}`, router);
app.get('/metrics', metricsRoute);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));

app.use(errorHandler);

export default app;
