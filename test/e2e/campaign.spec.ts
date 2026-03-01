import { expect, test } from '@playwright/test';

test('both worlds are accessible and maps differ by theme', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Каталог учебных миров для перевода и терминологии',
    }),
  ).toBeVisible();

  const nigeriaCard = page.locator('.world-card', { hasText: 'Cash Flow Quest: Nigeria' });
  await nigeriaCard.getByRole('link', { name: 'Войти в мир' }).click();

  await expect(page).toHaveURL(/\/world\/cash-flow-nigeria$/);
  await expect(page.getByRole('heading', { name: 'Карта мира: Cash Flow Quest Nigeria' })).toBeVisible();
  await expect(page.getByTestId('world-map-details').locator('.zone-order')).toContainText('Бухта Истоков');

  await page.getByRole('link', { name: 'Главная' }).click();
  const statementCard = page.locator('.world-card', { hasText: 'Cash Flow Statement Frontier' });
  await statementCard.getByRole('link', { name: 'Войти в мир' }).click();

  await expect(page).toHaveURL(/\/world\/cash-flow-statement-performance$/);
  await expect(page.getByRole('heading', { name: 'Карта мира: Cash Flow Statement Frontier' })).toBeVisible();
  await expect(page.getByTestId('world-map-details').locator('.zone-order')).toContainText('Delta Abstract');
});
