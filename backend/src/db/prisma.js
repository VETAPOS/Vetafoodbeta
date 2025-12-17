// Lightweight Prisma client wrapper. Exports { prisma, isPrismaReady }
// If @prisma/client is not installed or not generated, this will fall back
// to a graceful error helper so the rest of the app can continue in-memory.
let prisma = null;
let isPrismaReady = false;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
  isPrismaReady = true;
} catch (err) {
  // If Prisma client is not available, provide a helpful error when used.
  prisma = new Proxy({}, {
    get() {
      throw new Error('Prisma client is not available. Run `npm install` and `npx prisma generate` in backend.');
    }
  });
}

module.exports = { prisma, isPrismaReady };
