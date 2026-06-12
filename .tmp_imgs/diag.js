const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sample(page, label) {
  const seen = new Map(); // word -> {mascotTop, headlineH}
  for (let i = 0; i < 80; i++) {
    const d = await page.evaluate(() => {
      const head = document.querySelector(".hero-headline");
      const art = document.querySelector(".hero-art-wide") || document.querySelector(".hero-mascot");
      if (!head || !art) return null;
      const t = head.textContent.replace(/\s+/g, " ").trim();
      return {
        text: t,
        headlineH: Math.round(head.getBoundingClientRect().height),
        mascotTop: Math.round(art.getBoundingClientRect().top),
      };
    });
    if (d) {
      // crude "current rotating word": strip the static parts
      let w = d.text.replace(/^A[n]?\s*/, "").replace(/language.*$/i, "").trim();
      if (!seen.has(w)) seen.set(w, { headlineH: d.headlineH, mascotTop: d.mascotTop });
    }
    await sleep(180);
  }
  console.log("\n=== " + label + " ===");
  let tops = [];
  for (const [w, v] of seen) {
    console.log(`  word="${w}"  headlineH=${v.headlineH}  mascotTop=${v.mascotTop}`);
    tops.push(v.mascotTop);
  }
  if (tops.length) console.log(`  mascotTop range = ${Math.min(...tops)}..${Math.max(...tops)}  (delta ${Math.max(...tops) - Math.min(...tops)})`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  const dp = await browser.newPage();
  await dp.setViewport({ width: 1280, height: 820 });
  await dp.goto("http://localhost:3141/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2000);
  await sample(dp, "DESKTOP 1280");
  await dp.close();

  const mp = await browser.newPage();
  await mp.setViewport({ width: 390, height: 800, isMobile: true, hasTouch: true });
  await mp.goto("http://localhost:3141/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2000);
  await sample(mp, "MOBILE 390");
  await mp.close();

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
