import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';

const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

const app = createApp(prisma);

async function start() {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

start();

const shutdown = async () => {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
