import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CasePage } from './CasePage';
import { GameProvider } from '../state/GameContext';

function renderCase() {
  return render(
    <GameProvider>
      <MemoryRouter initialEntries={['/case/gate_of_flow/gate_of_flow-case-1']}>
        <Routes>
          <Route path="/case/:zoneId/:scenarioId" element={<CasePage />} />
        </Routes>
      </MemoryRouter>
    </GameProvider>,
  );
}

describe('CasePage', () => {
  it('renders case ladder flow and allows answer check', async () => {
    const user = userEvent.setup();
    renderCase();

    await screen.findByText(/Кейс: Старт потока/);
    expect(screen.getByText(/Шаг 1 \/ 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeInTheDocument();

    const option = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('option-button'));
    if (option) {
      await user.click(option);
      await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
      expect(screen.getByText(/LP|Осталось попыток/)).toBeInTheDocument();
    }
  });
});
