import { chromium } from '/home/mm_admin/time-stack/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = 'http://localhost:5181/mou-isshu/';
const OUT = resolve('_diag');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 800, height: 1200 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
});
page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));

// TOP
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/01-top-empty.png`, fullPage: true });

// 詠む → テイスト
await page.click('button:has-text("詠")');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/02-taste.png`, fullPage: true });

// 春 + コンビニ風 (任意のタグ選択)
await page.click('button.chip:has-text("春")').catch(() => {});
await page.click('button.chip:has-text("寂しい")').catch(() => {});
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/03-taste-selected.png`, fullPage: true });

// 詠む
await page.click('.taste-actions button.compose-button');
await page.waitForTimeout(3500); // 筆アニメ完了待ち (~2580ms + 余裕)
await page.screenshot({ path: `${OUT}/04-tanka.png`, fullPage: true });

// ロック試し: 第1句を pin
await page.click('.tanka-line:nth-child(1) .pin-button').catch(() => {});
await page.waitForTimeout(200);
await page.screenshot({ path: `${OUT}/05-tanka-pinned.png`, fullPage: true });

// もう一句
await page.click('button:has-text("も う 一 句")');
await page.waitForTimeout(3500);
await page.screenshot({ path: `${OUT}/06-tanka-recomposed.png`, fullPage: true });

// お気に入り
await page.click('.fav-button');
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/07-tanka-fav.png`, fullPage: true });

// 戻る
await page.click('button:has-text("戻")');
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/08-top-with-fav.png`, fullPage: true });

console.log('=== capture done ===');
console.log(`out: ${OUT}`);
if (errors.length > 0) {
  console.log('--- console / page errors ---');
  errors.forEach((e) => console.log(e));
} else {
  console.log('no console / page errors');
}

await browser.close();
