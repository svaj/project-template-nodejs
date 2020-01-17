/* eslint-disable import/no-extraneous-dependencies */
const { assert, expect, should } = require('chai');
const {
  fake, mock, replace, restore, spy,
} = require('sinon');


global.expect = expect;
global.assert = assert;
global.should = should;

global.fake = fake;
global.spy = spy;
global.restore = restore;
global.replace = replace;
global.mock = mock;
