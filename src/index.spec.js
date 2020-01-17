import { entrypoint } from './index';

describe('entrypoint', () => {
  let logger;
  let result;
  beforeEach(()=>{
    logger = {
      info: fake(),
    }
    result = entrypoint(logger)
  })
  it('should call logger.info once',()=>expect(logger.info.callCount).equal(1) )
})