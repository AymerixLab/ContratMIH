import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReservationPage } from './ReservationPage';
import type { ReservationData } from '../../lib/types';

vi.mock('../figma/ImageWithFallback', () => ({
  ImageWithFallback: (props: { alt: string }) => <div data-testid="image" aria-label={props.alt} />,
}));

const createReservation = (overrides: Partial<ReservationData> = {}): ReservationData => ({
  standType: null,
  standSize: '',
  standAngles: 0,
  electricityUpgrade: 'none',
  exteriorSpace: false,
  exteriorSurface: '',
  gardenCottage: false,
  microStand: false,
  coExposants: [],
  ...overrides,
});

const noop = () => {};

describe('ReservationPage', () => {
  it('disables navigation when prerequisites are not met', () => {
    const onNext = vi.fn();
    render(
      <ReservationPage
        reservationData={createReservation({ exteriorSpace: true, gardenCottage: false })}
        onReservationChange={noop}
        totalHT1={0}
        onBack={noop}
        onNext={onNext}
        addCoExposant={noop}
        removeCoExposant={noop}
        updateCoExposant={noop}
      />
    );

    const nextButton = screen.getByRole('button', { name: /suivant/i });
    expect(nextButton).toBeDisabled();
    userEvent.click(nextButton);
    expect(onNext).not.toHaveBeenCalled();
  });

  it('enables navigation when a stand is selected', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();

    render(
      <ReservationPage
        reservationData={createReservation({ standType: 'equipped', standSize: '12' })}
        onReservationChange={noop}
        totalHT1={1234}
        onBack={noop}
        onNext={onNext}
        addCoExposant={noop}
        removeCoExposant={noop}
        updateCoExposant={noop}
      />
    );

    const nextButton = screen.getByRole('button', { name: /suivant/i });
    expect(nextButton).toBeEnabled();
    await user.click(nextButton);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows garden cottage requirements based on selection', () => {
    const { rerender } = render(
      <ReservationPage
        reservationData={createReservation({ exteriorSpace: true, gardenCottage: false })}
        onReservationChange={noop}
        totalHT1={0}
        onBack={noop}
        onNext={noop}
        addCoExposant={noop}
        removeCoExposant={noop}
        updateCoExposant={noop}
      />
    );

    expect(screen.getByText(/Obligatoire avec espace extérieur/i)).toBeInTheDocument();

    rerender(
      <ReservationPage
        reservationData={createReservation({ standType: 'equipped', standSize: '12' })}
        onReservationChange={noop}
        totalHT1={0}
        onBack={noop}
        onNext={noop}
        addCoExposant={noop}
        removeCoExposant={noop}
        updateCoExposant={noop}
      />
    );

    expect(screen.getByText(/Incompatible avec stand intérieur/i)).toBeInTheDocument();
  });

  it('allows adding co-exposants when available', async () => {
    const user = userEvent.setup();
    const addCoExposant = vi.fn();

    render(
      <ReservationPage
        reservationData={createReservation({ standType: 'equipped', standSize: '15' })}
        onReservationChange={noop}
        totalHT1={0}
        onBack={noop}
        onNext={noop}
        addCoExposant={addCoExposant}
        removeCoExposant={noop}
        updateCoExposant={noop}
      />
    );

    const button = screen.getByRole('button', { name: /Ajouter un co-exposant/i });
    await user.click(button);
    expect(addCoExposant).toHaveBeenCalledTimes(1);
  });
});
