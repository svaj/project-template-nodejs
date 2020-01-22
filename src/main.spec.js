import { main } from './main';

describe('main', function () {
  let logger;

  it('should call logger.info once', function () {
    logger = { info: fake() };
    main(logger);
    return expect(logger.info.callCount).equal(1);
  });
});
