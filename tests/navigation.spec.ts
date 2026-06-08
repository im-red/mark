import { test, expect } from '@playwright/test';

async function waitForIonicPage(page) {
  await page.waitForSelector('ion-router-outlet', { state: 'attached' });
  await page.waitForTimeout(800);
}

async function getPageTitle(page) {
  return page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-title').first();
}

async function openSideMenu(page) {
  const menuButton = page.locator('ion-menu-button').first();
  await menuButton.click();
  await page.waitForTimeout(500);
  const menu = page.locator('ion-menu');
  await expect(menu).toBeVisible();
  return menu;
}

async function navigateViaMenu(page, itemText: string) {
  await openSideMenu(page);
  await page.locator('ion-menu ion-item:has-text("' + itemText + '")').click();
  await page.waitForTimeout(800);
  const menu = page.locator('ion-menu');
  try {
    await menu.evaluate((el: HTMLIonMenuElement) => el.close());
  } catch (e) { }
  await page.waitForTimeout(300);
}

async function closeSideMenu(page) {
  const menu = page.locator('ion-menu');
  try {
    await menu.evaluate((el: HTMLIonMenuElement) => el.close());
  } catch (e) { }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

async function createBoard(page, name: string) {
  const fabButton = page.locator('ion-fab-button').first();
  await fabButton.click();
  await page.waitForTimeout(500);

  const modal = page.locator('ion-modal').first();
  await expect(modal).toBeVisible();

  const input = modal.locator('input').first();
  await input.fill(name);

  const createButton = modal.locator('ion-button:has-text("Create")');
  await createButton.click();
  await page.waitForTimeout(1000);
}

async function clearStorage(page) {
  try {
    await page.evaluate(() => localStorage.clear());
  } catch (e) { }
}

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForIonicPage(page);
  });

  test('home page displays header with title "Mark"', async ({ page }) => {
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Mark');
  });

  test('home page displays menu button', async ({ page }) => {
    const menuButton = page.locator('ion-menu-button').first();
    await expect(menuButton).toBeVisible();
  });

  test('home page displays FAB add button', async ({ page }) => {
    const fabButton = page.locator('ion-fab-button').first();
    await expect(fabButton).toBeVisible();
  });

  test('home page shows empty state when no boards exist', async ({ page }) => {
    const emptyTitle = page.locator('.empty-state__title');
    await expect(emptyTitle).toHaveText('No boards yet');
  });

  test('side menu opens when menu button is clicked', async ({ page }) => {
    await openSideMenu(page);
    const menuHeader = page.locator('ion-menu ion-header ion-title').first();
    await expect(menuHeader).toHaveText('Menu');
  });

  test('side menu displays navigation items', async ({ page }) => {
    await openSideMenu(page);
    const menu = page.locator('ion-menu');
    await expect(menu.locator('ion-item:has-text("Manage Marks")')).toBeVisible();
    await expect(menu.locator('ion-item:has-text("Export Data")')).toBeVisible();
    await expect(menu.locator('ion-item:has-text("Import Data")')).toBeVisible();
    await expect(menu.locator('ion-item:has-text("Settings")')).toBeVisible();
  });

  test('side menu closes when Escape is pressed', async ({ page }) => {
    await openSideMenu(page);
    await closeSideMenu(page);
    await page.waitForTimeout(500);
    const menu = page.locator('ion-menu');
    const isOpen = await menu.evaluate((el: any) => el.isOpen());
    expect(isOpen).toBe(false);
  });

  test('create board modal opens when FAB is clicked', async ({ page }) => {
    const fabButton = page.locator('ion-fab-button').first();
    await fabButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('ion-modal').first();
    await expect(modal).toBeVisible();
    const modalTitle = modal.locator('ion-title').first();
    await expect(modalTitle).toHaveText('New Board');
  });

  test('create board modal can be cancelled', async ({ page }) => {
    const fabButton = page.locator('ion-fab-button').first();
    await fabButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('ion-modal').first();
    await expect(modal).toBeVisible();

    const cancelButton = modal.locator('ion-button:has-text("Cancel")');
    await cancelButton.click();
    await page.waitForTimeout(500);

    await expect(modal).not.toBeVisible();
  });

  test('create board and navigate to board detail', async ({ page }) => {
    await createBoard(page, 'Test Board');

    await expect(page).toHaveURL(/\/board\//);
    const boardTitle = await getPageTitle(page);
    await expect(boardTitle).toHaveText('Test Board');
  });

  test('navigate back from board detail to home via back button', async ({ page }) => {
    await createBoard(page, 'Test Board');
    await expect(page).toHaveURL(/\/board\//);

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
    const homeTitle = await getPageTitle(page);
    await expect(homeTitle).toHaveText('Mark');
  });

  test('board card click navigates to board detail', async ({ page }) => {
    await createBoard(page, 'My First Board');

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    const boardCard = page.locator('.board-card').first();
    await boardCard.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\/board\//);
    const boardTitle = await getPageTitle(page);
    await expect(boardTitle).toHaveText('My First Board');
  });

  test('navigate to mark management from side menu', async ({ page }) => {
    await navigateViaMenu(page, 'Manage Marks');

    await expect(page).toHaveURL(/\/mark-management/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Manage Marks');
  });

  test('navigate back from mark management to home', async ({ page }) => {
    await navigateViaMenu(page, 'Manage Marks');

    await expect(page).toHaveURL(/\/mark-management/);

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
  });

  test('navigate to export page from side menu', async ({ page }) => {
    await navigateViaMenu(page, 'Export Data');

    await expect(page).toHaveURL(/\/export/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Export Data');
  });

  test('navigate back from export page to home', async ({ page }) => {
    await navigateViaMenu(page, 'Export Data');

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
  });

  test('navigate to import page from side menu', async ({ page }) => {
    await navigateViaMenu(page, 'Import Data');

    await expect(page).toHaveURL(/\/import/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Import Data');
  });

  test('navigate back from import page to home', async ({ page }) => {
    await navigateViaMenu(page, 'Import Data');

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
  });

  test('navigate to settings from side menu', async ({ page }) => {
    await navigateViaMenu(page, 'Settings');

    await expect(page).toHaveURL(/\/settings/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Settings');
  });

  test('navigate back from settings to home', async ({ page }) => {
    await navigateViaMenu(page, 'Settings');

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
  });

  test('navigate to about page from settings', async ({ page }) => {
    await navigateViaMenu(page, 'Settings');

    await expect(page).toHaveURL(/\/settings/);

    const aboutItem = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-item:has-text("About")');
    await aboutItem.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\/about/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('About');
  });

  test('navigate back from about to settings', async ({ page }) => {
    await navigateViaMenu(page, 'Settings');

    const aboutItem = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-item:has-text("About")');
    await aboutItem.click();
    await page.waitForTimeout(1000);

    const backButton = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\/settings/);
    const title = await getPageTitle(page);
    await expect(title).toHaveText('Settings');
  });

  test('board detail action sheet opens and has options', async ({ page }) => {
    await createBoard(page, 'Action Test Board');

    const moreButton = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-toolbar ion-button').last();
    await moreButton.click();
    await page.waitForTimeout(500);

    const actionSheet = page.locator('ion-action-sheet');
    await expect(actionSheet).toBeVisible();
  });

  test('board detail rename modal opens from action sheet', async ({ page }) => {
    await createBoard(page, 'Rename Test');

    const moreButton = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-toolbar ion-button').last();
    await moreButton.click();
    await page.waitForTimeout(500);

    const actionSheet = page.locator('ion-action-sheet');
    await expect(actionSheet).toBeVisible();

    const renameButton = actionSheet.locator('button:has-text("Rename")');
    await renameButton.click();
    await page.waitForTimeout(800);

    const renameModal = page.locator('ion-modal:not(.overlay-hidden)');
    await expect(renameModal).toBeVisible();
    const renameTitle = renameModal.locator('ion-title').first();
    await expect(renameTitle).toHaveText('Rename Board');
  });

  test('board detail delete alert opens from action sheet', async ({ page }) => {
    await createBoard(page, 'Delete Test');

    const moreButton = page.locator('ion-router-outlet > div:not(.ion-page-hidden) ion-toolbar ion-button').last();
    await moreButton.click();
    await page.waitForTimeout(500);

    const actionSheet = page.locator('ion-action-sheet');
    await expect(actionSheet).toBeVisible();

    const deleteButton = actionSheet.locator('button:has-text("Delete")');
    await deleteButton.click();
    await page.waitForTimeout(500);

    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible();
  });

  test('mark selector modal opens when calendar date is clicked', async ({ page }) => {
    await createBoard(page, 'Calendar Test');

    const calendarDay = page.locator('.calendar-carousel-slide--active .calendar-day.current-month').first();
    await calendarDay.click();
    await page.waitForTimeout(800);

    const markSelectorModal = page.locator('ion-modal:not(.overlay-hidden)');
    await expect(markSelectorModal).toBeVisible();
  });
});

test.describe('Mobile Navigation Tests', () => {
  test.use({ viewport: { width: 393, height: 851 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.reload();
    await waitForIonicPage(page);
  });

  test('home page elements are visible on mobile viewport', async ({ page }) => {
    const title = await getPageTitle(page);
    await expect(title).toBeVisible();

    const menuButton = page.locator('ion-menu-button').first();
    await expect(menuButton).toBeVisible();

    const fabButton = page.locator('ion-fab-button').first();
    await expect(fabButton).toBeVisible();
  });

  test('side menu is fully visible on mobile', async ({ page }) => {
    await openSideMenu(page);
    const menu = page.locator('ion-menu');
    await expect(menu.locator('ion-item:has-text("Manage Marks")')).toBeVisible();
  });

  test('create board and navigate on mobile', async ({ page }) => {
    await createBoard(page, 'Mobile Board');

    await expect(page).toHaveURL(/\/board\//);
    const boardTitle = await getPageTitle(page);
    await expect(boardTitle).toHaveText('Mobile Board');
  });

  test('navigate back from board detail on mobile', async ({ page }) => {
    await createBoard(page, 'Mobile Back Test');

    const backButton = page.locator('ion-back-button').first();
    await backButton.click();
    await page.waitForTimeout(1000);

    await expect(page).toHaveURL(/\//);
  });

  test('side menu navigation on mobile', async ({ page }) => {
    await navigateViaMenu(page, 'Settings');

    await expect(page).toHaveURL(/\/settings/);
  });
});

test.describe('Deep Link Navigation Tests', () => {
  test('direct navigation to /settings', async ({ page }) => {
    await page.goto('/settings');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('Settings');
  });

  test('direct navigation to /about', async ({ page }) => {
    await page.goto('/about');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('About');
  });

  test('direct navigation to /mark-management', async ({ page }) => {
    await page.goto('/mark-management');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('Manage Marks');
  });

  test('direct navigation to /export', async ({ page }) => {
    await page.goto('/export');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('Export Data');
  });

  test('direct navigation to /import', async ({ page }) => {
    await page.goto('/import');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('Import Data');
  });

  test('direct navigation to /board/invalid-id shows board not found', async ({ page }) => {
    await page.goto('/board/nonexistent-id');
    await waitForIonicPage(page);

    const title = await getPageTitle(page);
    await expect(title).toHaveText('Board Not Found');
  });
});
