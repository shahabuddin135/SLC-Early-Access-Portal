const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3143";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  // Footer sparkle link — scroll the landing page to the footer
  const fp = await browser.newPage();
  await fp.setViewport({ width: 1366, height: 860 });
  await fp.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200);
  for (let i = 0; i < 80; i++) {
    const done = await fp.evaluate(() => {
      const el = document.querySelector(".footer-content");
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.55 && r.top > -50;
    });
    if (done) break;
    await fp.mouse.wheel({ deltaY: 900 });
    await sleep(130);
  }
  await sleep(1500);
  await fp.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/footer_sparkle.png" });
  console.log("shot footer");
  await fp.close();

  // Testers page — top (Ilsa note) and capture
  const tp = await browser.newPage();
  await tp.setViewport({ width: 1366, height: 900 });
  await tp.goto(BASE + "/testers", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1800);
  await tp.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/testers_notes.png" });
  console.log("shot testers");
  await tp.close();

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
