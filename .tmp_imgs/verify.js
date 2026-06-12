const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3142";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function heroDiag(page, label) {
  let minH = 1e9, maxH = -1e9, minTop = 1e9, maxTop = -1e9, memH = null;
  for (let i = 0; i < 170; i++) {
    const d = await page.evaluate(() => {
      const head = document.querySelector(".hero-headline");
      const art = document.querySelector(".hero-art-wide") || document.querySelector(".hero-mascot");
      if (!head || !art) return null;
      return {
        text: head.textContent.replace(/\s+/g, " ").trim(),
        h: Math.round(head.getBoundingClientRect().height),
        top: Math.round(art.getBoundingClientRect().top),
      };
    });
    if (d) {
      minH = Math.min(minH, d.h); maxH = Math.max(maxH, d.h);
      minTop = Math.min(minTop, d.top); maxTop = Math.max(maxTop, d.top);
      if (/memory-anchored/.test(d.text)) memH = d.h;
    }
    await sleep(170);
  }
  console.log(`HERO ${label}: headlineH ${minH}..${maxH} (delta ${maxH - minH}) | mascotTop delta ${maxTop - minTop} | mem headlineH ${memH}`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  // Hero shift check
  const hp = await browser.newPage();
  await hp.setViewport({ width: 1280, height: 820 });
  await hp.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1500);
  await heroDiag(hp, "1280");
  await hp.close();

  // Testers desktop — top
  const tp = await browser.newPage();
  await tp.setViewport({ width: 1366, height: 900 });
  await tp.goto(BASE + "/testers", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1800);
  await tp.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/testers_top.png" });
  // scroll to second tester
  await tp.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.42));
  await sleep(1200);
  await tp.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/testers_mid.png" });
  await tp.close();

  // Testers mobile
  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 800, isMobile: true, hasTouch: true });
  await mp.goto(BASE + "/testers", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1800);
  await mp.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/testers_mobile.png" });
  await mp.close();

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
