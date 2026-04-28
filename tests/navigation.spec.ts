import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('home page displays header with title', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const headerTitle = page.locator('.header-title h1');
    await expect(headerTitle).toHaveText('Mark');

    console.log('✓ Home page header is visible with title "Mark"');
  });

  test('home page displays menu button', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const menuButton = page.locator('.btn-menu');
    await expect(menuButton).toBeVisible();

    console.log('✓ Menu button is visible on home page');
  });

  test('home page displays add board button', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const addButton = page.locator('.btn-icon');
    await expect(addButton).toBeVisible();

    console.log('✓ Add board button is visible on home page');
  });

  test('home page displays board list or empty state', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const boardList = page.locator('.board-list');
    const emptyState = page.locator('.empty-state');

    const hasBoardList = await boardList.count().then(c => c > 0);
    const hasEmptyState = await emptyState.count().then(c => c > 0);

    expect(hasBoardList || hasEmptyState).toBe(true);

    if (hasEmptyState) {
      console.log('✓ Empty state is displayed when no boards exist');
    } else {
      console.log('✓ Board list is displayed');
    }
  });

  test('side menu opens when menu button is clicked', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const menuButton = page.locator('.btn-menu');
    await menuButton.click();

    await page.waitForSelector('.side-menu--open', { state: 'visible' });

    const sideMenu = page.locator('.side-menu.side-menu--open');
    await expect(sideMenu).toBeVisible();

    console.log('✓ Side menu opens when menu button is clicked');
  });

  test('side menu displays export and import options', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-menu').click();
    await page.waitForSelector('.side-menu--open', { state: 'visible' });

    const exportItem = page.locator('.side-menu__item:has-text("Export Data")');
    const importItem = page.locator('.side-menu__item:has-text("Import Data")');

    await expect(exportItem).toBeVisible();
    await expect(importItem).toBeVisible();

    console.log('✓ Side menu displays Export and Import options');
  });

  test('side menu closes when backdrop is clicked', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-menu').click();
    await page.waitForSelector('.side-menu--open', { state: 'visible' });

    const backdrop = page.locator('.side-menu-backdrop');
    await backdrop.click();

    await page.waitForSelector('.side-menu--open', { state: 'hidden' });

    console.log('✓ Side menu closes when backdrop is clicked');
  });

  test('create board overlay opens when add button is clicked', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const addButton = page.locator('.btn-icon');
    await addButton.click();

    await page.waitForSelector('.overlay', { state: 'visible' });

    const overlayTitle = page.locator('.overlay__header h2');
    await expect(overlayTitle).toHaveText('New Board');

    console.log('✓ Create board overlay opens when add button is clicked');
  });

  test('create board overlay can be cancelled', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-icon').click();
    await page.waitForSelector('.overlay', { state: 'visible' });

    const cancelButton = page.locator('.overlay__actions .btn-secondary');
    await cancelButton.click();

    await page.waitForSelector('.overlay', { state: 'hidden' });

    console.log('✓ Create board overlay can be cancelled');
  });

  test('create board and navigate to board detail', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-icon').click();
    await page.waitForSelector('.overlay', { state: 'visible' });

    const input = page.locator('.overlay__content .input');
    await input.fill('Test Board');

    const createButton = page.locator('.overlay__actions .btn-primary');
    await createButton.click();

    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    const boardTitle = page.locator('.header-title h1');
    await expect(boardTitle).toHaveText('Test Board');

    console.log('✓ Created board and navigated to board detail page');
  });

  test('navigate back from board detail to home', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-icon').click();
    await page.waitForSelector('.overlay', { state: 'visible' });

    await page.locator('.overlay__content .input').fill('Test Board');
    await page.locator('.overlay__actions .btn-primary').click();
    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    const backButton = page.locator('.btn-back');
    await backButton.click();

    await page.waitForSelector('.page--home', { state: 'visible' });

    const homeTitle = page.locator('.header-title h1');
    await expect(homeTitle).toHaveText('Mark');

    console.log('✓ Navigated back from board detail to home page');
  });

  test('board card click navigates to board detail', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-icon').click();
    await page.waitForSelector('.overlay', { state: 'visible' });

    await page.locator('.overlay__content .input').fill('My First Board');
    await page.locator('.overlay__actions .btn-primary').click();
    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    await page.locator('.btn-back').click();
    await page.waitForSelector('.page--home', { state: 'visible' });

    const boardCard = page.locator('.board-card').first();
    await boardCard.click();

    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    const boardTitle = page.locator('.header-title h1');
    await expect(boardTitle).toHaveText('My First Board');

    console.log('✓ Board card click navigates to board detail page');
  });

  test('export overlay opens from side menu', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-menu').click();
    await page.waitForSelector('.side-menu--open', { state: 'visible' });

    await page.locator('.side-menu__item:has-text("Export Data")').click();

    await page.waitForSelector('.overlay', { state: 'visible' });

    const overlayTitle = page.locator('.overlay__header h2');
    await expect(overlayTitle).toHaveText('Export Data');

    console.log('✓ Export overlay opens from side menu');
  });

  test('import overlay opens from side menu', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-menu').click();
    await page.waitForSelector('.side-menu--open', { state: 'visible' });

    await page.locator('.side-menu__item:has-text("Import Data")').click();

    await page.waitForSelector('.overlay', { state: 'visible' });

    const overlayTitle = page.locator('.overlay__header h2');
    await expect(overlayTitle).toHaveText('Import Data');

    console.log('✓ Import overlay opens from side menu');
  });
});

test.describe('Mobile Navigation Tests', () => {
  test.use({ ...{ viewport: { width: 393, height: 851 } } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('home page elements are visible on mobile viewport', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    const header = page.locator('.app-header');
    const headerBox = await header.boundingBox();

    expect(headerBox).not.toBeNull();
    expect(headerBox!.x).toBeGreaterThanOrEqual(0);
    expect(headerBox!.y).toBeGreaterThanOrEqual(0);

    const menuButton = page.locator('.btn-menu');
    const menuBox = await menuButton.boundingBox();
    expect(menuBox).not.toBeNull();

    const addButton = page.locator('.btn-icon');
    const addBox = await addButton.boundingBox();
    expect(addBox).not.toBeNull();

    console.log('✓ Home page elements are visible on mobile viewport');
  });

  test('side menu is fully visible on mobile', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-menu').click();
    await page.waitForSelector('.side-menu--open', { state: 'visible' });
    await page.waitForTimeout(400);

    const sideMenu = page.locator('.side-menu.side-menu--open');
    const menuBox = await sideMenu.boundingBox();

    expect(menuBox).not.toBeNull();
    expect(menuBox!.x).toBeGreaterThanOrEqual(-10);
    expect(menuBox!.y).toBeGreaterThanOrEqual(0);

    console.log('✓ Side menu is fully visible on mobile');
  });

  test('board card is clickable on mobile viewport', async ({ page }) => {
    await page.waitForSelector('.app-header', { state: 'visible' });

    await page.locator('.btn-icon').click();
    await page.waitForSelector('.overlay', { state: 'visible' });

    await page.locator('.overlay__content .input').fill('Mobile Board');
    await page.locator('.overlay__actions .btn-primary').click();
    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    await page.locator('.btn-back').click();
    await page.waitForSelector('.page--home', { state: 'visible' });

    const boardCard = page.locator('.board-card').first();
    await boardCard.scrollIntoViewIfNeeded();
    await boardCard.click();

    await page.waitForSelector('.page--board-detail', { state: 'visible' });

    console.log('✓ Board card is clickable on mobile viewport');
  });
});
