import UserSession from '../db/models/UserSession.js';

export const createSession = async ({
  userId,
  accessJti,
  accessExpiresAt,
  refreshJti,
  refreshExpiresAt,
  refreshTokenHash,
}) => {
  const session = await UserSession.create({
    userId,
    accessJti,
    refreshJti,
    accessExpiresAt,
    refreshExpiresAt,
    refreshTokenHash,
  });

  return session.id;
}

export const getTokenByAccessJti = async (accessJti) => {
  const session = await UserSession.findOne({ where: { accessJti } });
  return session ? session.toJSON() : null;
};

export const getTokenByRefreshJti = async (refreshJti) => {
  const session = await UserSession.findOne({
    where: { refreshJti },
  });
  return session ? session.toJSON() : null;
}

export const revokeSessionById = async (sessionId) => {
  await UserSession.update(
    { revokedAt: new Date() },
    {
      where: {
        id: sessionId,
        revokedAt: null,
      },
    },
  );
}

export const revokeSessionByRefreshJti = async (refreshJti) => {
  await UserSession.update(
    { revokedAt: new Date() },
    {
      where: {
        refreshJti,
        revokedAt: null,
      },
    },
  );
}
