const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:3138/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
    defaultViewport: { width: 1366, height: 850 },
  });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);

  // Scroll downward in small steps until the accent image sits near the top.
  async function shotWhenVisible(sel, name, lo = 40, hi = 240) {
    for (let i = 0; i < 220; i++) {
      const top = await page.evaluate((s) => {
        const el = document.querySelector(s);
        if (!el) return null;
        return el.getBoundingClientRect().top;
      }, sel);
      if (top == null) { await page.mouse.wheel({ deltaY: 500 }); await sleep(80); continue; }
      if (top >= lo && top <= hi) break;
      const delta = top > hi ? 240 : -200;
      await page.mouse.wheel({ deltaY: delta });
      await sleep(110);
    }
    await sleep(1500);
    await page.screenshot({ path: `d:/my-projects/slc-demo/.tmp_imgs/${name}.png` });
    const finalTop = await page.evaluate((s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top) : null; }, sel);
    console.log("shot", name, "accent top=", finalTop);
  }

  await shotWhenVisible(".fw-illus", "live_framework2", -40, 200);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
