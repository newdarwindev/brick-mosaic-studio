import { test, expect } from '@playwright/test';
test('counter supports repeated actions, reset, and reload', async ({
  page,
}) => {
  await page.goto('/');
  const count = page.getByRole('status', { name: 'Count' });
  await expect(count).toHaveText('0');
  await page.getByRole('button', { name: 'Decrease count' }).click();
  await expect(count).toHaveText('0');
  await page
    .getByRole('button', { name: 'Increase count' })
    .click({ clickCount: 3 });
  await expect(count).toHaveText('3');
  await page.getByRole('button', { name: 'Decrease count' }).click();
  await expect(count).toHaveText('2');
  await page.getByRole('button', { name: 'Reset counter' }).click();
  await expect(count).toHaveText('0');
  await page.getByRole('button', { name: 'Increase count' }).click();
  await page.reload();
  await expect(count).toHaveText('0');
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((body) => body.clientWidth),
  );
});
