'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PUBLISH_ENV: '"test"',
  LOGOUT_URL: '"http://localhost:4399/#/login"',
  
});
