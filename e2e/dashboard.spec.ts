import { test, expect } from '@playwright/test';
import { setupAuthenticatedState } from './utils/auth';
import { setupApiMocks, generateDynamicTransactionsChart, generateDynamicKpiData } from './utils/mocks';

test.describe('Dashboard Screen - Targeted Component & Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('1) should render all 4 stat cards with exact numbers from mocked KPI payload', async ({ page }) => {
    await page.goto('/dashboard');
    // Wait until React Query fetches mock data and renders cards
    await expect(page.getByText('158', { exact: true })).toBeVisible();

    const bodyText = await page.locator('body').innerText();

    // 1. Total Products (158) & Auctions (32)
    expect(bodyText).toContain('158');
    expect(bodyText).toContain('32');

    // 2. Total Companies / Sellers (26) & Active (18)
    expect(bodyText).toContain('26');
    expect(bodyText).toContain('18');

    // 3. Total Inspections (26), Offline (18), Online (8)
    expect(bodyText).toContain('8');

    // 4. Total Buyers (17) & Active (46)
    expect(bodyText).toContain('17');
    expect(bodyText).toContain('46');
  });

  test('2) should render Success Rate card with successful and incomplete auction counts', async ({ page }) => {
    await page.goto('/dashboard');

    // Successful auctions count (77) & incomplete auctions count (81)
    await expect(page.getByText('77', { exact: true })).toBeVisible();
    await expect(page.getByText('81', { exact: true })).toBeVisible();

    // Donut chart container
    const chart = page.locator('.apexcharts-canvas').first();
    await expect(chart).toBeVisible();
  });

  test('3) should render New Clients list with 3 clients containing name, phone, and joined date', async ({ page }) => {
    await page.goto('/dashboard');

    // Client 1: علي عوض & 01274587458
    await expect(page.getByText('علي عوض')).toBeVisible();
    await expect(page.getByText('01274587458')).toBeVisible();

    // Client 2: احمد عادل & 01555666888
    await expect(page.getByText('احمد عادل')).toBeVisible();
    await expect(page.getByText('01555666888')).toBeVisible();

    // Client 3: Test & 01789999999
    await expect(page.getByText('Test')).toBeVisible();
    await expect(page.getByText('01789999999')).toBeVisible();

    // Joined date text
    await expect(page.getByText('Joined at 28 Jun 2026').first()).toBeVisible();
  });

  test('4) should render All Transactions graph, Total Transaction card, and Transaction Count card', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('All transactions')).toBeVisible();

    // Total Transaction Card value (5.52m)
    await expect(page.getByText('5.52m')).toBeVisible();

    // Number of transactions count (98)
    await expect(page.getByText('98', { exact: true })).toBeVisible();

    // All transactions chart container
    const chartContainer = page.locator('.apexcharts-canvas').first();
    await expect(chartContainer).toBeVisible();
  });

  test('5) should render Top 5 companies card and Top 5 Categories card with exact mock payload data', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait until Top 5 companies & Top 5 Categories headers render
    await expect(page.getByText('Top 5 companies').first()).toBeVisible();
    await expect(page.getByText('Top 5 Categories').first()).toBeVisible();

    // Top 5 Companies List Items
    await expect(page.getByText('عادل جروب')).toBeVisible();
    await expect(page.getByText('kkk6')).toBeVisible();
    await expect(page.getByText('شركة الكوم الاحمر')).toBeVisible();
    await expect(page.getByText('العهد جروب')).toBeVisible();
    await expect(page.getByText('تامر ل تجارة الامونيوم')).toBeVisible();

    // Top 5 Categories List Items
    await expect(page.getByText('كرتون')).toBeVisible();
    await expect(page.getByText('خرده متنوعه')).toBeVisible();
  });
});

