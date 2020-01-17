import { entrypoint } from './index';

describe('entrypoint', function () {
  let logger;

  it('should call logger.info once', function () {
    logger = { info: fake() };
    entrypoint(logger);
    return expect(logger.info.callCount).equal(1);
  });
});
