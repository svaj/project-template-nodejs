import { Logger } from './lib/logger';

export const loggerInstance = Logger({
  level: 'debug',
});


export const main = (logger = loggerInstance) => {
  logger.info('Hello world.');
};
export default main;
