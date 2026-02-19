// @ts-nocheck
import { test, expect } from '@playwright/test';

const mockHealthResponse = {
    status: 'ok',
    message: 'Devops Backend is running',
    timestamp: '2024-06-15T12:00:00.000Z',
};

/**
 * Helper to mock the /api/health endpoint
 */
async function mockHealthAPI(page, response = mockHealthResponse, statusCode = 200) {
    await page.route('**/api/health', (route) => {
        route.fulfill({
            status: statusCode,
            contentType: 'application/json',
            body: JSON.stringify(response),
        });
    });
}

test.describe('DevOps App E2E Tests', () => {
    test('1. should load the page and display the title', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.locator('h1')).toHaveText('Devops');
    });

    test('2. should have correct page title in browser tab', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page).toHaveTitle('Devops');
    });

    test('3. should display loading spinner before data loads', async ({ page }) => {
        // Mock with a delayed response
        await page.route('**/api/health', async (route) => {
            await new Promise((r) => setTimeout(r, 2000));
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockHealthResponse),
            });
        });
        await page.goto('/');
        await expect(page.getByTestId('loading-spinner')).toBeVisible();
    });

    test('4. should display backend status after successful API response', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.getByTestId('status-card')).toBeVisible();
        await expect(page.getByTestId('status-value')).toContainText('OK');
    });

    test('5. should display the backend message', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.getByTestId('message-value')).toContainText('Devops Backend is running');
    });

    test('6. should display the timestamp', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.getByTestId('timestamp-value')).toContainText('Timestamp:');
    });

    test('7. should show error message when API returns 500', async ({ page }) => {
        await page.route('**/api/health', (route) => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Internal Server Error' }),
            });
        });
        await page.goto('/');
        await expect(page.getByTestId('error-message')).toBeVisible();
    });

    test('8. should show retry button on error and allow retry', async ({ page }) => {
        let callCount = 0;
        await page.route('**/api/health', (route) => {
            callCount++;
            if (callCount === 1) {
                route.fulfill({ status: 500, body: 'Error' });
            } else {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockHealthResponse),
                });
            }
        });
        await page.goto('/');
        await expect(page.getByTestId('retry-button')).toBeVisible();
        await page.getByTestId('retry-button').click();
        await expect(page.getByTestId('status-card')).toBeVisible();
    });

    test('9. should show HMR hint text on the page', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.locator('text=src/App.jsx')).toBeVisible();
    });

    test('10. should not show loading spinner after data is loaded', async ({ page }) => {
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.getByTestId('status-card')).toBeVisible();
        await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
    });

    test('11. should show error when network request fails', async ({ page }) => {
        await page.route('**/api/health', (route) => {
            route.abort('connectionrefused');
        });
        await page.goto('/');
        await expect(page.getByTestId('error-message')).toBeVisible();
    });

    test('12. should display page correctly on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await mockHealthAPI(page);
        await page.goto('/');
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.getByTestId('status-card')).toBeVisible();
    });
});