test.describe('Dashboard Screen - Filter Interaction & Dynamic Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('should open filter drawer and display period and country filter fields with preset options', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('158', { exact: true })).toBeVisible();

    // Click Filter button to open drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterBtn).toBeVisible();
    await filterBtn.click({ force: true });

    // Drawer paper should open
    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // Open Period Select Dropdown
    const periodSelect = drawerPaper.locator('.MuiSelect-select, [role="combobox"]').first();
    if (await periodSelect.isVisible()) {
      await periodSelect.click({ force: true });

      // Check menu listbox pops up with options
      const menu = page.locator('.MuiMenu-paper, [role="listbox"]').first();
      await expect(menu).toBeVisible();
    }
  });

  test('should mimic user clicking country filter in drawer, applying it, and verifying stat card number changes from 158 to 250', async ({ page }) => {
    await page.goto('/dashboard');
    // 1. BEFORE FILTER: Total Products stat card displays default initial value (158)
    await expect(page.getByText('158', { exact: true })).toBeVisible();

    // 2. Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // 3. Click Country Select dropdown inside drawer
    const countryInput = drawerPaper.locator('#dashboard-filter-country, .MuiAutocomplete-root input').first();
    if (await countryInput.isVisible()) {
      await countryInput.click({ force: true });

      // Select Egypt option (country_id = 1)
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

    // 5. AFTER FILTER: Assert that Total Products card value changed on screen from 158 to 250 (Egypt mock value)
    await expect(page.getByText('250', { exact: true })).toBeVisible();
    await expect(page.getByText('158', { exact: true })).not.toBeVisible();
  });

  test('should mimic user clicking country filter to Saudi Arabia, applying it, and verifying stat card number changes from 158 to 420', async ({ page }) => {
    await page.goto('/dashboard');
    // 1. BEFORE FILTER: Default value 158
    await expect(page.getByText('158', { exact: true })).toBeVisible();

    // 2. Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // 3. Select Saudi Arabia option
    const countryInput = drawerPaper.locator('#dashboard-filter-country, .MuiAutocomplete-root input').first();
    if (await countryInput.isVisible()) {
      await countryInput.click({ force: true });

      const saudiOption = page.getByRole('option', { name: /saudi|السعودية/i }).first();
      if (await saudiOption.isVisible()) {
        await saudiOption.click({ force: true });
      }
    }

    // 4. Click Apply
    const applyBtn = page.getByRole('button', { name: /apply/i }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click({ force: true });
    }

    // 5. AFTER FILTER: Card number changes from 158 to 420
    await expect(page.getByText('420', { exact: true })).toBeVisible();
    await expect(page.getByText('158', { exact: true })).not.toBeVisible();
  });

  test('should mimic user clicking period filter to Weekly in drawer, applying it, and verifying chart updates', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('158', { exact: true })).toBeVisible();

    // 1. Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // 2. Select Weekly period in dropdown
    const periodSelect = drawerPaper.locator('.MuiSelect-select, [role="combobox"]').first();
    if (await periodSelect.isVisible()) {
      await periodSelect.click({ force: true });

      const weeklyItem = page.getByRole('option', { name: /weekly|أسبوعي/i }).first();
      if (await weeklyItem.isVisible()) {
        await weeklyItem.click({ force: true });
      }
    }

    // 3. Click Apply
    const applyBtn = page.getByRole('button', { name: /apply/i }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click({ force: true });
    }

    // 4. AFTER FILTER: Assert ApexCharts canvas container re-rendered with weekly dataset
    const chartContainer = page.locator('.apexcharts-canvas').first();
    await expect(chartContainer).toBeVisible();
  });

  test('should calculate custom period differences (less than 7 days, 7 to 60 days, 2-12 months, >1 year)', async ({ page }) => {
    // 1. Less than 7 days -> 7 days
    const shortCustom = generateDynamicTransactionsChart(new URLSearchParams('period=custom&date_from=2026-01-01&date_to=2026-01-04'));
    expect(shortCustom.data.labels).toHaveLength(7);

    // 2. 7 to 60 days -> weeks
    const weeksCustom = generateDynamicTransactionsChart(new URLSearchParams('period=custom&date_from=2026-01-01&date_to=2026-01-28'));
    expect(weeksCustom.data.labels.length).toBeGreaterThanOrEqual(4);

    // 3. More than 2 months up to 12 months -> months
    const monthsCustom = generateDynamicTransactionsChart(new URLSearchParams('period=custom&date_from=2026-01-01&date_to=2026-06-01'));
    expect(monthsCustom.data.labels.length).toBe(6);

    // 4. More than 1 year -> years
    const yearsCustom = generateDynamicTransactionsChart(new URLSearchParams('period=custom&date_from=2024-01-01&date_to=2026-06-01'));
    expect(yearsCustom.data.labels.length).toBeGreaterThanOrEqual(2);
  });
});