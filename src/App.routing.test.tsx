import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App world routing', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('redirects invalid world ids to home', async () => {
    window.history.pushState({}, '', '/world/not-a-world');
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Каталог учебных миров для перевода и терминологии' }),
      ).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/');
  });

  it('redirects foreign zone id in world route to that world map', async () => {
    window.history.pushState({}, '', '/world/cash-flow-nigeria/zone/cfs_abstract_delta');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Карта мира: Cash Flow Quest Nigeria' })).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/world/cash-flow-nigeria');
  });

  it('redirects foreign challenge id in world route to that world map', async () => {
    window.history.pushState(
      {},
      '',
      '/world/cash-flow-statement-performance/zone/cfs_abstract_delta/challenge/ng_gate_of_flow-term-1',
    );
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Карта мира: Cash Flow Statement Frontier' }),
      ).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/world/cash-flow-statement-performance');
  });
});
