import dotenv from 'dotenv';

dotenv.config();

export const parseEnvBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return fallback;
    }
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '') {
      return fallback;
    }

    if (['true', '1', 'on', 'yes', 'y'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'off', 'no', 'n'].includes(normalized)) {
      return false;
    }
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return fallback;
};

export const getServerEnvFlags = (nodeEnv = process.env.NODE_ENV, env = process.env) => {
  const dev = nodeEnv !== 'production';
  const bypassFlag = env?.VITE_BYPASS_VALIDATION ?? env?.BYPASS_VALIDATION;
  const disableFlag = env?.VITE_DISABLE_SUBMISSION ?? env?.DISABLE_SUBMISSION;

  const bypassValidation = dev && parseEnvBoolean(bypassFlag);
  const disableSubmission = dev && parseEnvBoolean(disableFlag);

  return {
    dev,
    bypassValidation,
    disableSubmission,
  };
};
