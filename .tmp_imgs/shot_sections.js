const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function centerAndShot(page, sel, name) {
  const vh = await page.evaluate(() => window.innerHeight);
  for (let i = 0; i < 200; i++) {
    const c = await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    }, sel);
    if (c == null) { await page.mouse.wheel({ deltaY: 500 }); await sleep(90); continue; }
    const lo = vh * 0.42, hi = vh * 0.58;
    if (c >= lo && c <= hi) break;
    let d = c > hi ? Math.min(260, (c - vh / 2)) : Math.max(-220, (c - vh / 2));
    await page.mouse.wheel({ deltaY: d });
    await sleep(200);
  }
  await sleep(1500);
  await page.screenshot({ path: `d:/my-projects/slc-demo/.tmp_imgs/${name}.png` });
  const c = await page.evaluate((s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top) : null; }, sel);
  console.log("shot", name, "grid top=", c);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  // Desktop
  const dp = await browser.newPage();
  await dp.setViewport({ width: 1366, height: 900 });
  await dp.goto("http://localhost:3139/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  await centerAndShot(dp, ".fw-grid", "feat_framework_d");
  await centerAndShot(dp, ".verdict-grid", "feat_protocol_d");
  await dp.close();

  // Mobile
  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 800, isMobile: true, hasTouch: true });
  await mp.goto("http://localhost:3139/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  await centerAndShot(mp, ".fw-art", "feat_framework_m");
  await centerAndShot(mp, ".verdict-art", "feat_protocol_m");
  await mp.close();

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
