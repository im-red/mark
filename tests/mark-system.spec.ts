import { test, expect, Page } from '@playwright/test';

// Helper: Select an option from IonSelect (popover interface)
async function selectFromIonSelect(page: Page, selectSelector: string, optionText: string) {
  // Click the IonSelect - need to target the shadow DOM button
  const select = page.locator(selectSelector).first();
  await select.click();
  await page.waitForSelector('ion-popover:not(.overlay-hidden)', { state: 'visible', timeout: 5000 });
  await page.waitForTimeout(300);
  await page.locator('ion-popover:not(.overlay-hidden) ion-item').filter({ hasText: optionText }).first().click();
  await page.waitForTimeout(500);
}

// Helper: Get all option texts from IonSelect popover
async function getIonSelectOptions(page: Page, selectSelector: string): Promise<string[]> {
  const select = page.locator(selectSelector).first();
  await select.click();
  await page.waitForSelector('ion-popover:not(.overlay-hidden)', { state: 'visible', timeout: 5000 });
  await page.waitForTimeout(300);
  const items = page.locator('ion-popover:not(.overlay-hidden) ion-item');
  const texts = await items.allTextContents();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  return texts.map(t => t.trim());
}

// Helper: Navigate to a page via side menu
async function navigateViaMenu(page: Page, menuItemText: string) {
  await page.locator('ion-menu-button').first().click();
  await page.waitForTimeout(500);
  await page.locator('ion-menu ion-item').filter({ hasText: menuItemText }).first().click();
  await page.waitForTimeout(500);
}

async function navigateToBoard(page: Page) {
  await page.locator('.board-card').first().click();
  await page.waitForSelector('.calendar');
}

async function openMarkSelector(page: Page) {
  await page.locator('.calendar-day.current-month').first().click();
  // Ionic keeps all modals in DOM (overlay-hidden when closed), so target the visible one
  await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
  await page.waitForSelector('ion-modal:not(.overlay-hidden) .mark-section', { state: 'visible' });
  await page.waitForTimeout(300);
}

function getRecentSection(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .mark-section', { has: page.getByText('Recent Marks', { exact: true }) });
}

function getSuiteSection(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .mark-section', { has: page.getByText('Mark Suites', { exact: true }) });
}

async function applyMarkFromSuite(page: Page, suiteName: string, markIndex: number) {
  await selectFromIonSelect(page, '.suite-dropdown', suiteName);
  await page.waitForTimeout(300);
  const suiteSection = getSuiteSection(page);
  const markBtn = suiteSection.locator('.mark-btn').nth(markIndex);
  await markBtn.click();
  await page.waitForTimeout(500);
}

async function ensureBoardExists(page: Page) {
  const boardList = page.locator('.board-list');
  const hasBoards = await boardList.count().then(c => c > 0);
  if (!hasBoards) {
    await page.locator('ion-fab-button').click();
    await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
    await page.waitForTimeout(300);
    await page.locator('ion-input input').fill('Test Board');
    await page.waitForTimeout(200);
    await page.locator('ion-button').filter({ hasText: /^Create$/ }).click();
    await page.waitForSelector('.calendar', { state: 'visible' });
    await page.locator('ion-back-button').click();
    await page.waitForSelector('.board-card', { state: 'visible' });
  }
}

