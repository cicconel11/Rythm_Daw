const path = require('path');
module.exports = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.alias['@ui-kit'] = path.resolve(__dirname, '../ui-kit/src');
    config.resolve.alias['@ui-dev'] = path.resolve(__dirname, '../ui-dev/src');
    return config;
  },
}; 