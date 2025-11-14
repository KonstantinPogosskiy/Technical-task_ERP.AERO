import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { AppError } from './errors.js';

dotenv.config();

const ACCESS_TOKEN_TTL = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 600);
const REFRESH_TOKEN_TTL = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7);
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT secrets are not configured. Please set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.');
}

export const generateAccessToken = (userId) => {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      sub: userId,
      jti,
      type: 'access',
    },
    ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_TTL,
    },
  );
  return { token, jti, expiresIn: ACCESS_TOKEN_TTL };
}

export const generateRefreshToken = (userId) => {
  const jti = uuidv4();
  const token = jwt.sign(
    {
      sub: userId,
      jti,
      type: 'refresh',
    },
    REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_TTL,
    },
  );
  return { token, jti, expiresIn: REFRESH_TOKEN_TTL };
}

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    throw new AppError(401, 'Invalid or expired access token');
  }
}

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }
}

export const hashToken = async (token) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(token, salt);
}

export const compareToken = async (token, hashedToken) => bcrypt.compare(token, hashedToken);