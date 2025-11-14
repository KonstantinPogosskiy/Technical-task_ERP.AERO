import User from '../db/models/User.js';

export const findUserById = async (userId) => await User.findByPk(userId);

export const createUser = async ({ id, passwordHash }) => await User.create({ id, passwordHash });