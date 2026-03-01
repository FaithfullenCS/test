import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TestWorldProvider } from '../test-utils';
import { CasePage } from './CasePage';

function renderCase() {
  return render(
    <TestWorldProvider>
      <MemoryRouter initialEntries={['/world/cash-flow-nigeria/case/ng_gate_of_flow/ng_gate_of_flow-case-1']}>
        <Routes>
          <Route path="/world/:worldId/case/:zoneId/:scenarioId" element={<CasePage />} />
        </Routes>
      </MemoryRouter>
    </TestWorldProvider>,
  );
}

describe('CasePage', () => {
  it('renders case ladder flow and allows answer check', async () => {
    const user = userEvent.setup();
    renderCase();

    await screen.findByText(/Кейс: Objective Alignment/);
    expect(screen.getByText(/Шаг 1 \/ 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Проверить ответ' })).toBeInTheDocument();

    const option = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('option-button'));
    if (option) {
      await user.click(option);
      await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));
      expect(screen.getByText(/Объяснение:/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Следующий шаг|К итогам кейса/ })).toBeInTheDocument();
    }
  });
});
