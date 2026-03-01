import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as engine from '../lib/engine';
import { TestWorldProvider } from '../test-utils';
import { ChallengePage } from './ChallengePage';

function renderTrainerChallenge(path: string) {
  return render(
    <TestWorldProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/world/:worldId/trainer/:mechanic/:difficulty" element={<ChallengePage />} />
          <Route path="/world/:worldId/trainer" element={<div>trainer-root</div>} />
        </Routes>
      </MemoryRouter>
    </TestWorldProvider>,
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

    renderTrainerChallenge('/world/cash-flow-nigeria/trainer/term_forge/hard');

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
    renderTrainerChallenge('/world/cash-flow-nigeria/trainer/term_forge/medium');

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

  it('starts adaptive recall session with themed packet info', async () => {
    renderTrainerChallenge('/world/cash-flow-nigeria/trainer/adaptive-recall/medium');

    await screen.findByText(/Задание:/);
    expect(screen.getByText(/Пакет:/)).toBeInTheDocument();
    expect(screen.getByText(/Сессия:\s*1\s*\/\s*12/)).toBeInTheDocument();
  });

  it('shows sprint timer chip in liquidity sprint mode', async () => {
    renderTrainerChallenge('/world/cash-flow-nigeria/trainer/sprint/easy');

    await screen.findByText(/Задание:/);
    expect(screen.getByText(/Спринт:/)).toBeInTheDocument();
    expect(screen.getByText(/Пакет:/)).toBeInTheDocument();
  });
});
