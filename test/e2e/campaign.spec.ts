import { expect, test } from '@playwright/test';

test('campaign shell is accessible and map opens', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: 'Каталог учебных миров для перевода и терминологии',
    }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Начать кампанию' }).click();
  await expect(page.getByRole('heading', { name: 'Карта мира статьи' })).toBeVisible();

  await page.getByRole('link', { name: 'Войти в зону' }).first().click();
  await expect(page.getByRole('heading', { name: 'Врата Потока' })).toBeVisible();
});
