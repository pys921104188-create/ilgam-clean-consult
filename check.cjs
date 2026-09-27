const { chromium } = require('C:/Users/pys92/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const pageErrors = [];
  let requests = 0;
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.route('https://formsubmit.co/**', async route => {
    requests += 1;
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Almost There</h1>' });
  });

  await page.goto('http://127.0.0.1:8080/?step=detail&rid=IG-12345678-1234-1234-1234-123456789abc');
  const submit = page.locator('#detail-form [type="submit"]');
  await submit.click();
  assert.equal(requests, 0, '필수 항목 누락은 외부 전송 전에 차단해야 합니다.');
  await page.locator('[name="이름"]').fill('[테스트] 자동 점검');
  await page.locator('#detail-phone').fill('010-0000-0000');
  await page.locator('[name="주소"]').fill('[테스트] 서울시 테스트구');
  await page.locator('[name="건물 규모"]').fill('[테스트] 100평');
  await submit.click();
  assert.equal(requests, 0, '개인정보 동의 누락은 외부 전송 전에 차단해야 합니다.');
  await page.locator('#detail-form [name="개인정보 수집·이용 동의"]').check();
  await submit.click({ clickCount: 2 });
  await page.waitForURL('https://formsubmit.co/**');
  assert.equal(requests, 1, '중복 클릭은 한 번의 전송만 만들어야 합니다.');
  await page.goBack();
  await page.waitForLoadState('domcontentloaded');
  assert.match(await page.locator('#detail-form .error').innerText(), /전송이 끝나지 않았습니다/);

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://127.0.0.1:8080/');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `가로 넘침 ${width}px`);
  }

  assert.deepEqual(pageErrors, []);
  await browser.close();
  console.log('PASS: 필수값, 동의, 중복 클릭, CAPTCHA 미완료 복귀 안내, 320/390/768/1440 반응형');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
