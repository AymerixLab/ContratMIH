import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.scrollTo = vi.fn();
  }
});

export const mockFetch = (implementation: Parameters<typeof vi.fn>[0] = () => Promise.resolve(new Response())) => {
  const fetchMock = vi.fn(implementation);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};
