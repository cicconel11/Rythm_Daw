import { setupAuth } from './auth.setup';

export default async function globalSetup() {
  await setupAuth();
}
