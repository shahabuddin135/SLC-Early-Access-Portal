const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function centerAndShot(page, sel, name, idx = 0, frac = 0.5) {
  const vh = await page.evaluate(() => window.innerHeight);
  for (let i = 0; i < 200; i++) {
    const c = await page.evaluate((s, ix) => {
      const els = document.querySelectorAll(s);
      const el = els[ix];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    }, sel, idx);
    if (c == null) { await page.mouse.wheel({ deltaY: 500 }); await sleep(90); continue; }
    const target = vh * frac;
    if (Math.abs(c - target) < vh * 0.06) break;
    let d = c > target ? Math.min(260, c - target) : Math.max(-220, c - target);
    await page.mouse.wheel({ deltaY: d });
    await sleep(200);
  }
  await sleep(1400);
  await page.screenshot({ path: `d:/my-projects/slc-demo/.tmp_imgs/${name}.png` });
  console.log("shot", name);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  const dp = await browser.newPage();
  await dp.setViewport({ width: 1366, height: 900 });
  await dp.goto("http://localhost:3140/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  await centerAndShot(dp, ".fw-intro", "fw_intro_d", 0, 0.45);
  await centerAndShot(dp, ".fw-row", "fw_steps_d", 4, 0.5);
  await dp.close();

  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 800, isMobile: true, hasTouch: true });
  await mp.goto("http://localhost:3140/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  await centerAndShot(mp, ".fw-art", "fw_intro_m", 0, 0.4);
  await mp.close();

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
