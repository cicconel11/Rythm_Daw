const path = require('path');
module.exports = {
  reactStrictMode: true,
  webpack(cfg) {
    cfg.resolve.alias['@studio'] = path.resolve(__dirname, '../Studio Hub Project/src')
    cfg.resolve.alias['@ui-kit'] = path.resolve(__dirname, '../ui-kit/src')
    return cfg
  },
}; 