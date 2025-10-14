import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./components/pages/IdentityPage', () => ({
  IdentityPage: ({ onNext }: { onNext: () => void }) => (
    <button onClick={onNext}>identity-next</button>
  ),
}));

vi.mock('./components/pages/ReservationPage', () => ({
  ReservationPage: (props: any) => {
    const setReservation = () => {
      props.onReservationChange('standType', 'equipped');
      props.onReservationChange('standSize', '12');
      props.onReservationChange('standAngles', 1);
      props.onReservationChange('electricityUpgrade', '2kw');
      props.onReservationChange('coExposants', [
        { id: 'co-1', nomEntreprise: 'Co', nomResponsable: '', prenomResponsable: '', telResponsable: '', mailResponsable: '' },
      ]);
    };

    return (
      <div>
        <button onClick={setReservation}>reservation-set</button>
        <button onClick={props.onNext}>reservation-next</button>
        <div data-testid="total-ht1">{props.totalHT1}</div>
      </div>
    );
  },
}));

vi.mock('./components/pages/AmenagementPage', () => ({
  AmenagementPage: (props: any) => {
    const setAmenagement = () => {
      props.onAmenagementChange('comptoir', 2);
      props.onAmenagementChange('scanBadges', true);
    };
    return (
      <div>
        <button onClick={setAmenagement}>amenagement-set</button>
        <button onClick={props.onNext}>amenagement-next</button>
        <div data-testid="total-ht2">{props.totalHT2}</div>
      </div>
    );
  },
}));

vi.mock('./components/pages/VisibilitePage', () => ({
  VisibilitePage: (props: any) => {
    const setVisibilite = () => {
      props.onVisibiliteChange('packSignaletiqueComplet', true);
      props.onVisibiliteChange('signaletiqueComptoir', true);
    };
    return (
      <div>
        <button onClick={setVisibilite}>visibilite-set</button>
        <button onClick={props.onNext}>visibilite-next</button>
        <div data-testid="total-ht3">{props.totalHT3}</div>
        <div data-testid="total-ht4">{props.totalHT4}</div>
      </div>
    );
  },
}));

vi.mock('./components/pages/EngagementPage', () => ({
  EngagementPage: (props: any) => (
    <div>
      <div data-testid="total-ht">{props.totalHT}</div>
      <div data-testid="total-tva">{props.tva}</div>
      <div data-testid="total-ttc">{props.totalTTC}</div>
      <button onClick={() => props.onEngagementChange('accepteReglement', true)}>accept-rules</button>
      <button onClick={props.onComplete}>engagement-complete</button>
      <button onClick={props.onBack}>engagement-back</button>
    </div>
  ),
}));

vi.mock('./components/pages/ThanksPage', () => ({
  ThanksPage: () => <div>thanks-page</div>,
}));

vi.mock('./lib/pdfFiller', () => ({
  fillAndDownloadContractPdf: vi.fn(),
  downloadContractPdfFieldsCsv: vi.fn(),
}));

vi.mock('./lib/documentGenerator', () => ({
  generateContractZip: vi.fn(() => Promise.resolve()),
}));

vi.mock('./lib/api', () => ({
  submitFormData: vi.fn(() => Promise.resolve()),
}));

import App from './App';
import { generateContractZip } from './lib/documentGenerator';
import { submitFormData } from './lib/api';

describe('App happy path', () => {
  it('walks through steps and submits totals without regression', async () => {
    const user = userEvent.setup();
    const submitMock = vi.mocked(submitFormData);
    const zipMock = vi.mocked(generateContractZip);

    render(<App />);

    await user.click(screen.getByText('identity-next'));

    await user.click(await screen.findByText('reservation-set'));
    await waitFor(() => expect(screen.getByTestId('total-ht1').textContent).toBe('4045'));
    await user.click(await screen.findByText('reservation-next'));

    await user.click(await screen.findByText('amenagement-set'));
    await waitFor(() => expect(screen.getByTestId('total-ht2').textContent).toBe('330'));
    await user.click(await screen.findByText('amenagement-next'));

    await user.click(await screen.findByText('visibilite-set'));
    await waitFor(() => {
      expect(screen.getByTestId('total-ht3').textContent).toBe('150');
      expect(screen.getByTestId('total-ht4').textContent).toBe('1680');
    });
    await user.click(await screen.findByText('visibilite-next'));

    await waitFor(() => {
      expect(screen.getByTestId('total-ht').textContent).toBe('6205');
      expect(screen.getByTestId('total-tva').textContent).toBe('1241');
      expect(screen.getByTestId('total-ttc').textContent).toBe('7446');
    });

    await user.click(screen.getByText('accept-rules'));
    await user.click(screen.getByText('engagement-complete'));

    await waitFor(() => expect(submitMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(zipMock).toHaveBeenCalledTimes(1));

    const payload = submitMock.mock.calls[0][0];
    expect(payload.totals).toEqual({
      totalHT1: 4045,
      totalHT2: 330,
      totalHT3: 150,
      totalHT4: 1680,
      totalHT: 6205,
      tva: 1241,
      totalTTC: 7446,
    });

    const zipArgs = zipMock.mock.calls[0];
    const totalsSlice = zipArgs.slice(-7);
    expect(totalsSlice).toEqual([4045, 330, 150, 1680, 6205, 1241, 7446]);

    expect(await screen.findByText('thanks-page')).toBeInTheDocument();
  });
});
