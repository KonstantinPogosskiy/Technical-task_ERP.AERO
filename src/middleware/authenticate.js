import { verifyAccessToken } from '../utils/token.js';
import { AppError } from '../utils/errors.js';
import { getTokenByAccessJti } from '../services/tokenService.js';

export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const session = await getTokenByAccessJti(payload.jti);
    if (!session || session.revokedAt) {
      throw new AppError(401, 'Access token has been revoked');
    }

    req.user = {
      id: payload.sub,
      accessTokenJti: payload.jti,
      tokenRecordId: session.id,
    };

    next();
  } catch (error) {
    next(error);
  }
}

