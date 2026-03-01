import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ChallengePage } from './ChallengePage';
import * as engine from '../lib/engine';
import { GameProvider } from '../state/GameContext';

function renderTrainerHardChallenge() {
  return render(
    <GameProvider>
      <MemoryRouter initialEntries={['/trainer/term_forge/hard']}>
        <Routes>
          <Route path="/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
        </Routes>
      </MemoryRouter>
    </GameProvider>,
  );
}

function renderTrainerMediumChallenge() {
  return render(
    <GameProvider>
      <MemoryRouter initialEntries={['/trainer/term_forge/medium']}>
        <Routes>
          <Route path="/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
        </Routes>
      </MemoryRouter>
    </GameProvider>,
  );
}

function renderAdaptiveRecallChallenge() {
  return render(
    <GameProvider>
      <MemoryRouter initialEntries={['/trainer/adaptive-recall/medium']}>
        <Routes>
          <Route path="/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
          <Route path="/trainer" element={<div>trainer-root</div>} />
        </Routes>
      </MemoryRouter>
    </GameProvider>,
  );
}

function renderSprintChallenge() {
  return render(
    <GameProvider>
      <MemoryRouter initialEntries={['/trainer/sprint/easy']}>
        <Routes>
          <Route path="/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
          <Route path="/trainer" element={<div>trainer-root</div>} />
        </Routes>
      </MemoryRouter>
    </GameProvider>,
  );
}

describe('ChallengePage trainer hard mode', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows timer and consumes attempt on timeout', async () => {
    vi.spyOn(engine, 'getDifficultyConfig').mockImplementation((level) => {
      if (level !== 'hard') {
        return engine.difficultyConfig[level];
      }
      return {
        ...engine.difficultyConfig.hard,
        hardTimerSeconds: 1,
      };
    });
    renderTrainerHardChallenge();

    await screen.findByText(/Задание:/);
    expect(screen.getByText(/Таймер:/)).toBeInTheDocument();
    expect(
      await screen.findByText(/Время вышло|Попытки закончились/, undefined, { timeout: 5000 }),
    ).toBeInTheDocument();
  });
});

describe('ChallengePage trainer flow', () => {
  it('keeps the same question after submit until explicit next action', async () => {
    const user = userEvent.setup();
    renderTrainerMediumChallenge();

    await screen.findByText(/Задание:/);
    const promptBefore = screen.getByText(/Задание:/).textContent;

    const optionButton = screen
      .getAllByRole('button')
      .find((button) => button.className.includes('option-button'));
    expect(optionButton).toBeDefined();
    if (optionButton) {
      await user.click(optionButton);
    }
    await user.click(screen.getByRole('button', { name: 'Проверить ответ' }));

    await waitFor(() => {
      expect(screen.getByText(/Задание:/).textContent).toBe(promptBefore);
    });

    expect(screen.getByText(/Сохранено в профиле:/)).toBeInTheDocument();
  });

  it('starts adaptive recall session with dedicated mechanic title', async () => {
    renderAdaptiveRecallChallenge();

    await screen.findByText(/Задание:/);
    expect(screen.getByText('Adaptive Recall Cycle')).toBeInTheDocument();
    expect(screen.getByText(/Сессия:\s*1\s*\/\s*12/)).toBeInTheDocument();
  });

  it('shows sprint timer chip in liquidity sprint mode', async () => {
    renderSprintChallenge();

    await screen.findByText(/Задание:/);
    expect(screen.getByText(/Спринт:/)).toBeInTheDocument();
    expect(screen.getByText('Liquidity Sprint')).toBeInTheDocument();
  });
});
