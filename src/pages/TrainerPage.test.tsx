import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { TrainerPage } from './TrainerPage';
import { GameProvider } from '../state/GameContext';

function renderTrainer() {
  return render(
    <GameProvider>
      <MemoryRouter>
        <TrainerPage />
      </MemoryRouter>
    </GameProvider>,
  );
}

describe('TrainerPage', () => {
  it('shows mechanics and opens nested difficulty cards', async () => {
    const user = userEvent.setup();
    renderTrainer();

    expect(screen.getByRole('heading', { name: 'Тренажёр механик' })).toBeInTheDocument();
    expect(screen.getByLabelText('Выбор режима Term Forge')).toBeInTheDocument();
    expect(screen.getByLabelText('Выбор режима Adaptive Recall Cycle')).toBeInTheDocument();
    expect(screen.getByLabelText('Выбор режима Liquidity Sprint')).toBeInTheDocument();
    expect(screen.getByLabelText('Выбор режима Case Ladder')).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: 'Выбрать сложность' })[0]);

    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hard').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Старт 12 задач' }).length).toBeGreaterThan(0);
  });
});
