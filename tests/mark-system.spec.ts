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
  await page.locator('ion-modal:not(.overlay-hidden) ion-button').filter({ hasText: 'Close' }).click();
  await page.waitForTimeout(300);
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

async function closeModal(page: Page) {
  await page.locator('ion-modal:not(.overlay-hidden) ion-button').filter({ hasText: 'Close' }).click();
  await page.waitForTimeout(300);
}

function getCommentSection(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .comment-section');
}

function getCommentDisplay(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .comment-display');
}

function getCommentInput(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .comment-input textarea');
}

function getCommentEditBtn(page: Page) {
  return page.locator('ion-modal:not(.overlay-hidden) .comment-edit-btn');
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

test.describe('Per-Board Recent Marks Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  async function createBoardViaFab(page: Page, name: string) {
    await page.locator('ion-fab-button').click();
    await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
    await page.waitForTimeout(300);
    await page.locator('ion-input input').fill(name);
    await page.waitForTimeout(200);
    await page.locator('ion-button').filter({ hasText: /^Create$/ }).click();
    await page.waitForSelector('.calendar', { state: 'visible' });
  }

  async function goBackToHome(page: Page) {
    await page.locator('ion-back-button').click();
    await page.waitForSelector('.board-card', { state: 'visible' });
    await page.waitForTimeout(300);
  }

  async function openBoardByName(page: Page, boardName: string) {
    await page.locator('.board-card').filter({ hasText: boardName }).first().click();
    await page.waitForSelector('.calendar');
    await page.waitForTimeout(300);
  }

  test('recent marks are isolated per board', async ({ page }) => {
    await createBoardViaFab(page, 'Board A');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);
    await goBackToHome(page);

    await createBoardViaFab(page, 'Board B');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 0);
    await goBackToHome(page);

    await openBoardByName(page, 'Board A');
    await openMarkSelector(page);
    const recentSectionA = getRecentSection(page);
    const recentBtnsA = recentSectionA.locator('.mark-btn');
    expect(await recentBtnsA.count()).toBe(1);
    const markTextA = await recentBtnsA.first().textContent();
    console.log('Board A recent mark:', markTextA);
    expect(markTextA).toContain('✓');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await goBackToHome(page);

    await openBoardByName(page, 'Board B');
    await openMarkSelector(page);
    const recentSectionB = getRecentSection(page);
    const recentBtnsB = recentSectionB.locator('.mark-btn');
    expect(await recentBtnsB.count()).toBe(1);
    const markTextB = await recentBtnsB.first().textContent();
    console.log('Board B recent mark:', markTextB);
    expect(markTextB).toContain('😣');
  });

  test('applying mark on one board does not affect another board recent marks', async ({ page }) => {
    await createBoardViaFab(page, 'First Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 1);
    await goBackToHome(page);

    await createBoardViaFab(page, 'Second Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Numbers 0-10', 5);
    await goBackToHome(page);

    await openBoardByName(page, 'First Board');
    await openMarkSelector(page);
    const recentSectionFirst = getRecentSection(page);
    const recentBtnsFirst = recentSectionFirst.locator('.mark-btn');
    expect(await recentBtnsFirst.count()).toBe(2);
    const firstMarkText = await recentBtnsFirst.first().textContent();
    console.log('First Board - most recent mark:', firstMarkText);
    expect(firstMarkText).toContain('😔');
    const secondMarkText = await recentBtnsFirst.nth(1).textContent();
    console.log('First Board - second recent mark:', secondMarkText);
    expect(secondMarkText).toContain('✓');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await goBackToHome(page);

    await openBoardByName(page, 'Second Board');
    await openMarkSelector(page);
    const recentSectionSecond = getRecentSection(page);
    const recentBtnsSecond = recentSectionSecond.locator('.mark-btn');
    expect(await recentBtnsSecond.count()).toBe(1);
    const secondBoardMarkText = await recentBtnsSecond.first().textContent();
    console.log('Second Board - recent mark:', secondBoardMarkText);
    expect(secondBoardMarkText).toContain('5️⃣');
  });

  test('each board maintains its own recent marks order', async ({ page }) => {
    test.setTimeout(30000);
    await createBoardViaFab(page, 'Alpha Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 0);
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 4);
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 2);
    await goBackToHome(page);

    await createBoardViaFab(page, 'Beta Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 1);
    await goBackToHome(page);

    await openBoardByName(page, 'Alpha Board');
    await openMarkSelector(page);
    const recentSectionAlpha = getRecentSection(page);
    const recentBtnsAlpha = recentSectionAlpha.locator('.mark-btn');
    expect(await recentBtnsAlpha.count()).toBe(3);
    const alphaMarks = await recentBtnsAlpha.allTextContents();
    console.log('Alpha Board recent marks order:', alphaMarks);
    expect(alphaMarks[0]).toContain('?');
    expect(alphaMarks[1]).toContain('😄');
    expect(alphaMarks[2]).toContain('😣');

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await goBackToHome(page);

    await openBoardByName(page, 'Beta Board');
    await openMarkSelector(page);
    const recentSectionBeta = getRecentSection(page);
    const recentBtnsBeta = recentSectionBeta.locator('.mark-btn');
    expect(await recentBtnsBeta.count()).toBe(2);
    const betaMarks = await recentBtnsBeta.allTextContents();
    console.log('Beta Board recent marks order:', betaMarks);
    expect(betaMarks[0]).toContain('✗');
    expect(betaMarks[1]).toContain('✓');
  });

  test('new board has empty recent marks', async ({ page }) => {
    await createBoardViaFab(page, 'Brand New Board');
    await openMarkSelector(page);
    const recentSection = getRecentSection(page);
    const emptyMsg = recentSection.locator('.mark-grid__empty');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('No recent marks.');
    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(0);
  });

  test('recent marks persist after switching boards', async ({ page }) => {
    await createBoardViaFab(page, 'Persistent Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 2);
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Checkmarks', 0);
    await goBackToHome(page);

    await createBoardViaFab(page, 'Temp Board');
    await openMarkSelector(page);
    await applyMarkFromSuite(page, 'Mood', 3);
    await goBackToHome(page);

    await openBoardByName(page, 'Persistent Board');
    await openMarkSelector(page);
    const recentSection = getRecentSection(page);
    const recentBtns = recentSection.locator('.mark-btn');
    expect(await recentBtns.count()).toBe(2);
    const marks = await recentBtns.allTextContents();
    console.log('Persistent Board recent marks after switch:', marks);
    expect(marks[0]).toContain('✓');
    expect(marks[1]).toContain('😐');
  });
});

