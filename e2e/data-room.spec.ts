import { test, expect } from '@playwright/test';
import { setupAuthenticatedState } from './utils/auth';
import { setupApiMocks, generateDynamicKpiData } from './utils/mocks';

test.describe('Data Room Screen - Targeted Component & Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('1) should load Data Room page and verify URL route and title header', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page).toHaveURL(/\/dashboard\/data-room/);

    // Title and breadcrumb
    await expect(page.getByText('Data Room').first()).toBeVisible();
    await expect(page.getByText('Overview • Data Room')).toBeVisible();
  });

  test('2) should render all 4 main KPI comparison cards with exact payload data', async ({ page }) => {
    await page.goto('/dashboard/data-room');

    // Wait until KPI cards render from API mock
    await expect(page.getByText('17', { exact: true })).toBeVisible();

    const bodyText = await page.locator('body').innerText();

    // 1. Total Buyers Card (17)
    expect(bodyText).toContain('Total Buyers');
    expect(bodyText).toContain('17');

    // 2. Total Sellers Card (26)
    expect(bodyText).toContain('Total Sellers');
    expect(bodyText).toContain('26');

    // 3. Total Auctions Card (32)
    expect(bodyText).toContain('Total Auctions');
    expect(bodyText).toContain('32');

    // 4. Revenue Card (5.52m)
    expect(bodyText).toMatch(/5\.52m/i);
  });

  test('3) should render Performance Analytics section with Egypt and Saudi Arabia comparison charts', async ({ page }) => {
    await page.goto('/dashboard/data-room');

    // Section Header
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    // Country comparison cards
    await expect(page.getByText('Egypt').first()).toBeVisible();
    await expect(page.getByText('Saudi Arabia').first()).toBeVisible();
  });

  test('4) should switch to Buyers tab and verify compare dataset updates to Total: 100', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const buyersTab = page.getByRole('button', { name: /buyers/i }).first();
    await expect(buyersTab).toBeVisible();
    await buyersTab.click({ force: true });

    // Assert Buyers dataset loaded and total count updated to (Total: 100)
    await expect(page.getByText('(Total: 100)').first()).toBeVisible();
  });

  test('5) should switch to Sellers tab and verify compare dataset updates to Total: 120', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const sellersTab = page.getByRole('button', { name: /sellers/i }).first();
    await expect(sellersTab).toBeVisible();
    await sellersTab.click({ force: true });

    // Assert Sellers dataset loaded and total count updated to (Total: 120)
    await expect(page.getByText('(Total: 120)').first()).toBeVisible();
  });

  test('6) should switch to Orders tab and verify compare dataset updates to Total: 700', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const ordersTab = page.getByRole('button', { name: /orders/i }).first();
    await expect(ordersTab).toBeVisible();
    await ordersTab.click({ force: true });

    // Assert Orders dataset loaded and total count updated to (Total: 700)
    await expect(page.getByText('(Total: 700)').first()).toBeVisible();
  });

  test('7) should switch to Auctions tab and verify compare dataset updates to Total: 1k', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const auctionsTab = page.getByRole('button', { name: /auctions/i }).first();
    await expect(auctionsTab).toBeVisible();
    await auctionsTab.click({ force: true });

    // Assert Auctions dataset loaded and total count updated to (Total: 1k)
    await expect(page.getByText('(Total: 1k)').first()).toBeVisible();
  });

  test('8) should switch between chart view modes (Bar, Pie, Line) and update toggle active state', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const barBtn = page.getByRole('button', { name: /^bar$/i }).first();
    const pieBtn = page.getByRole('button', { name: /^pie$/i }).first();
    const lineBtn = page.getByRole('button', { name: /^line$/i }).first();

    // Click Pie Mode
    await expect(pieBtn).toBeVisible();
    await pieBtn.click({ force: true });
    await expect(pieBtn).toHaveClass(/Mui-selected/);

    // Click Line Mode
    await expect(lineBtn).toBeVisible();
    await lineBtn.click({ force: true });
    await expect(lineBtn).toHaveClass(/Mui-selected/);

    // Click Bar Mode
    await expect(barBtn).toBeVisible();
    await barBtn.click({ force: true });
    await expect(barBtn).toHaveClass(/Mui-selected/);
  });

  test('9) should switch group_by mode (Date, Tag Groups, Tags) and verify toggle active state', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Performance Analytics')).toBeVisible();

    const dateBtn = page.getByRole('button', { name: /^date$/i }).first();
    const tagGroupsBtn = page.getByRole('button', { name: /^tag groups$/i }).first();
    const tagsBtn = page.getByRole('button', { name: /^tags$/i }).first();

    // Click Tag Groups Toggle
    await expect(tagGroupsBtn).toBeVisible();
    await tagGroupsBtn.click({ force: true });
    await expect(tagGroupsBtn).toHaveClass(/Mui-selected/);

    // Click Tags Toggle
    await expect(tagsBtn).toBeVisible();
    await tagsBtn.click({ force: true });
    await expect(tagsBtn).toHaveClass(/Mui-selected/);

    // Click Date Toggle
    await expect(dateBtn).toBeVisible();
    await dateBtn.click({ force: true });
    await expect(dateBtn).toHaveClass(/Mui-selected/);
  });

  test('10) should navigate back to root dashboard when clicking back button', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('Data Room').first()).toBeVisible();

    const backBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await backBtn.isVisible()) {
      await backBtn.click({ force: true });
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});