test.describe('Mark System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await ensureBoardExists(page);
  });

  test('checkmarks suite exists with check, cross and question marks', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await selectFromIonSelect(page, '.suite-dropdown', 'Checkmarks');
    await page.waitForTimeout(300);

    const markButtons = page.locator('ion-modal:not(.overlay-hidden) .mark-btn');
    const count = await markButtons.count();
    expect(count).toBe(3);

    const firstMark = markButtons.nth(0);
    const firstMarkText = await firstMark.textContent();
    expect(firstMarkText).toContain('✓');

    const secondMark = markButtons.nth(1);
    const secondMarkText = await secondMark.textContent();
    expect(secondMarkText).toContain('✗');

    const thirdMark = markButtons.nth(2);
    const thirdMarkText = await thirdMark.textContent();
    expect(thirdMarkText).toContain('?');
  });

  test('mood suite has 5 marks with background colors', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await selectFromIonSelect(page, '.suite-dropdown', 'Mood');
    await page.waitForTimeout(300);

    const markButtons = page.locator('ion-modal:not(.overlay-hidden) .mark-btn');
    const count = await markButtons.count();
    expect(count).toBe(5);

    const firstMark = markButtons.nth(0);
    const firstMarkBg = await firstMark.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('First mood mark background:', firstMarkBg);
    expect(firstMarkBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(firstMarkBg).not.toBe('rgb(255, 255, 255)');

    const lastMark = markButtons.nth(4);
    const lastMarkBg = await lastMark.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Last mood mark background:', lastMarkBg);
    expect(lastMarkBg).not.toBe('rgba(0, 0, 0, 0)');
    expect(lastMarkBg).not.toBe('rgb(255, 255, 255)');
  });

  test('checkmark has greenish background', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await selectFromIonSelect(page, '.suite-dropdown', 'Checkmarks');
    await page.waitForTimeout(300);

    const checkMark = page.locator('ion-modal:not(.overlay-hidden) .mark-btn').first();
    const bgColor = await checkMark.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Checkmark background color:', bgColor);

    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });

  test('cross has reddish background', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await selectFromIonSelect(page, '.suite-dropdown', 'Checkmarks');
    await page.waitForTimeout(300);

    const crossMark = page.locator('ion-modal:not(.overlay-hidden) .mark-btn').nth(1);
    const bgColor = await crossMark.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Cross background color:', bgColor);

    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });

  test('applied mark shows background color in calendar', async ({ page }) => {
    await navigateToBoard(page);

    const today = new Date();
    const dayOfMonth = today.getDate();
    const calendarDays = page.locator('.calendar-day');
    let targetDayIndex = -1;

    for (let i = 0; i < (await calendarDays.count()); i++) {
      const dayText = await calendarDays.nth(i).locator('.day-number').textContent();
      if (parseInt(dayText || '0') === dayOfMonth) {
        const hasOtherMonth = await calendarDays.nth(i).evaluate((el) =>
          el.classList.contains('other-month')
        );
        if (!hasOtherMonth) {
          targetDayIndex = i;
          break;
        }
      }
    }

    if (targetDayIndex >= 0) {
      await calendarDays.nth(targetDayIndex).click();
      await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
      await page.waitForSelector('ion-modal:not(.overlay-hidden) .mark-section', { state: 'visible' });
      await page.waitForTimeout(300);

      await selectFromIonSelect(page, '.suite-dropdown', 'Checkmarks');
      await page.waitForTimeout(300);

      await page.locator('ion-modal:not(.overlay-hidden) .mark-btn').first().click();
      await page.waitForTimeout(500);

      const dayMark = calendarDays.nth(targetDayIndex).locator('.day-mark');
      await expect(dayMark).toBeVisible();

      const calendarDayWithMark = calendarDays.nth(targetDayIndex);
      const hasMarkClass = await calendarDayWithMark.evaluate((el) =>
        el.classList.contains('has-mark')
      );
      expect(hasMarkClass).toBe(true);

      const markBg = await calendarDayWithMark.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );
      console.log('Applied mark background in calendar:', markBg);

      expect(markBg).not.toBe('rgba(0, 0, 0, 0)');
      expect(markBg).not.toBe('rgb(255, 255, 255)');
    }
  });

  test('suite dropdown shows all built-in suites', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const options = await getIonSelectOptions(page, '.suite-dropdown');
    console.log('Available suites:', options);

    expect(options.some(o => o.includes('Recent'))).toBeFalsy();
    expect(options.some(o => o.includes('Mood'))).toBeTruthy();
    expect(options.some(o => o.includes('Checkmarks'))).toBeTruthy();
  });
});

