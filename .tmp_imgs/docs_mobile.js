const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3145/docs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 850, isMobile: true, hasTouch: true });
  await m.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1500);
  await m.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_en_mobile.png" });
  await m.evaluate(() => { const b = document.querySelector(".docs-lang-ur"); if (b) b.click(); });
  await sleep(1100);
  await m.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_ur_mobile.png" });
  await browser.close();
  console.log("done");
})().catch((e) => { console.error(String(e)); process.exit(1); });