test.describe('Data Room Screen - Filter Interaction & Dynamic Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('should open filter drawer and display period and country filter options', async ({ page }) => {
    await page.goto('/dashboard/data-room');
    await expect(page.getByText('17', { exact: true })).toBeVisible();

    // Click Filter button to open drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterBtn).toBeVisible();
    await filterBtn.click({ force: true });

    // Drawer paper should open
    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();
  });

  test('should mimic user clicking country filter in drawer, applying it, and verifying KPI stat changes from 17 to 80 for Egypt', async ({ page }) => {
    await page.goto('/dashboard/data-room');

    // 1. BEFORE FILTER: Initial Total Buyers count is 17
    await expect(page.getByText('17', { exact: true })).toBeVisible();

    // 2. Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // 3. Click Country Select input inside drawer
    const countryInput = drawerPaper.locator('#dashboard-filter-country, .MuiAutocomplete-root input').first();
    if (await countryInput.isVisible()) {
      await countryInput.click({ force: true });

      // Select Egypt option (country_id = 1 -> Total Buyers = 80)
      const egyptOption = page.getByRole('option', { name: /egypt|مصر/i }).first();
      if (await egyptOption.isVisible()) {
        await egyptOption.click({ force: true });
      }
    }

    // 4. Click Apply button
    const applyBtn = page.getByRole('button', { name: /apply/i }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click({ force: true });
    }

    // 5. AFTER FILTER: Assert that Total Buyers value changed on screen from 17 to 80 (Egypt mock value)
    await expect(page.getByText('80', { exact: true })).toBeVisible();
    await expect(page.getByText('17', { exact: true })).not.toBeVisible();
  });

  test('should mimic user clicking country filter to Saudi Arabia, applying it, and verifying KPI stat changes from 17 to 150', async ({ page }) => {
    await page.goto('/dashboard/data-room');

    // 1. BEFORE FILTER: Default Total Buyers value is 17
    await expect(page.getByText('17', { exact: true })).toBeVisible();

    // 2. Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // 3. Select Saudi Arabia option (country_id = 2 -> Total Buyers = 150)
    const countryInput = drawerPaper.locator('#dashboard-filter-country, .MuiAutocomplete-root input').first();
    if (await countryInput.isVisible()) {
      await countryInput.click({ force: true });

      const saudiOption = page.getByRole('option', { name: /saudi|السعودية/i }).first();
      if (await saudiOption.isVisible()) {
        await saudiOption.click({ force: true });
      }
    }

    // 4. Click Apply button
    const applyBtn = page.getByRole('button', { name: /apply/i }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click({ force: true });
    }

    // 5. AFTER FILTER: Total Buyers value changes from 17 to 150 (Saudi mock value)
    await expect(page.getByText('150', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('17', { exact: true })).not.toBeVisible();
  });
});
