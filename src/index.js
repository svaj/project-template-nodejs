// eslint-disable-next-line no-global-assign
require = require('esm')(module/* , options */);
module.exports = require('./main.js');

module.exports.main().listen(process.env.PORT || 3000);
