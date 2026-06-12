const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
    defaultViewport: { width: 1366, height: 850 },
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:3138/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  // get into the neighbourhood
  for (let i = 0; i < 60; i++) {
    const top = await page.evaluate(() => { const e = document.querySelector(".fw-illus"); return e ? e.getBoundingClientRect().top : null; });
    if (top != null && top <= 260) break;
    await page.mouse.wheel({ deltaY: 300 }); await sleep(110);
  }
  // fine tune slowly so momentum dies
  for (let i = 0; i < 40; i++) {
    const top = await page.evaluate(() => { const e = document.querySelector(".fw-illus"); return e ? e.getBoundingClientRect().top : null; });
    if (top != null && top >= 90 && top <= 200) break;
    await page.mouse.wheel({ deltaY: top > 200 ? 90 : -90 }); await sleep(260);
  }
  await sleep(1500);
  await page.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/live_framework3.png" });
  const t = await page.evaluate(() => { const e = document.querySelector(".fw-illus"); return e ? Math.round(e.getBoundingClientRect().top) : null; });
  console.log("accent top=", t);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