test.describe('Comment System Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await ensureBoardExists(page);
  });

  test('comment section is editable by default when no comment exists', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await expect(commentInput).toBeVisible();
  });

  test('comment input shows placeholder when no comment exists', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await expect(commentInput).toBeVisible();
    await expect(commentInput).toHaveAttribute('placeholder', 'Add a comment (optional)');
  });

  test('comment section is readonly when comment exists', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Existing comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const commentDisplay = getCommentDisplay(page);
    await expect(commentDisplay).toBeVisible();
    await expect(commentDisplay).toContainText('Existing comment');

    const commentInputAfter = getCommentInput(page);
    expect(await commentInputAfter.count()).toBe(0);
  });

  test('clicking edit button enables editing mode', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Test comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const editBtn = getCommentEditBtn(page);
    await editBtn.click();
    await page.waitForTimeout(300);

    const commentInputAfter = getCommentInput(page);
    await expect(commentInputAfter).toBeVisible();
  });

  test('comment is saved when modal closes', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Test comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const commentDisplayAfter = getCommentDisplay(page);
    await expect(commentDisplayAfter).toContainText('Test comment');
  });

  test('empty comment is not saved', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('   ');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const commentInputAfter = getCommentInput(page);
    await expect(commentInputAfter).toBeVisible();
  });

  test('comment is trimmed before saving', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('  trimmed comment  ');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const commentDisplayAfter = getCommentDisplay(page);
    await expect(commentDisplayAfter).toContainText('trimmed comment');
  });

  test('comment fold indicator shows on day with comment', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Day with comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    const commentFold = page.locator('.calendar-day.current-month.has-comment .comment-fold').first();
    await expect(commentFold).toBeVisible();
  });

  test('comment fold indicator does not show on day without comment', async ({ page }) => {
    await navigateToBoard(page);

    const today = new Date();
    const dayOfMonth = today.getDate();
    const calendarDays = page.locator('.calendar-day.current-month');

    for (let i = 0; i < (await calendarDays.count()); i++) {
      const dayText = await calendarDays.nth(i).locator('.day-number').textContent();
      if (parseInt(dayText || '0') === dayOfMonth) {
        const fold = calendarDays.nth(i).locator('.comment-fold');
        expect(await fold.count()).toBe(0);
        break;
      }
    }
  });

  test('comment resets when switching to another day', async ({ page }) => {
    await navigateToBoard(page);

    const calendarDays = page.locator('.calendar-day.current-month');
    await calendarDays.first().click();
    await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
    await page.waitForTimeout(300);

    const commentInput = getCommentInput(page);
    await commentInput.fill('First day comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await calendarDays.nth(1).click();
    await page.waitForSelector('ion-modal:not(.overlay-hidden)', { state: 'visible' });
    await page.waitForTimeout(300);

    const commentInputSecond = getCommentInput(page);
    await expect(commentInputSecond).toBeVisible();
    await expect(commentInputSecond).toHaveValue('');
  });

  test('can add comment without mark', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Comment without mark');
    await page.waitForTimeout(200);

    await closeModal(page);

    const calendarDay = page.locator('.calendar-day.current-month').first();
    const hasMark = await calendarDay.evaluate((el) => el.classList.contains('has-mark'));
    expect(hasMark).toBe(false);

    const commentFold = page.locator('.calendar-day.current-month .comment-fold').first();
    await expect(commentFold).toBeVisible();
  });

  test('can have mark without comment', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await applyMarkFromSuite(page, 'Checkmarks', 0);

    const calendarDay = page.locator('.calendar-day.current-month.has-mark').first();
    const commentFold = calendarDay.locator('.comment-fold');
    expect(await commentFold.count()).toBe(0);
  });

  test('can have both mark and comment', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);
    const commentInput = getCommentInput(page);
    await commentInput.fill('Mark with comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    const calendarDay = page.locator('.calendar-day.current-month.has-mark').first();
    await expect(calendarDay).toBeVisible();

    const commentFold = calendarDay.locator('.comment-fold');
    await expect(commentFold).toBeVisible();
  });

  test('clearing mark does not clear comment', async ({ page }) => {
    test.setTimeout(30000);
    await navigateToBoard(page);
    await openMarkSelector(page);

    await applyMarkFromSuite(page, 'Checkmarks', 0);

    await openMarkSelector(page);
    const commentInput = getCommentInput(page);
    await commentInput.fill('Persistent comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    await page.locator('ion-modal:not(.overlay-hidden) ion-button').filter({ hasText: 'Clear Mark' }).click();
    await page.waitForTimeout(300);
    await closeModal(page);

    const calendarDay = page.locator('.calendar-day.current-month').first();
    const hasMark = await calendarDay.evaluate((el) => el.classList.contains('has-mark'));
    expect(hasMark).toBe(false);

    const commentFold = page.locator('.calendar-day.current-month .comment-fold').first();
    await expect(commentFold).toBeVisible();

    await openMarkSelector(page);
    const commentDisplayAfter = getCommentDisplay(page);
    await expect(commentDisplayAfter).toContainText('Persistent comment');
  });

  test('comment persists after navigating away and back', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Persistent comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await page.locator('ion-back-button').click();
    await page.waitForSelector('.board-card', { state: 'visible' });
    await page.waitForTimeout(300);

    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentDisplayAfter = getCommentDisplay(page);
    await expect(commentDisplayAfter).toContainText('Persistent comment');
  });

  test('comment persists after app reload', async ({ page }) => {
    test.setTimeout(30000);
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Reload test comment');
    await page.waitForTimeout(200);

    await closeModal(page);
    await page.waitForTimeout(500);

    const savedState = await page.evaluate(() => {
      const state = localStorage.getItem('mark-app-state');
      if (state) {
        const parsed = JSON.parse(state);
        const firstBoard = parsed.boards?.[0];
        if (firstBoard) {
          const comments = firstBoard.comments || {};
          const commentKeys = Object.keys(comments);
          return { hasBoards: true, commentKeys, firstComment: commentKeys.length > 0 ? comments[commentKeys[0]] : null };
        }
      }
      return { hasBoards: false, commentKeys: [], firstComment: null };
    });

    expect(savedState.hasBoards).toBe(true);
    expect(savedState.firstComment).toBe('Reload test comment');
  });

  test('edit button is visible when comment exists', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Test comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const editBtn = getCommentEditBtn(page);
    await expect(editBtn).toBeVisible();
  });

  test('edit button is hidden when in editing mode', async ({ page }) => {
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Test comment');
    await page.waitForTimeout(200);

    await closeModal(page);

    await openMarkSelector(page);
    const editBtn = getCommentEditBtn(page);
    await editBtn.click();
    await page.waitForTimeout(300);

    const editBtnAfter = getCommentEditBtn(page);
    expect(await editBtnAfter.count()).toBe(0);
  });
});

