import { sequelize } from './config.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    await sequelize.sync({ alter: false });
    logger.info('Database schema synchronized');
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}
