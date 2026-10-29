import { test, expect } from '@playwright/test';
test('sample, repeated grid changes, row preview, downloads and reset', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Make a little/ }),
  ).toBeVisible();
  await expect(page.locator('#tiles')).toHaveText('576');
  await page.getByLabel('Grid size').selectOption('16');
  await expect(page.locator('#tiles')).toHaveText('256');
  await page.locator('#row').fill('5');
  await expect(page.locator('#row-label')).toHaveText('5 / 16');
  await page.getByLabel('Show studs').uncheck();
  await page.getByLabel('Show studs').check();
  await page.getByLabel('Grid size').selectOption('32');
  await expect(page.locator('#tiles')).toHaveText('1024');
  await expect(page.locator('#row-label')).toHaveText('32 / 32');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Placement guide/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('mosaic-guide.txt');
  const partsPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Parts list/ }).click();
  expect((await partsPromise).suggestedFilename()).toBe('mosaic-parts.csv');
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await page.reload();
  await expect(page.locator('#tiles')).toHaveText('576');
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((body) => body.clientWidth),
  );
});
test('preset switching and reset restore the original scene', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Choose a preset').selectOption('night');
  await expect(page.locator('#image-name')).toHaveText(
    'Preset / Moonlit coast',
  );
  await page.getByLabel('Grid size').selectOption('16');
  await page.getByRole('button', { name: 'Reset sample' }).click();
  await expect(page.locator('#image-name')).toContainText('Coastal sunrise');
  await expect(page.locator('#tiles')).toHaveText('576');
  await expect(page.getByLabel('Choose a preset')).toHaveValue('coast');
});
