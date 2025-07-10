module.exports = {
  storybookConfigDir: './storybook',
  chromatic: {
    projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
    exitOnceUploaded: true,
  },
};
