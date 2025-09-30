import { AmenagementData, EngagementData, FormData, ReservationData, VisibiliteData } from './types';

export interface SubmissionTotals {
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
}

export interface SubmissionPayload {
  formData: FormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
  engagementData: EngagementData;
  totals: SubmissionTotals;
  submittedAt: string;
}

const defaultBaseUrl = typeof window === 'undefined' ? '' : window.location.origin;
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || defaultBaseUrl;

export async function submitFormData(payload: SubmissionPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message);
  }
}

async function safeParseError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data?.error) {
      return data.error;
    }
    return `API error ${response.status}`;
  } catch (_error) {
    return `API error ${response.status}`;
  }
}
