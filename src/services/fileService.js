import File from '../db/models/File.js';

export const createFileRecord = async ({
  userId,
  originalName,
  storedName,
  extension,
  mimeType,
  size,
}) => {
  const file = await File.create({
    userId,
    originalName,
    storedName,
    extension,
    mimeType,
    size,
  });
  return file.id;
}

export const listFiles = async ({ userId, page, pageSize }) => {
  const offset = (page - 1) * pageSize;

  const { count: total, rows } = await File.findAndCountAll({
    where: { userId },
    attributes: ['id', 'originalName', 'extension', 'mimeType', 'size', 'uploadedAt'],
    order: [['uploadedAt', 'DESC']],
    limit: pageSize,
    offset,
  });

  const items = rows.map((file) => file.toJSON());

  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    items,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
  };
}

export const findFileById = async (id, userId) => {
  const file = await File.findOne({
    where: {
      id,
      userId,
    },
  });
  return file ? file.toJSON() : null;
}

export const deleteFileRecord = async (id, userId) => {
  await File.destroy({
    where: {
      id,
      userId,
    },
  });
}

export const updateFileRecord = async ({
  id,
  userId,
  originalName,
  storedName,
  extension,
  mimeType,
  size,
}) => {
  await File.update(
    {
      originalName,
      storedName,
      extension,
      mimeType,
      size,
      uploadedAt: new Date(),
    },
    {
      where: {
        id,
        userId,
      },
    },
  );
}
