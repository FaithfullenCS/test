import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from './HomePage';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
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
    expect(screen.getAllByRole('link', { name: 'Войти в мир' })).toHaveLength(2);
  });

  it('shows coming soon worlds as disabled actions', () => {
    renderHomePage();

    expect(screen.getAllByRole('button', { name: 'Скоро' })).toHaveLength(1);
  });
});
