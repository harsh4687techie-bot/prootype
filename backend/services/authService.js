import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../app.js';
import config from '../config/index.js';

const SALT_ROUNDS = 12;

export async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { name, email, password: hash } });
  return user;
}

export async function verifyCredentials({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  return user;
}

export function createTokens(user) {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  const refreshToken = jwt.sign({ sub: user.id }, config.refreshSecret, { expiresIn: config.refreshExpiresIn });
  return { token, refreshToken };
}

export async function storeRefreshToken(userId, refreshToken) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, refreshToken, expiresAt } });
}

export async function rotateRefreshToken(oldToken, newToken) {
  const session = await prisma.session.findFirst({ where: { refreshToken: oldToken } });
  if (!session) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  await prisma.session.delete({ where: { id: session.id } });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return prisma.session.create({ data: { userId: session.userId, refreshToken: newToken, expiresAt } });
}

export async function getUserById(userId) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function logout(userId) {
  await prisma.session.deleteMany({ where: { userId } });
}
