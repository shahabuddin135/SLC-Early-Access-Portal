const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3145/docs";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickUrdu(page) {
  await page.evaluate(() => {
    const b = document.querySelector(".docs-lang-ur");
    if (b) b.click();
  });
  await sleep(900);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });

  // Desktop EN — top
  const d = await browser.newPage();
  await d.setViewport({ width: 1280, height: 900 });
  await d.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1400);
  await d.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_en_top.png" });

  // Desktop EN — scroll to a code section
  await d.evaluate(() => document.getElementById("generate")?.scrollIntoView());
  await sleep(900);
  await d.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_en_code.png" });

  // Desktop UR — toggle + back to top
  await d.evaluate(() => window.scrollTo(0, 0));
  await clickUrdu(d);
  await sleep(600);
  await d.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_ur_top.png" });
  // UR — scroll to prerequisites to show RTL list + callout
  await d.evaluate(() => document.getElementById("prerequisites")?.scrollIntoView());
  await sleep(900);
  await d.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_ur_mid.png" });
  await d.close();

  // Mobile EN + UR
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 850, isMobile: true, hasTouch: true });
  await m.goto(BASE, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1400);
  await m.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_en_mobile.png" });
  await clickUrdu(m);
  await m.screenshot({ path: "d:/my-projects/slc-demo/.tmp_imgs/docs_ur_mobile.png" });
  await m.close();

  await browser.close();
  console.log("done");
})().catch((e) => { console.error(e); process.exit(1); });
