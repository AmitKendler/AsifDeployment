
/**
 * Module dependencies.
 */

var path = require('path');
var development = require('./env/development');
var defaults = {
  root: path.normalize(__dirname + '/..')
};

/**
 * Expose
 */

module.exports = {
  development: Object.assign({}, development, defaults),
}[process.env.NODE_ENV || 'development'];
