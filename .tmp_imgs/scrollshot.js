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
  await sleep(1500);

  async function shotAt(selector, name) {
    // Scroll the element to roughly center via real wheel events so Lenis +
    // ScrollTrigger animations actually fire.
    const targetY = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return window.scrollY + rect.top - window.innerHeight * 0.18;
    }, selector);
    if (targetY == null) { console.log("MISSING", selector); return; }

    let cur = await page.evaluate(() => window.scrollY);
    const step = 600;
    while (cur < targetY - 50) {
      await page.mouse.wheel({ deltaY: step });
      await sleep(90);
      cur = await page.evaluate(() => window.scrollY);
    }
    await sleep(1600); // let entrance animations settle
    await page.screenshot({ path: `d:/my-projects/slc-demo/.tmp_imgs/${name}.png` });
    console.log("shot", name, "scrollY=", Math.round(cur), "target=", Math.round(targetY));
  }

  await shotAt("#framework", "live_framework");
  await shotAt("#protocol", "live_protocol");

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
