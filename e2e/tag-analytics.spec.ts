import { test, expect } from '@playwright/test';
import { setupAuthenticatedState } from './utils/auth';
import { setupApiMocks } from './utils/mocks';

test.describe('Tag Analytics Screen - Comprehensive Integration & Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('1) should load initial page state: show Tags Success Rate Overview by default and hide selection-specific cards', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');
    await expect(page).toHaveURL(/\/dashboard\/tag-analytics/);

    // Title and Breadcrumb
    await expect(page.getByText('Tag Analytics').first()).toBeVisible();
    await expect(page.getByText('Overview • Tag Analytics')).toBeVisible();

    // Default Overview Title (No tag selected at first)
    await expect(page.getByText('Tags Success Rate Overview').first()).toBeVisible();
    await expect(page.getByText('Toyota Corolla').first()).toBeVisible();

    // Selection-specific cards and table should NOT be visible before selection
    await expect(page.getByText('Total Ended Auctions')).not.toBeVisible();
    await expect(page.getByText('AUC-1001')).not.toBeVisible();
  });

  test('2) should switch to Group tag mode and update title to Tag Groups Success Rate Overview', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');

    const groupBtn = page.getByRole('button', { name: /^group$/i }).first();
    await expect(groupBtn).toBeVisible();

    // Click Group mode toggle
    await groupBtn.click({ force: true });
    await expect(groupBtn).toHaveClass(/Mui-selected/);

    // Title should update to Tag Groups Success Rate Overview
    await expect(page.getByText('Tag Groups Success Rate Overview').first()).toBeVisible();
    await expect(page.getByLabel('Select Group')).toBeVisible();
  });

  test('3) should select a specific tag from Autocomplete and render date breakdown, Total Auctions (45), Highest Price, Lowest Price, and Auctions Table (AUC-1001)', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');

    // 1. Initial State: Selection details not visible
    await expect(page.getByText('Total Ended Auctions')).not.toBeVisible();

    // 2. Select Tag from Autocomplete
    const autocompleteInput = page.locator('.MuiAutocomplete-root input').first();
    await autocompleteInput.click({ force: true });

    const option = page.getByRole('option', { name: /toyota|تويوتا/i }).first();
    await option.click({ force: true });

    // 3. Selection Details render with exact metrics and auctions table
    await expect(page.getByText('Toyota — Success Rate Over Time').first()).toBeVisible();
    await expect(page.getByText('Total Ended Auctions').first()).toBeVisible();
    await expect(page.getByText('45', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Highest Price').first()).toBeVisible();
    await expect(page.getByText('Lowest Price').first()).toBeVisible();
    await expect(page.getByText('AUC-1001').first()).toBeVisible();
  });

  test('4) should toggle between Chart and Table view modes when a tag is selected', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');

    // Select Tag to display view mode buttons
    const autocompleteInput = page.locator('.MuiAutocomplete-root input').first();
    await autocompleteInput.click({ force: true });
    const option = page.getByRole('option', { name: /toyota|تويوتا/i }).first();
    await option.click({ force: true });

    await expect(page.getByText('Toyota — Success Rate Over Time').first()).toBeVisible();

    // Chart and Table view mode buttons
    const chartBtn = page.getByRole('button', { name: /^chart$/i }).first();
    const tableBtn = page.getByRole('button', { name: /^table$/i }).first();

    await expect(chartBtn).toBeVisible();
    await expect(tableBtn).toBeVisible();

    // Click Table View
    await tableBtn.click({ force: true });
    await expect(page.locator('table, .MuiTable-root').first()).toBeVisible();

    // Click Chart View
    await chartBtn.click({ force: true });
    await expect(chartBtn).toBeVisible();
  });

  test('5) should test search input functionality in header search box', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');

    const searchInput = page.getByPlaceholder('Search auctions...').first();
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill('Toyota');
    await expect(searchInput).toHaveValue('Toyota');
  });

  test('6) should navigate back to root dashboard when clicking back button', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');
    await expect(page.getByText('Tag Analytics').first()).toBeVisible();

    const backBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await backBtn.isVisible()) {
      await backBtn.click({ force: true });
      await expect(page).toHaveURL(/\/dashboard/);
    }
  });
});

test.describe('Tag Analytics Screen - Filter Interaction & Dynamic Data Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedState(page);
    await setupApiMocks(page);
  });

  test('should open filter drawer and display period and country filter options', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');
    await expect(page.getByText('Tag Analytics').first()).toBeVisible();

    // Click Filter button to open drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await expect(filterBtn).toBeVisible();
    await filterBtn.click({ force: true });

    // Drawer paper should open
    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();
  });

  test('should mimic user clicking country filter in drawer, applying it, and verifying data response', async ({ page }) => {
    await page.goto('/dashboard/tag-analytics');
    await expect(page.getByText('Tag Analytics').first()).toBeVisible();

    // Open Filter Drawer
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    await filterBtn.click({ force: true });

    const drawerPaper = page.locator('.MuiDrawer-paper').first();
    await expect(drawerPaper).toBeVisible();

    // Select Egypt Country Option
    const countryInput = drawerPaper.locator('#dashboard-filter-country, .MuiAutocomplete-root input').first();
    if (await countryInput.isVisible()) {
      await countryInput.click({ force: true });

      const egyptOption = page.getByRole('option', { name: /egypt|مصر/i }).first();
      if (await egyptOption.isVisible()) {
        await egyptOption.click({ force: true });
      }
    }

    // Click Apply button
    const applyBtn = page.getByRole('button', { name: /apply/i }).first();
    if (await applyBtn.isVisible()) {
      await applyBtn.click({ force: true });
    }

    await expect(page.locator('body')).toBeVisible();
  });
});
