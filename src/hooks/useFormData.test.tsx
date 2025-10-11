import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useFormData } from './useFormData';

const mockFetchResponse = (data: unknown) => ({
  ok: true,
  json: async () => data,
}) as Response;

describe('useFormData hook', () => {
  it('formats and validates SIRET and TVA numbers', () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handleSiretChange('12 34 56 78 90 12 34');
    });
    expect(result.current.formData.siret).toBe('12345678901234');
    expect(result.current.isSiretValid(result.current.formData.siret)).toBe(true);

    act(() => {
      result.current.handleTvaIntraChange('fr 123 456 789 01');
    });
    expect(result.current.formData.tvaIntra).toBe('FR12345678901');
    expect(result.current.isTvaIntraValid(result.current.formData.tvaIntra)).toBe(true);
  });

  it('normalises phone numbers and validates minimum length', () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handlePhoneChange('tel', '+33 6 12 34 56 78');
    });

    expect(result.current.formData.tel).toBe('33612345678');
    expect(result.current.isPhoneValid(result.current.formData.tel)).toBe(true);
  });

  it('detects country via postal code lookup and auto fills single city match', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      mockFetchResponse([{ nom: 'Paris', codesPostaux: ['75001'] }])
    );

    const { result } = renderHook(() => useFormData());

    await act(async () => {
      result.current.handleCodePostalChange('codePostal', '75001');
    });

    await waitFor(() => {
      expect(result.current.formData.pays).toBe('FRANCE');
      expect(result.current.formData.ville).toBe('PARIS');
      expect(result.current.showVilleSuggestions).toBe(false);
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://geo.api.gouv.fr/communes?codePostal=75001&fields=nom,codesPostaux'
    );
  });

  it('resets country when postal code format is invalid', () => {
    const { result } = renderHook(() => useFormData());

    act(() => {
      result.current.handleInputChange('pays', 'FRANCE');
      result.current.handleCodePostalChange('codePostal', 'abc');
    });

    expect(result.current.formData.pays).toBe('');
    expect(result.current.villeSuggestions).toEqual([]);
  });
});