test.describe('Mark Management Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await ensureBoardExists(page);
  });

  test('manage marks page shows built-in suites after clearing storage', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');

    await navigateViaMenu(page, 'Manage Marks');
    await page.waitForSelector('.suite-list');

    const suiteItems = page.locator('.suite-list ion-item');
    const count = await suiteItems.count();
    console.log('Number of suites on manage page after clearing storage:', count);

    const suiteNames = await suiteItems.allTextContents();
    console.log('Suite names:', suiteNames);

    expect(count).toBeGreaterThanOrEqual(2);

    await expect(suiteItems.filter({ hasText: 'Mood' }).first()).toBeVisible();
    await expect(suiteItems.filter({ hasText: 'Checkmarks' }).first()).toBeVisible();
    await expect(suiteItems.filter({ hasText: 'Recent' }).first()).not.toBeVisible();
  });

  test('manage marks page shows built-in suites', async ({ page }) => {
    await navigateViaMenu(page, 'Manage Marks');
    await page.waitForSelector('.suite-list');

    const suiteItems = page.locator('.suite-list ion-item');
    const count = await suiteItems.count();
    console.log('Number of suites on manage page:', count);

    expect(count).toBeGreaterThanOrEqual(2);

    await expect(suiteItems.filter({ hasText: 'Mood' }).first()).toBeVisible();
    await expect(suiteItems.filter({ hasText: 'Checkmarks' }).first()).toBeVisible();
    await expect(suiteItems.filter({ hasText: 'Recent' }).first()).not.toBeVisible();
  });

  test('mood suite shows 5 marks with colors', async ({ page }) => {
    await navigateViaMenu(page, 'Manage Marks');
    await page.waitForSelector('.suite-list');

    const moodSuite = page.locator('.suite-list ion-item').filter({ hasText: 'Mood' }).first();
    await moodSuite.click();
    await page.waitForTimeout(300);

    const markItems = page.locator('.mark-item');
    const count = await markItems.count();
    console.log('Number of mood marks:', count);

    expect(count).toBe(5);

    const firstMark = markItems.first();
    const bgColor = await firstMark.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('First mood mark background on manage page:', bgColor);

    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });
});

test.describe('Recent Marks Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await ensureBoardExists(page);
  });

  test('no recent marks initially shows empty message', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const emptyMsg = recentSection.locator('.mark-grid__empty');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('No recent marks.');

    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(0);
  });

  test('applied mark appears in recent marks', async ({ page }) => {
    await navigateToBoard(page);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(1);

    const markText = await recentBtns.first().textContent();
    expect(markText).toContain('✓');
  });

  test('most recently applied mark appears first in recent marks', async ({ page }) => {
    await navigateToBoard(page);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 0);

    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(2);

    const firstMarkText = await recentBtns.first().textContent();
    console.log('First recent mark (should be Mood):', firstMarkText);
    expect(firstMarkText).toContain('😣');

    const secondMarkText = await recentBtns.nth(1).textContent();
    console.log('Second recent mark (should be Checkmark):', secondMarkText);
    expect(secondMarkText).toContain('✓');
  });

  test('re-applying same mark moves it to front of recent marks', async ({ page }) => {
    await navigateToBoard(page);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 0);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 0);

    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(2);

    const firstMarkText = await recentBtns.first().textContent();
    console.log('First recent mark after re-applying Mood:', firstMarkText);
    expect(firstMarkText).toContain('😣');

    const secondMarkText = await recentBtns.nth(1).textContent();
    console.log('Second recent mark after re-applying Mood:', secondMarkText);
    expect(secondMarkText).toContain('✓');
  });

  test('recent marks limited to 5 entries', async ({ page }) => {
    test.setTimeout(30000);
    await navigateToBoard(page);

    for (let i = 0; i < 5; i++) {
      await openMarkSelector(page);
      await applyMarkFromSuite(page, 'Mood', i);
    }

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const recentBtns = recentSection.locator('.mark-btn');
    const count = await recentBtns.count();
    console.log('Number of recent marks after applying 6:', count);
    expect(count).toBe(5);

    const firstMarkText = await recentBtns.first().textContent();
    console.log('First recent mark (should be Checkmark):', firstMarkText);
    expect(firstMarkText).toContain('✓');
  });

  test('recent suite not shown in suite dropdown', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const options = await getIonSelectOptions(page, '.suite-dropdown');
    console.log('Suite dropdown options:', options);

    expect(options.some(o => o.includes('Recent'))).toBeFalsy();
    expect(options.some(o => o.includes('Mood'))).toBeTruthy();
    expect(options.some(o => o.includes('Checkmarks'))).toBeTruthy();
  });

  test('recent mark shows correct emoji and background color', async ({ page }) => {
    await navigateToBoard(page);

    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 1);

    await openMarkSelector(page);

    const recentSection = getRecentSection(page);
    const recentBtn = recentSection.locator('.mark-btn').first();

    const markText = await recentBtn.textContent();
    console.log('Recent mark emoji:', markText);
    expect(markText).toContain('✗');

    const bgColor = await recentBtn.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    console.log('Recent mark background color:', bgColor);
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });
});
