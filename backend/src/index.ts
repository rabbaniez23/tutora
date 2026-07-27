// Fix: BigInt cannot be serialized by JSON.stringify natively.
// This patch converts all BigInt values to strings in JSON responses.
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import { env } from '@/config/env';
import { buildApp } from './app';

async function main() {
  const app = await buildApp();

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📚 Swagger docs at http://localhost:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
