import { test, expect } from '@playwright/test';

test.describe('カリキュラム一覧', () => {
  test('モバイルで章カードをタップしモーダル経由で学習を始められる', async ({
    page,
  }) => {
    // iPhone SE サイズ
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/curriculum');

    // ログインページにリダイレクトされる場合はスキップ
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 章カードが表示されるまで待つ
    const chapterCard = page
      .locator('button[aria-label*="の詳細を表示"]')
      .first();
    await expect(chapterCard).toBeVisible({ timeout: 10000 });

    // 章カードをタップしてモーダルを開く
    await chapterCard.click();

    // モーダル内の「学習を始める」または「続きから学習する」リンクが表示されるか
    const startLink = page
      .locator('a:has-text("学習を"), a:has-text("続きから")')
      .first();
    await expect(startLink).toBeVisible({ timeout: 3000 });

    // リンクのhref属性を確認
    const href = await startLink.getAttribute('href');
    expect(href).toContain('/curriculum/');

    // リンクをタップ
    await startLink.click();

    // 遷移を確認
    await page.waitForURL('**/curriculum/**', { timeout: 5000 });
    expect(page.url()).toContain('/curriculum/');
  });
});
