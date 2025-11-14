import { AppError } from '../utils/errors.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  compareToken,
  verifyRefreshToken,
} from '../utils/token.js';
import { createUser, findUserById } from './userService.js';
import {
  createSession,
  getTokenByRefreshJti,
  revokeSessionById,
} from './tokenService.js';

const expirationDateFromNow = (seconds) => {
  return new Date(Date.now() + seconds * 1000);
}

const issueTokensForUser = async (userId) => {
  const {
    token: accessToken,
    jti: accessJti,
    expiresIn: accessTtl,
  } = generateAccessToken(userId);

  const {
    token: refreshToken,
    jti: refreshJti,
    expiresIn: refreshTtl,
  } = generateRefreshToken(userId);

  const refreshTokenHash = await hashToken(refreshToken);

  const sessionId = await createSession({
    userId,
    accessJti,
    accessExpiresAt: expirationDateFromNow(accessTtl),
    refreshJti,
    refreshExpiresAt: expirationDateFromNow(refreshTtl),
    refreshTokenHash,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: accessTtl,
    sessionId,
  };
}

export const signup = async ({ id, password }) => {
  if (!id || !password) {
    throw new AppError(400, 'id and password are required');
  }

  const existingUser = await findUserById(id);
  if (existingUser) {
    throw new AppError(409, 'User already exists');
  }

  const passwordHash = await hashPassword(password);
  await createUser({ id, passwordHash });

  return issueTokensForUser(id);
}

export const signin = async ({ id, password }) => {
  if (!id || !password) {
    throw new AppError(400, 'id and password are required');
  }

  const user = await findUserById(id);
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }

  const matched = await comparePassword(password, user.passwordHash);
  if (!matched) {
    throw new AppError(401, 'Invalid credentials');
  }

  return issueTokensForUser(user.id);
}

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(400, 'Refresh token is required');
  }

  const payload = verifyRefreshToken(refreshToken);
  const session = await getTokenByRefreshJti(payload.jti);

  if (!session || session.revokedAt) {
    throw new AppError(401, 'Refresh token has been revoked');
  }

  if (new Date(session.refreshExpiresAt) < new Date()) {
    throw new AppError(401, 'Refresh token expired');
  }
  const matches = await compareToken(refreshToken, session.refreshTokenHash);
  if (!matches) {
    throw new AppError(401, 'Refresh token mismatch');
  }
  await revokeSessionById(session.id);

  return issueTokensForUser(session.userId);
}

export const logout = async (sessionId) => {
  if (!sessionId) {
    throw new AppError(400, 'Session identifier is required');
  }
  await revokeSessionById(sessionId);
}