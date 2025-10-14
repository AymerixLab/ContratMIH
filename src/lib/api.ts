import type { AmenagementData, EngagementData, FormData as SubmissionFormData, ReservationData, VisibiliteData } from './types';

export interface SubmissionTotals {
  totalHT1: number;
  totalHT2: number;
  totalHT3: number;
  totalHT4: number;
  totalHT: number;
  tva: number;
  totalTTC: number;
}

export interface SubmissionPayload {
  formData: SubmissionFormData;
  reservationData: ReservationData;
  amenagementData: AmenagementData;
  visibiliteData: VisibiliteData;
  engagementData: EngagementData;
  totals: SubmissionTotals;
  submittedAt: string;
}

const defaultBaseUrl = typeof window === 'undefined' ? '' : window.location.origin;
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || defaultBaseUrl;

export interface SubmissionResponse {
  id: string;
}

export interface UploadDocumentResponse {
  id: string;
}

export async function submitFormData(payload: SubmissionPayload): Promise<SubmissionResponse> {
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

  const data = await response.json().catch(() => null);
  if (!data || typeof data.id !== 'string') {
    throw new Error('Réponse du serveur invalide');
  }

  return data as SubmissionResponse;
}

export async function uploadSubmissionDocument(
  submissionId: string,
  file: Blob,
  filename: string,
  options?: {
    formDataFactory?: () => FormData;
  }
): Promise<UploadDocumentResponse> {
  const formDataFactory = options?.formDataFactory ?? (() => new FormData());
  const formData = formDataFactory();
  let fileToSend: Blob | File = file;

  if (typeof File !== 'undefined' && !(file instanceof File)) {
    fileToSend = new File([file], filename, { type: file.type || 'application/zip' });
  }

  formData.append('file', fileToSend, filename);

  const response = await fetch(`${API_BASE_URL}/api/submissions/${submissionId}/documents`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await safeParseError(response);
    throw new Error(message);
  }

  const data = await response.json().catch(() => null);
  if (!data || typeof data.id !== 'string') {
    throw new Error('Réponse du serveur invalide');
  }

  return data as UploadDocumentResponse;
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
