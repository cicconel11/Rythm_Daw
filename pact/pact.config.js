module.exports = {
  consumer: 'Rythm_Daw_UI',
  provider: 'Rythm_Daw_API',
  port: 1234,
  log: 'logs/pact.log',
  dir: 'pacts',
  spec: 2,
  consumerVersion: require('../package.json').version,
  pactBroker: process.env.PACT_BROKER_URL,
  publishVerificationResults: true,
  providerBaseUrl: process.env.PROVIDER_BASE_URL,
  tags: [process.env.TAG || 'latest'],
};