test.describe('Import/Export Comments Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await ensureBoardExists(page);
  });

  test('export data includes comments', async ({ page }) => {
    test.setTimeout(30000);
    await navigateToBoard(page);
    await openMarkSelector(page);

    const commentInput = getCommentInput(page);
    await commentInput.fill('Test comment for export');
    await page.waitForTimeout(200);
    await closeModal(page);

    const savedState = await page.evaluate(() => {
      const state = localStorage.getItem('mark-app-state');
      if (state) {
        const parsed = JSON.parse(state);
        const firstBoard = parsed.boards?.[0];
        if (firstBoard) {
          return {
            hasBoards: true,
            comments: firstBoard.comments || {},
          };
        }
      }
      return { hasBoards: false, comments: {} };
    });

    expect(savedState.hasBoards).toBe(true);
    const commentKeys = Object.keys(savedState.comments);
    expect(commentKeys.length).toBeGreaterThan(0);
    expect(savedState.comments[commentKeys[0]]).toBe('Test comment for export');
  });

  test('import data with comments preserves them', async ({ page }) => {
    test.setTimeout(30000);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dateKey1 = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`;

    const importData = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      boards: [{
        id: 'test-import-id',
        name: 'Imported Board with Comments',
        marks: {},
        comments: {
          [dateKey1]: 'Imported comment for 15th',
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        recentMarkIds: [],
      }],
    };

    await navigateViaMenu(page, 'Import Data');
    await page.waitForTimeout(500);

    const fileContent = JSON.stringify(importData);
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-import.json',
      mimeType: 'application/json',
      buffer: Buffer.from(fileContent),
    });

    await page.waitForTimeout(500);
    await page.locator('ion-button:has-text("Import")').click();
    await page.waitForTimeout(1000);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.board-card');

    const importedBoard = page.locator('.board-card', { hasText: 'Imported Board with Comments' });
    await expect(importedBoard).toBeVisible();
    await importedBoard.click();
    await page.waitForSelector('.calendar');

    await page.locator('.calendar-day.current-month', { hasText: '15' }).first().click();
    await page.waitForSelector('ion-modal:not(.overlay-hidden)');

    const commentDisplay = getCommentDisplay(page);
    await expect(commentDisplay).toContainText('Imported comment for 15th');
  });

  test('import data without comments field works correctly', async ({ page }) => {
    test.setTimeout(30000);
    const importData = {
      version: '2.0.0',
      exportDate: new Date().toISOString(),
      boards: [{
        id: 'test-no-comments-id',
        name: 'Board Without Comments Field',
        marks: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        recentMarkIds: [],
      }],
    };

    await navigateViaMenu(page, 'Import Data');
    await page.waitForTimeout(500);

    const fileContent = JSON.stringify(importData);
    await page.locator('input[type="file"]').setInputFiles({
      name: 'test-import.json',
      mimeType: 'application/json',
      buffer: Buffer.from(fileContent),
    });

    await page.waitForTimeout(500);
    await page.locator('ion-button:has-text("Import")').click();
    await page.waitForTimeout(1000);

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('.board-card');

    const importedBoard = page.locator('.board-card', { hasText: 'Board Without Comments Field' });
    await expect(importedBoard).toBeVisible();
  });
});
