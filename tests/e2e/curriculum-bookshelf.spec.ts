import { test, expect } from '@playwright/test';

test.describe('カリキュラム本棚', () => {
  test('モバイルで本を開いて冒険を続けるリンクをタップできる', async ({
    page,
  }) => {
    // iPhone SE サイズ
    await page.setViewportSize({ width: 375, height: 667 });

    // ログインが必要なのでスキップして直接URLにアクセス
    // 認証が必要な場合はこのテストは手動確認
    await page.goto('/curriculum');

    // ログインページにリダイレクトされる場合はスキップ
    if (page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 本棚が表示されるまで待つ
    const bookSpine = page.locator('button[aria-label*="を開く"]').first();
    await expect(bookSpine).toBeVisible({ timeout: 10000 });

    // 本をタップ
    await bookSpine.click();

    // アニメーション完了を待つ（2秒）
    await page.waitForTimeout(2500);

    // 「冒険を続ける」または「冒険を始める」リンクが表示されるか
    const startLink = page.locator('a:has-text("冒険")').first();
    await expect(startLink).toBeVisible({ timeout: 5000 });

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
