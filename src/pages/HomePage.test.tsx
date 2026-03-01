import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';
import { GameProvider } from '../state/GameContext';

function renderHomePage() {
  return render(
    <GameProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </GameProvider>,
  );
}

describe('HomePage', () => {
  it('renders worlds catalog and primary world action', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', {
        name: 'Каталог учебных миров для перевода и терминологии',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Войти в мир' })).toHaveAttribute('href', '/world');
  });

  it('shows coming soon worlds as disabled actions', () => {
    renderHomePage();

    expect(screen.getAllByRole('button', { name: 'Скоро' })).toHaveLength(2);
  });
});
