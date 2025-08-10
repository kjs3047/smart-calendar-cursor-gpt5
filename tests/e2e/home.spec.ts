import { test, expect } from '@playwright/test';

test('홈 랜딩에 시작하기 버튼 노출', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: '시작하기' })).toBeVisible();
});
