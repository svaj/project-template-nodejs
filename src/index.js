import { Logger } from './lib/logger';

export const loggerInstance = Logger({
  level: 'debug',
});


export const entrypoint = (logger) => {
  logger.info('Hello world.');
};


entrypoint(loggerInstance);
