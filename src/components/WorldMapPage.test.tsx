import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { WorldMapPage } from '../pages/WorldMapPage';
import { TestWorldProvider } from '../test-utils';
import { PlayableWorldId } from '../types/game';

function renderMap(worldId: PlayableWorldId = 'cash-flow-nigeria') {
  return render(
    <TestWorldProvider worldId={worldId}>
      <MemoryRouter initialEntries={[`/world/${worldId}`]}>
        <Routes>
          <Route path="/world/:worldId" element={<WorldMapPage />} />
        </Routes>
      </MemoryRouter>
    </TestWorldProvider>,
  );
}

describe('WorldMapPage', () => {
  it('shows map title and a single detail panel', () => {
    renderMap();

    expect(screen.getByText('Карта мира: Cash Flow Quest Nigeria')).toBeInTheDocument();
    expect(screen.getAllByTestId('world-map-details')).toHaveLength(1);
  });

  it('selects a valid unlocked zone by default and shows enter action', () => {
    renderMap();

    const details = screen.getByTestId('world-map-details');
    expect(within(details).getByRole('heading', { name: 'Врата Потока' })).toBeInTheDocument();
    expect(within(details).getByRole('link', { name: 'Войти в зону' })).toBeInTheDocument();
  });

  it('shows locked note and hides enter action for locked zones', async () => {
    const user = userEvent.setup();
    renderMap();

    await user.click(screen.getByRole('button', { name: /Зона 2: Операционный Квартал/i }));

    const details = screen.getByTestId('world-map-details');
    expect(within(details).getByRole('heading', { name: 'Операционный Квартал' })).toBeInTheDocument();
    expect(
      within(details).getByText(
        'Заблокировано: завершите предыдущую зону с точностью от 70%.',
      ),
    ).toBeInTheDocument();
    expect(within(details).queryByRole('link', { name: 'Войти в зону' })).not.toBeInTheDocument();
  });

  it('switches active zone when clicking another city node', async () => {
    const user = userEvent.setup();
    renderMap();

    const zone1 = screen.getByRole('button', { name: /Зона 1: Врата Потока/i });
    const zone2 = screen.getByRole('button', { name: /Зона 2: Операционный Квартал/i });

    expect(zone1).toHaveAttribute('aria-pressed', 'true');
    expect(zone2).toHaveAttribute('aria-pressed', 'false');

    await user.click(zone2);

    expect(zone1).toHaveAttribute('aria-pressed', 'false');
    expect(zone2).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders another world with different map theme and landmarks', () => {
    renderMap('cash-flow-statement-performance');

    expect(screen.getByText('Карта мира: Cash Flow Statement Frontier')).toBeInTheDocument();
    expect(screen.getByText('Delta Abstract')).toBeInTheDocument();
  });
});
