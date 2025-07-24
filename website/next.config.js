const path = require('path');
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias['@ui-kit'] = require('path').resolve(__dirname, '../ui-kit/src');
    config.resolve.alias['@lovable'] = require('path').resolve(__dirname, '../lovable-src/src');
    config.resolve.alias['@shared'] = require('path').resolve(__dirname, '../shared');
    return config;
  },
}; 