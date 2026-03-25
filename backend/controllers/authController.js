import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { registerUser, verifyCredentials, createTokens, storeRefreshToken, rotateRefreshToken, logout, getUserById } from '../services/authService.js';
import config from '../config/index.js';

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const tokens = createTokens(user);
  await storeRefreshToken(user.id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: config.cookieDomain
  });

  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token: tokens.token });
});

export const login = asyncHandler(async (req, res) => {
  const user = await verifyCredentials(req.body);
  const tokens = createTokens(user);
  await storeRefreshToken(user.id, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: config.cookieDomain
  });

  res.json({ token: tokens.token, user: { id: user.id, email: user.email, role: user.role } });
});

export const refresh = asyncHandler(async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) return res.status(401).json({ error: 'Missing refresh token' });

  const payload = jwt.verify(oldToken, config.refreshSecret);
  const user = await getUserById(payload.sub);
  if (!user) return res.status(401).json({ error: 'Invalid refresh user' });

  const tokens = createTokens(user);
  await rotateRefreshToken(oldToken, tokens.refreshToken);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: config.cookieDomain
  });

  res.json({ token: tokens.token });
});

export const logoutUser = asyncHandler(async (req, res) => {
  await logout(req.user.id);
  res.clearCookie('refreshToken', { domain: config.cookieDomain, httpOnly: true });
  res.status(204).send();
});
