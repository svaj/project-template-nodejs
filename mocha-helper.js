import { assert, expect, should } from 'chai';
import { fake, mock, replace, restore, spy } from 'sinon';


global.expect = expect;
global.assert = assert;
global.should = should;

global.fake = fake;
global.spy = spy;
global.restore = restore;
global.replace = replace;
global.mock = mock

