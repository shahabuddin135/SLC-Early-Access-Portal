const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sample(page, label) {
  let minTop = 1e9, maxTop = -1e9, minH = 1e9, maxH = -1e9;
  let memH = null, memTop = null, structH = null;
  for (let i = 0; i < 200; i++) {
    const d = await page.evaluate(() => {
      const head = document.querySelector(".hero-headline");
      const art = document.querySelector(".hero-art-wide") || document.querySelector(".hero-mascot");
      if (!head || !art) return null;
      return {
        text: head.textContent.replace(/\s+/g, " ").trim(),
        headlineH: Math.round(head.getBoundingClientRect().height),
        mascotTop: Math.round(art.getBoundingClientRect().top),
      };
    });
    if (d) {
      minTop = Math.min(minTop, d.mascotTop); maxTop = Math.max(maxTop, d.mascotTop);
      minH = Math.min(minH, d.headlineH); maxH = Math.max(maxH, d.headlineH);
      if (/memory-anchored/.test(d.text)) { memH = d.headlineH; memTop = d.mascotTop; }
      if (/structured/.test(d.text)) { structH = d.headlineH; }
    }
    await sleep(170);
  }
  console.log(`\n=== ${label} ===`);
  console.log(`  headlineH: min=${minH} max=${maxH}  (delta ${maxH - minH})`);
  console.log(`  mascotTop: min=${minTop} max=${maxTop}  (delta ${maxTop - minTop})`);
  console.log(`  memory-anchored: headlineH=${memH} mascotTop=${memTop} ; structured headlineH=${structH}`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  const dp = await browser.newPage();
  await dp.setViewport({ width: 1280, height: 820 });
  await dp.goto("http://localhost:3141/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1500);
  await sample(dp, "DESKTOP 1280");
  await dp.setViewport({ width: 1024, height: 800 });
  await dp.reload({ waitUntil: "networkidle2" });
  await sleep(1500);
  await sample(dp, "DESKTOP 1024");
  await dp.close();
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
