import { test, expect } from '@playwright/test';

test.describe('Devops Application — E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Page load ───────────────────────────────────────────────────────────────
  test('page title is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /devops/i })).toBeVisible();
  });

  // ── Backend status card ─────────────────────────────────────────────────────
  test('shows "Backend Status" card', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /backend status/i })).toBeVisible();
  });

  test('displays backend health data after loading', async ({ page }) => {
    // Wait for the loading text to disappear (data has loaded)
    await expect(page.getByText(/loading backend status/i)).not.toBeVisible({ timeout: 10_000 });

    // Status should be "ok"
    await expect(page.getByText(/ok/i)).toBeVisible();
  });

  // ── API health endpoint ─────────────────────────────────────────────────────
  test('API /api/health returns status ok', async ({ request }) => {
    const response = await request.get('http://localhost:5001/api/health');
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(typeof body.message).toBe('string');
    expect(typeof body.timestamp).toBe('string');
  });
});
