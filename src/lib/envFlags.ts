declare const __APP_ENV__: {
  VITE_DISABLE_SUBMISSION?: string | null;
  VITE_BYPASS_VALIDATION?: string | null;
  VITE_DEV_PREFILL?: string | null;
  VITE_API_BASE_URL?: string | null;
} | undefined;

type RawEnv = {
  DEV?: boolean;
  VITE_DISABLE_SUBMISSION?: unknown;
  VITE_BYPASS_VALIDATION?: unknown;
  VITE_DEV_PREFILL?: unknown;
  VITE_API_BASE_URL?: unknown;
};

const parseEnvBoolean = (value: unknown, fallback = false): boolean => {
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

const getRawEnv = (): RawEnv => {
  const raw: RawEnv = {
    DEV: import.meta.env.DEV,
    VITE_DISABLE_SUBMISSION:
      import.meta.env.VITE_DISABLE_SUBMISSION ?? __APP_ENV__?.VITE_DISABLE_SUBMISSION ?? undefined,
    VITE_BYPASS_VALIDATION:
      import.meta.env.VITE_BYPASS_VALIDATION ?? __APP_ENV__?.VITE_BYPASS_VALIDATION ?? undefined,
    VITE_DEV_PREFILL:
      import.meta.env.VITE_DEV_PREFILL ?? __APP_ENV__?.VITE_DEV_PREFILL ?? undefined,
    VITE_API_BASE_URL:
      import.meta.env.VITE_API_BASE_URL ?? __APP_ENV__?.VITE_API_BASE_URL ?? undefined,
  };

  if (raw.DEV === undefined && typeof window !== 'undefined') {
    const host = window.location.hostname;
    raw.DEV = host === 'localhost' || host === '127.0.0.1';
  }

  return raw;
};

export const isDevEnvironment = (): boolean => {
  const isDev = Boolean(getRawEnv().DEV);
  return isDev;
};

export const isValidationBypassedFlag = (): boolean => {
  if (!isDevEnvironment()) {
    return false;
  }
  const { VITE_BYPASS_VALIDATION } = getRawEnv();
  const value = parseEnvBoolean(VITE_BYPASS_VALIDATION);
  return value;
};

export const isSubmissionDisabledFlag = (): boolean => {
  if (!isDevEnvironment()) {
    return false;
  }
  const { VITE_DISABLE_SUBMISSION } = getRawEnv();
  const value = parseEnvBoolean(VITE_DISABLE_SUBMISSION);
  return value;
};

export const isDevPrefillEnabled = (): boolean => {
  if (!isDevEnvironment()) {
    return false;
  }
  const { VITE_DEV_PREFILL } = getRawEnv();
  if (VITE_DEV_PREFILL !== undefined) {
    const value = parseEnvBoolean(VITE_DEV_PREFILL);
    return value;
  }
  const computed = isSubmissionDisabledFlag() || isValidationBypassedFlag();
  return computed;
};

export const getApiBaseUrl = (): string | undefined => {
  const { VITE_API_BASE_URL } = getRawEnv();
  const value = VITE_API_BASE_URL;
  const result = typeof value === 'string' ? value : undefined;
  return result;
};

export const getClientEnvFlags = () => {
  const flags = {
    dev: isDevEnvironment(),
    bypassValidation: isValidationBypassedFlag(),
    disableSubmission: isSubmissionDisabledFlag(),
    prefillEnabled: isDevPrefillEnabled(),
    apiBaseUrl: getApiBaseUrl(),
  };
  return flags;
};

export { parseEnvBoolean };
