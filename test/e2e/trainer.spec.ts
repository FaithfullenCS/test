import { expect, test } from '@playwright/test';

test('trainer flow opens and completes a 12-task session', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Открыть тренажёр' }).click();
  await expect(page.getByRole('heading', { name: 'Тренажёр механик' })).toBeVisible();

  const termForgeCard = page.locator('.trainer-card', { hasText: 'Term Forge' }).first();
  await termForgeCard.getByRole('button', { name: 'Выбрать сложность' }).click();
  await termForgeCard.getByRole('link', { name: 'Старт 12 задач' }).nth(2).click();

  await expect(page).toHaveURL(/\/trainer\/term_forge\/hard/);
  await expect(page.getByText(/Задание:/)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Сессия:\s*1\s*\/\s*12/)).toBeVisible({ timeout: 10000 });

  for (let index = 0; index < 12; index += 1) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const nextButtonVisible = await page.getByRole('button', { name: /Следующее задание|К итогам сессии/ }).isVisible();
      if (nextButtonVisible) {
        break;
      }

      await page.locator('.option-button').first().click();
      await page.getByRole('button', { name: 'Проверить ответ' }).click();
    }

    await page
      .getByRole('button', {
        name: index === 11 ? 'К итогам сессии' : 'Следующее задание',
      })
      .click();
  }

  await expect(page.getByRole('heading', { name: 'Сессия завершена' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ещё 12 задач' })).toBeVisible();
});
