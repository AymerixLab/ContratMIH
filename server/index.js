import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';
import { getSubmissionEnv } from './validation.js';

const createDisabledPrisma = () => {
  const disabledError = () => {
    throw new Error('Database access désactivée pendant le développement (VITE_DISABLE_SUBMISSION=true).');
  };

  return {
    submission: { create: disabledError },
    coExposant: { create: disabledError },
    document: {
      create: disabledError,
      findFirst: async () => null,
    },
    $transaction: async () => {
      throw new Error('Transactions indisponibles : soumission désactivée.');
    },
    $disconnect: async () => undefined,
  };
};

const nodeEnv = process.env.NODE_ENV;
const { disableSubmission } = getSubmissionEnv(nodeEnv, process.env);

const prisma = disableSubmission ? createDisabledPrisma() : new PrismaClient();
const port = process.env.PORT || 8080;

const app = createApp(prisma, {
  disableSubmission,
});

async function start() {
  if (disableSubmission) {
    console.warn('Soumission désactivée : démarrage du serveur sans connexion base de données.');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    return;
  }

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
