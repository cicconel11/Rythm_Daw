const withTM = require('next-transpile-modules')([
  'lovable-src/ui-kit',
  '../shared',
]);
const path = require('path');

module.exports = withTM({
  reactStrictMode: true,
  compiler: { styledComponents: true },
  webpack(config) {
    // Remove manual @ui-kit alias; handled by transpile-modules and tsconfig
    config.resolve.alias['@lovable'] = path.resolve(__dirname, '../lovable-src/src');
    config.resolve.alias['@shared'] = path.resolve(__dirname, '../shared');
    return config;
  },
}); 