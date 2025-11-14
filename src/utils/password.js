import bcrypt from 'bcryptjs';

const SALT_ROUNDS = Number(process.env.PASSWORD_SALT_ROUNDS || 10);

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export const comparePassword = (password, hash) => bcrypt.compare(password, hash);