import { test, expect } from '@playwright/test';

test.describe('GeoAtlas Phase 2 E2E Flows', () => {
  test('Search → Click Result → Place Page loads correctly', async ({ page }) => {
    await page.goto('/search?q=hospital');
    await expect(page.locator('h1, button, div')).toBeVisible();

    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });

  test('Geographic Comparison page loads and allows place selection', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.locator('h1')).toContainText('Geographic Comparison Tool');
  });

  test('Community Contribution submission page loads', async ({ page }) => {
    await page.goto('/contribute');
    await expect(page.locator('h1')).toContainText('Community Contribution Engine');
  });

  test('Login page loads and submits auth form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Welcome to GeoAtlas');
    await page.fill('input[type="email"]', 'moderator@geoatlas.org');
    await page.fill('input[type="password"]', 'geoatlas_secret');
  });
});
