import { chromium } from '/home/mm_admin/time-stack/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = 'http://localhost:5181/mou-isshu/';
const OUT = resolve('_diag/buttons');
mkdirSync(OUT, { recursive: true });

const WIDTHS = [320, 360, 390];

// ページ内で .compose-button / .back-button / .link-button / .chip を計測する
function measureScript() {
  const sels = ['.compose-button', '.back-button', '.link-button', '.chip'];
  const vw = window.innerWidth;
  const out = [];
  for (const sel of sels) {
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
      const rect = el.getBoundingClientRect();
      // テキストノードの行数 (折り返し) を rects から数える
      const range = document.createRange();
      range.selectNodeContents(el);
      const lineCount = range.getClientRects().length;
      out.push({
        sel,
        text: el.textContent.trim(),
        clientWidth: Math.round(el.clientWidth),
        scrollWidth: Math.round(el.scrollWidth),
        overflowX: Math.round(el.scrollWidth - el.clientWidth),
        offsetHeight: Math.round(el.offsetHeight),
        lineHeightPx: Math.round(lh),
        textLineRects: lineCount,
        rightEdge: Math.round(rect.right),
        beyondViewport: Math.round(rect.right) - vw,
        whiteSpace: cs.whiteSpace,
      });
    }
  }
  return { vw, out };
}

const browser = await chromium.launch();
const errors = [];
const report = {};

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${width}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[${width}] pageerror ${e.message}`));

  const wrec = {};

  // --- TOP ---
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/w${width}-1-top.png`, fullPage: true });
  wrec.top = await page.evaluate(measureScript);

  // --- TASTE ---
  await page.click('button.compose-button:has-text("詠")');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/w${width}-2-taste.png`, fullPage: true });
  wrec.taste = await page.evaluate(measureScript);

  // タグ選択後 (「選択を全て解除」リンクが出る + ボタンが「詠む」に変わる)
  await page.click('button.chip:has-text("春")').catch(() => {});
  await page.click('button.chip:has-text("懐かしい")').catch(() => {});
  await page.waitForTimeout(150);
  await page.screenshot({ path: `${OUT}/w${width}-2b-taste-selected.png`, fullPage: true });
  // 解除して おまかせ ラベルへ戻す
  await page.click('.link-button:has-text("解除")').catch(() => {});
  await page.waitForTimeout(150);

  // --- TANKA ---
  await page.click('.taste-actions button.compose-button');
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${OUT}/w${width}-3-tanka.png`, fullPage: true });
  wrec.tanka = await page.evaluate(measureScript);

  // 1句 pin → ラベルが「4 句 を 詠 み 直 す」になる
  await page.click('.tanka-line:nth-child(1) .pin-button').catch(() => {});
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/w${width}-3b-tanka-pinned.png`, fullPage: true });
  wrec.tankaPinned = await page.evaluate(measureScript);

  report[width] = wrec;
  await ctx.close();
}

await browser.close();

// === 計測サマリ: 折り返し or オーバーフロー の検出 ===
console.log('=== ボタン折り返し / オーバーフロー 実測 ===\n');
const problems = [];
for (const width of WIDTHS) {
  console.log(`\n######## viewport ${width}px ########`);
  for (const [screen, data] of Object.entries(report[width])) {
    console.log(`\n-- ${screen} (vw=${data.vw}) --`);
    for (const b of data.out) {
      const wrapped = b.textLineRects > 1;
      const overflow = b.overflowX > 1;
      const beyond = b.beyondViewport > 0;
      const flag = wrapped ? ' ⚠️折返' : overflow ? ' ⚠️溢れ(nowrap)' : beyond ? ' ⚠️画面外' : '';
      if (flag) problems.push(`${width}px ${screen} "${b.text}"${flag}`);
      console.log(
        `  "${b.text}" ws=${b.whiteSpace} w=${b.clientWidth} scroll=${b.scrollWidth} ` +
        `行rects=${b.textLineRects} h=${b.offsetHeight}(lh${b.lineHeightPx}) ` +
        `右端=${b.rightEdge}/${data.vw}${flag}`,
      );
    }
  }
}

console.log('\n\n=== 問題サマリ ===');
if (problems.length === 0) console.log('  折り返し / オーバーフロー / 画面外 = なし');
else problems.forEach((p) => console.log('  ' + p));

console.log('\n=== console / page errors ===');
if (errors.length === 0) console.log('  なし');
else errors.forEach((e) => console.log('  ' + e));
