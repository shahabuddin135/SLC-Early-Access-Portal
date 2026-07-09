// Bilingual (English + Urdu) documentation content for the SLC framework.
// Code blocks are shared across languages (prompts are written in English).

export type Lang = "en" | "ur";

export type Block =
  | { t: "p"; en: string; ur: string }
  | { t: "h3"; en: string; ur: string }
  | { t: "ul"; en: string[]; ur: string[] }
  | { t: "ol"; en: string[]; ur: string[] }
  | { t: "code"; lang?: string; code: string }
  | { t: "callout"; tone: "tip" | "warn" | "info"; en: string; ur: string };

export interface DocSection {
  id: string;
  num: string;
  title: { en: string; ur: string };
  blocks: Block[];
}

export const UI: Record<string, { en: string; ur: string }> = {
  eyebrow: { en: "SLC · Guide", ur: "SLC · رہنما" },
  title: { en: "Documentation", ur: "دستاویزات" },
  subtitle: {
    en: "Everything you need to build structured, hallucination-resistant software with SLC — from first setup to shipping.",
    ur: "SLC کے ساتھ مستحکم اور غلطی سے محفوظ سافٹ ویئر بنانے کے لیے درکار ہر چیز — پہلے سیٹ اپ سے لے کر پروجیکٹ مکمل کرنے تک۔",
  },
  onThisPage: { en: "On this page", ur: "اس صفحے پر" },
  back: { en: "Back to home", ur: "ہوم پر واپس" },
  langLabel: { en: "Language", ur: "زبان" },
  footer: {
    en: "Written with care for the SLC early-access community — WeWise Labs.",
    ur: "SLC کی ابتدائی کمیونٹی کے لیے محبت سے لکھا گیا — WeWise Labs۔",
  },
};

export const SECTIONS: DocSection[] = [
  {
    id: "intro",
    num: "00",
    title: { en: "Welcome", ur: "خوش آمدید" },
    blocks: [
      {
        t: "p",
        en: "SLC — the Spec Language for Cognition — is a tiny language and a simple way of working that keeps AI on track. You write your project down once as a set of spec files. Every new AI session reads them first, so the model always knows your architecture, your rules, and your past decisions — no re-explaining, no drift.",
        ur: "SLC — یعنی Spec Language for Cognition — ایک چھوٹی سی زبان اور کام کرنے کا آسان طریقہ ہے جو AI کو راہ پر رکھتا ہے۔ آپ اپنے پروجیکٹ کو ایک بار spec فائلوں کی صورت میں لکھ لیتے ہیں۔ ہر نیا AI سیشن سب سے پہلے انہی فائلوں کو پڑھتا ہے، تاکہ ماڈل کو آپ کا آرکیٹیکچر، آپ کے اصول اور آپ کے پچھلے فیصلے ہمیشہ معلوم رہیں — نہ بار بار سمجھانا پڑے، نہ کوئی بھٹکاؤ ہو۔",
      },
      {
        t: "callout",
        tone: "tip",
        en: "The fastest path is the Groundwork terminal (section 01): npx @wewise/slc — it carries the SLC rulebook inside and does the whole flow for you. The manual file-based path still works and is documented from section 05 onward.",
        ur: "تیز ترین راستہ Groundwork ٹرمینل ہے (سیکشن 01): npx @wewise/slc — SLC کا rulebook اس کے اندر موجود ہے اور یہ پورا عمل خود کرتا ہے۔ دستی فائل والا طریقہ بھی چلتا ہے اور سیکشن 05 سے آگے موجود ہے۔",
      },
      {
        t: "p",
        en: "This guide walks you through the whole flow: setting up, writing your requirements, generating the specs, executing tasks, and keeping everything in sync as your project grows. Take it one section at a time.",
        ur: "یہ رہنما آپ کو پورے عمل سے گزارتا ہے: سیٹ اپ، اپنی ضروریات لکھنا، specs بنانا، tasks مکمل کرنا، اور پروجیکٹ بڑھنے کے ساتھ ہر چیز کو ہم آہنگ رکھنا۔ ایک وقت میں ایک حصہ پڑھیں، جلدی کی ضرورت نہیں۔",
      },
    ],
  },
  {
    id: "terminal",
    num: "01",
    title: { en: "The terminal · Groundwork", ur: "ٹرمینل · Groundwork" },
    blocks: [
      {
        t: "p",
        en: "The fastest way to use SLC is the Groundwork terminal. One command turns your requirement.md into a complete, validated spec tree, using your own AI. It writes specs, never application code.",
        ur: "SLC استعمال کرنے کا تیز ترین طریقہ Groundwork ٹرمینل ہے۔ ایک کمانڈ آپ کی requirement.md کو ایک مکمل، تصدیق شدہ spec tree میں بدل دیتی ہے — آپ کے اپنے AI کے ذریعے۔ یہ کوڈ نہیں، صرف specs لکھتا ہے۔",
      },
      { t: "h3", en: "Install and run", ur: "انسٹال اور چلائیں" },
      {
        t: "code",
        lang: "bash",
        code: `npx @wewise/slc        # npm
pnpm dlx @wewise/slc   # pnpm
bunx @wewise/slc       # bun`,
      },
      {
        t: "callout",
        tone: "tip",
        en: "No global install needed. It runs the same way under npm, pnpm, or bun.",
        ur: "کوئی گلوبل انسٹال نہیں چاہیے۔ یہ npx، pnpm یا bun — کسی بھی پیکج مینیجر سے ایک جیسا چلتا ہے۔",
      },
      { t: "h3", en: "Two ways to connect your AI", ur: "اپنے AI کو جوڑنے کے دو طریقے" },
      {
        t: "ul",
        en: [
          "Bridge mode (recommended): use your Claude Code, Copilot, or chat subscription. No API key needed — SLC writes the prompt to a file, you run it in your agent, and drop the result back.",
          "API key: Anthropic, or any OpenAI-compatible endpoint (OpenAI, Google, OpenRouter, Ollama).",
        ],
        ur: [
          "Bridge mode (تجویز کردہ): اپنا Claude Code، Copilot یا chat سبسکرپشن استعمال کریں۔ کوئی API key نہیں چاہیے — SLC پرامپٹ ایک فائل میں لکھ دیتا ہے، آپ اسے اپنے ایجنٹ میں چلاتے ہیں، اور نتیجہ واپس دے دیتے ہیں۔",
          "API key: Anthropic، یا کوئی بھی OpenAI-compatible endpoint (OpenAI، Google، OpenRouter، Ollama)۔",
        ],
      },
      { t: "h3", en: "The flow", ur: "مکمل عمل" },
      {
        t: "ol",
        en: [
          "Pick your AI (bridge or API key).",
          "SLC reads your requirement.md and asks only about the gaps it cannot resolve.",
          "Backend specs are generated first, then it stops at a review gate.",
          "After you confirm, the frontend specs are generated, with their CONTRACT derived from the backend.",
          "slc doctor validates the whole tree.",
          "When it's done, SLC prints the exact line to paste into your coding agent to start building — with the real first task filled in.",
        ],
        ur: [
          "اپنا AI چنیں (bridge یا API key)۔",
          "SLC آپ کی requirement.md پڑھتا ہے اور صرف ان نکات کے بارے میں پوچھتا ہے جو واضح نہیں۔",
          "پہلے backend specs بنتی ہیں، پھر review gate پر رک جاتا ہے۔",
          "تصدیق کے بعد frontend specs بنتی ہیں، جن کا CONTRACT backend سے اخذ ہوتا ہے۔",
          "slc doctor پورے tree کی تصدیق کرتا ہے۔",
          "مکمل ہونے پر SLC وہ درست لائن دکھاتا ہے جو آپ اپنے coding agent میں پیسٹ کر کے کام شروع کرتے ہیں — پہلا task خودبخود بھرا ہوا۔",
        ],
      },
      {
        t: "callout",
        tone: "info",
        en: "Remember: SLC writes specs, not application code. Your agent writes the code from those specs.",
        ur: "یاد رکھیں: SLC صرف specs لکھتا ہے، ایپلیکیشن کوڈ نہیں۔ کوڈ آپ کا ایجنٹ ان specs سے لکھتا ہے۔",
      },
      { t: "h3", en: "Commands", ur: "کمانڈز" },
      {
        t: "code",
        lang: "bash",
        code: `slc            # guided spec generation
slc doctor     # validate an existing spec/ tree
slc --help     # all commands`,
      },
      {
        t: "p",
        en: "Validate your specs at any time by running slc doctor — it checks structure, resolves every read_order and depends_on reference, and scans for leaked secrets.",
        ur: "کسی بھی وقت slc doctor چلا کر اپنی specs کی جانچ کریں — یہ ساخت دیکھتا ہے، ہر read_order اور depends_on حوالہ حل کرتا ہے، اور خفیہ معلومات کے اخراج کو پکڑتا ہے۔",
      },
      { t: "h3", en: "Your mission, on a map", ur: "آپ کا مشن، ایک نقشے پر" },
      {
        t: "p",
        en: "The terminal runs on a mission map saved in .slc/. It always knows what's done, where you are, and what's next — across pauses, Ctrl+C, and restarts. Every phase gets a numbered header, and the map re-renders when you resume.",
        ur: "ٹرمینل ایک mission map پر چلتا ہے جو .slc/ میں محفوظ رہتا ہے۔ اسے ہمیشہ معلوم ہوتا ہے کہ کیا مکمل ہوا، آپ کہاں ہیں، اور آگے کیا ہے — رکنے، Ctrl+C اور دوبارہ چلانے کے باوجود۔",
      },
      {
        t: "code",
        lang: "text",
        code: `✦ MISSION — a validated spec tree, then handoff
│
├ ✓ Connect your AI
├ ✓ Read your requirement
├ ✓ Clarify the gaps
├ ▸ Backend specs   ◄ you are here
├ · Checkpoint — project setup
├ · Design taste — capture & demo
├ · Frontend specs (from the backend contract)
└ · Handoff to your coding agent`,
      },
      { t: "h3", en: "Checkpoints — SLC waits for you", ur: "چیک پوائنٹس — SLC آپ کا انتظار کرتا ہے" },
      {
        t: "p",
        en: "After the backend specs are locked, SLC pauses on purpose. It scans your specs for their {PLACEHOLDER} tokens and turns them into your setup checklist: database, secrets, env. Do it at your pace — answer 'all set', 'give me a minute', or 'skip for now' (the handoff will remind you).",
        ur: "backend specs لاک ہونے کے بعد SLC جان بوجھ کر رکتا ہے۔ یہ آپ کی specs میں موجود {PLACEHOLDER} tokens سے آپ کی سیٹ اپ فہرست بناتا ہے: ڈیٹابیس، secrets، env۔ اپنی رفتار سے کریں — 'سب ہو گیا'، 'ذرا رکیں'، یا 'ابھی چھوڑ دیں' میں سے جواب دیں۔",
      },
      { t: "h3", en: "The design demo (your taste, locked)", ur: "ڈیزائن ڈیمو (آپ کا ذوق، محفوظ)" },
      {
        t: "ol",
        en: [
          "A quick taste interview: vibe, light/dark, corners, spacing, primary color, type feel.",
          "SLC renders ONE demo page of YOUR app's actual screens from your requirement — in your stack's styling idiom, with fake data.",
          "It opens in your browser. Lock it, tweak it, or redo the questions until it feels right.",
          "The approved design is frozen into the frontend specs — every UI task must follow it.",
        ],
        ur: [
          "ایک مختصر ذوق انٹرویو: انداز، light/dark، کونے، فاصلہ، بنیادی رنگ، فونٹ کا مزاج۔",
          "SLC آپ کی requirement کی اصل اسکرینوں کا ایک ڈیمو صفحہ بناتا ہے — آپ کے اپنے stack کے انداز میں، فرضی ڈیٹا کے ساتھ۔",
          "یہ براؤزر میں کھلتا ہے۔ پسند آئے تو lock کریں، ورنہ tweak یا دوبارہ سوالات۔",
          "منظور شدہ ڈیزائن frontend specs میں منجمد ہو جاتا ہے — ہر UI task اسی پر چلتا ہے۔",
        ],
      },
      {
        t: "callout",
        tone: "info",
        en: "The demo is a visual spec artifact — a preview, never production code. Your agent still writes all the code from the specs.",
        ur: "ڈیمو صرف ایک بصری نمونہ ہے — production کوڈ نہیں۔ سارا کوڈ آپ کا agent specs سے لکھتا ہے۔",
      },
      { t: "h3", en: "Pause any time", ur: "جب چاہیں رکیں" },
      {
        t: "p",
        en: "At the review gate you can answer 'I need more time'. Everything is saved; the next run reopens the map exactly where you left it. Ctrl+C is safe too.",
        ur: "review gate پر آپ 'مجھے مزید وقت چاہیے' کہہ سکتے ہیں۔ سب کچھ محفوظ رہتا ہے؛ اگلی بار نقشہ وہیں سے کھلتا ہے۔ Ctrl+C بھی محفوظ ہے۔",
      },
    ],
  },
  {
    id: "commands",
    num: "02",
    title: { en: "Commands", ur: "کمانڈز" },
    blocks: [
      {
        t: "p",
        en: "Everything the terminal can do, in one place. All of these run with npx @wewise/slc, pnpm dlx, or bunx.",
        ur: "ٹرمینل کی تمام کمانڈز ایک جگہ۔ یہ سب npx @wewise/slc، pnpm dlx یا bunx سے چلتی ہیں۔",
      },
      {
        t: "code",
        lang: "bash",
        code: `slc                  # the guided spec generator (interactive)
slc doctor           # validate spec/ — structure, references, secrets
slc doctor --json    # same, machine-readable (CI-friendly, exit 1 on errors)
slc bridge           # write AGENTS.md + CLAUDE.md so agents auto-load SPEC.md
slc --version        # version
slc --help           # help`,
      },
      {
        t: "ul",
        en: [
          "Your AI config, mission map, and run files live in .slc/ (auto-gitignored).",
          "SLC_ASCII=1 switches the art to plain ASCII for older terminals.",
          "slc needs a real terminal; doctor --json and bridge also work in CI.",
        ],
        ur: [
          "آپ کی AI config، mission map اور run فائلیں .slc/ میں رہتی ہیں (خودکار gitignore)۔",
          "پرانے ٹرمینلز کے لیے SLC_ASCII=1 سادہ ASCII آرٹ دکھاتا ہے۔",
          "slc کو اصل ٹرمینل چاہیے؛ doctor --json اور bridge CI میں بھی چلتے ہیں۔",
        ],
      },
    ],
  },
  {
    id: "dodont",
    num: "03",
    title: { en: "Do & don't", ur: "کریں اور نہ کریں" },
    blocks: [
      { t: "h3", en: "Do", ur: "کریں" },
      {
        t: "ul",
        en: [
          "Write requirement.md like you'd brief a junior dev — explicit features, stack, non-goals.",
          "Use bridge mode if you already pay for Claude Code / Copilot — no API key needed.",
          "Take the review gate seriously: the backend contract is frozen after you confirm.",
          "Run slc doctor in CI so broken specs never merge.",
          "Update requirement.md first when scope changes, then regenerate.",
        ],
        ur: [
          "requirement.md ایسے لکھیں جیسے junior developer کو سمجھا رہے ہوں — واضح فیچرز، stack، non-goals۔",
          "اگر Claude Code / Copilot کی سبسکرپشن ہے تو bridge mode استعمال کریں — API key کی ضرورت نہیں۔",
          "review gate کو سنجیدہ لیں: تصدیق کے بعد backend contract منجمد ہو جاتا ہے۔",
          "CI میں slc doctor چلائیں تاکہ خراب specs کبھی merge نہ ہوں۔",
          "دائرہ بدلے تو پہلے requirement.md بدلیں، پھر دوبارہ generate کریں۔",
        ],
      },
      { t: "h3", en: "Don't", ur: "نہ کریں" },
      {
        t: "ul",
        en: [
          "Don't put real secrets, emails, or keys in requirement.md or any spec — SLC scans and will stop you.",
          "Don't hand-edit task status inside task files — task_index.md is the only status ledger.",
          "Don't let your agent invent endpoints — the frontend derives from the backend CONTRACT.",
          "Don't switch models mid-project; interpretations drift.",
          "Don't batch many tasks in one agent prompt — one task, one loop.",
        ],
        ur: [
          "requirement.md یا کسی spec میں اصلی secrets، ای میلز یا keys نہ رکھیں — SLC اسکین کر کے روک دے گا۔",
          "task فائلوں میں status ہاتھ سے نہ بدلیں — status صرف task_index.md میں ہوتا ہے۔",
          "agent کو endpoints ایجاد نہ کرنے دیں — frontend ہمیشہ backend CONTRACT سے نکلتا ہے۔",
          "project کے دوران ماڈل نہ بدلیں؛ تشریحات بہک جاتی ہیں۔",
          "ایک prompt میں بہت سے tasks نہ دیں — ایک task، ایک چکر۔",
        ],
      },
    ],
  },
  {
    id: "troubleshoot",
    num: "04",
    title: { en: "Troubleshooting", ur: "مسائل کا حل" },
    blocks: [
      {
        t: "ul",
        en: [
          "\"The output looks truncated\" — the model hit its output limit. Use a larger-output model, or bridge mode with your agent.",
          "\"Could not read backend.output.json\" — make sure your agent saved the JSON to .slc/run/ exactly at the printed path.",
          "doctor: UNRESOLVED_REFERENCE — a read_order/depends_on path points at nothing. Fix it to a real path like backend_specs/ARCH.md#block.",
          "doctor: SENSITIVE_DATA_LEAK — a real email/key/IP is in a spec. Replace it with a {PLACEHOLDER} and put the value in .slc_secrets.",
          "\"Key check failed\" — check the base URL and key; OpenRouter/Ollama need their own base URLs.",
          "\"Rate limited (429)\" — wait a moment; SLC retries with backoff automatically.",
          "The demo didn't open — open .slc/preview/demo.html in your browser manually.",
          "Weird symbols in the terminal — run with SLC_ASCII=1.",
        ],
        ur: [
          "\"Output truncated\" — ماڈل کی output حد آ گئی۔ بڑی output والا ماڈل لیں یا bridge mode استعمال کریں۔",
          "\"backend.output.json نہیں ملی\" — یقینی بنائیں کہ agent نے JSON بالکل بتائے گئے راستے .slc/run/ میں محفوظ کی ہے۔",
          "doctor: UNRESOLVED_REFERENCE — کوئی read_order/depends_on راستہ غلط ہے۔ اسے اصل راستہ بنائیں جیسے backend_specs/ARCH.md#block۔",
          "doctor: SENSITIVE_DATA_LEAK — کسی spec میں اصلی ای میل/key/IP ہے۔ {PLACEHOLDER} رکھیں اور اصل قیمت .slc_secrets میں۔",
          "\"Key check failed\" — base URL اور key دیکھیں؛ OpenRouter/Ollama کے اپنے base URLs ہوتے ہیں۔",
          "\"Rate limited (429)\" — تھوڑا انتظار کریں؛ SLC خود دوبارہ کوشش کرتا ہے۔",
          "ڈیمو نہ کھلے تو .slc/preview/demo.html خود براؤزر میں کھول لیں۔",
          "ٹرمینل میں عجیب نشان نظر آئیں تو SLC_ASCII=1 کے ساتھ چلائیں۔",
        ],
      },
    ],
  },
  {
    id: "prerequisites",
    num: "05",
    title: { en: "Manual path · before you start", ur: "دستی طریقہ · شروع کرنے سے پہلے" },
    blocks: [
      {
        t: "callout",
        tone: "info",
        en: "Using the terminal? It bundles the two SLC files for you, so you can skip step 3 below. Context7 and a consistent model still matter for the build phase.",
        ur: "ٹرمینل استعمال کر رہے ہیں؟ دونوں SLC فائلیں اس کے اندر شامل ہیں، اس لیے نیچے مرحلہ ۳ چھوڑ سکتے ہیں۔ Context7 اور ایک ہی ماڈل کا اصول build کے مرحلے میں پھر بھی اہم ہے۔",
      },
      {
        t: "p",
        en: "Set up these three things first. SLC will not work properly without them.",
        ur: "سب سے پہلے یہ تین چیزیں تیار کر لیں۔ ان کے بغیر SLC ٹھیک سے کام نہیں کرے گا۔",
      },
      { t: "h3", en: "1. Context7 MCP (or web search)", ur: "۱۔ Context7 MCP (یا ویب سرچ)" },
      {
        t: "p",
        en: "SLC has a built-in rule that fetches the latest documentation for every library in your stack (FastAPI, Next.js, SQLModel, and so on). Without it, the model will guess outdated APIs. Add Context7 to your editor's MCP config:",
        ur: "SLC میں ایک اصول شامل ہے جو آپ کے stack کی ہر library (FastAPI، Next.js، SQLModel وغیرہ) کی تازہ ترین دستاویزات لاتا ہے۔ اس کے بغیر ماڈل پرانے APIs کا اندازہ لگاتا ہے۔ اپنے ایڈیٹر کی MCP config میں Context7 شامل کریں:",
      },
      {
        t: "code",
        lang: "json",
        code: `{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}`,
      },
      {
        t: "callout",
        tone: "info",
        en: "No MCP? You can fall back to your IDE's native web-search tool on each prompt — it works, it's just more tiring.",
        ur: "MCP دستیاب نہیں؟ آپ ہر prompt پر اپنے IDE کے ویب سرچ ٹول سے کام چلا سکتے ہیں — یہ چلتا تو ہے، بس تھوڑا تھکا دینے والا ہے۔",
      },
      { t: "h3", en: "2. One consistent LLM", ur: "۲۔ ایک ہی LLM مستقل طور پر" },
      {
        t: "p",
        en: "Use the same model for the whole project. Switching mid-way causes conflicting interpretations and drift from your architecture. Good choices, best first:",
        ur: "پورے پروجیکٹ کے لیے ایک ہی ماڈل استعمال کریں۔ درمیان میں ماڈل بدلنے سے متضاد تشریحات اور آرکیٹیکچر سے بھٹکاؤ پیدا ہوتا ہے۔ بہترین انتخاب، ترتیب کے ساتھ:",
      },
      {
        t: "ul",
        en: [
          "Claude Opus 4.8 / Sonnet 4.6 — best for spec generation and long-context reasoning",
          "GPT-5 — strong for task execution",
          "Gemini 3 Pro — a solid alternative; Fable 5 for fast iteration",
        ],
        ur: [
          "Claude Opus 4.8 / Sonnet 4.6 — specs بنانے اور لمبے context کے لیے بہترین",
          "GPT-5 — tasks مکمل کرنے کے لیے مضبوط",
          "Gemini 3 Pro — ایک اچھا متبادل؛ تیز کام کے لیے Fable 5",
        ],
      },
      {
        t: "callout",
        tone: "warn",
        en: "Avoid models smaller than ~70B for spec generation — they miss nuance and hallucinate constraints.",
        ur: "spec بنانے کے لیے تقریباً ۷۰B سے چھوٹے ماڈلز سے گریز کریں — یہ باریکیاں چھوڑ دیتے ہیں اور غلط پابندیاں گھڑ لیتے ہیں۔",
      },
      { t: "h3", en: "3. The two SLC files", ur: "۳۔ دو SLC فائلیں" },
      {
        t: "ul",
        en: [
          "SLC.md — the full language spec: rules, syntax, block types, and enforcement logic.",
          "slc_universal_structure.md — the folder/file structure every SLC project follows.",
        ],
        ur: [
          "SLC.md — مکمل زبان کی تفصیل: اصول، syntax، block کی اقسام، اور نفاذ کی منطق۔",
          "slc_universal_structure.md — وہ folder/file ساخت جو ہر SLC پروجیکٹ اپناتا ہے۔",
        ],
      },
      {
        t: "p",
        en: "Place both at the root of your project. They are the model's rulebook — referenced constantly.",
        ur: "دونوں کو اپنے پروجیکٹ کے root میں رکھیں۔ یہی ماڈل کی اصول کی کتاب ہیں — جن کا بار بار حوالہ دیا جاتا ہے۔",
      },
    ],
  },
  {
    id: "requirements",
    num: "06",
    title: { en: "Write your requirements", ur: "اپنی ضروریات لکھیں" },
    blocks: [
      {
        t: "p",
        en: "Before you touch the LLM, write a requirements document — the single source of truth it uses to generate your whole spec. Name it requirement.md and keep it at the project root. The more detail you give, the fewer guesses the model has to make.",
        ur: "LLM کو ہاتھ لگانے سے پہلے ایک requirements document لکھیں — یہی وہ بنیادی سچ ہے جس سے ماڈل آپ کا پورا spec بناتا ہے۔ اس کا نام requirement.md رکھیں اور پروجیکٹ کے root میں رکھیں۔ جتنی زیادہ تفصیل دیں گے، ماڈل کو اتنے کم اندازے لگانے پڑیں گے۔",
      },
      {
        t: "code",
        lang: "markdown",
        code: `## Goal
What the app does in 2-3 sentences.

## User Journeys
Step-by-step flows for every type of user.

## Features
Every feature listed explicitly.

## Tech Stack
- Frontend, Backend, Database, third-party services.

## Design
Colors (hex), font, design style.

## Non-Goals
What the app will NOT do.

## Constraints
Hard limits that must never be violated.`,
      },
      {
        t: "callout",
        tone: "tip",
        en: "Rule of thumb: if you wouldn't trust a junior developer to guess it, write it down. Vague requirements produce hallucinated specs.",
        ur: "ایک سادہ اصول: جو بات آپ کسی نئے ڈیولپر کے اندازے پر نہ چھوڑیں، اسے لکھ دیں۔ مبہم ضروریات سے ماڈل خود ساختہ specs بنا دیتا ہے۔",
      },
      { t: "h3", en: "Bad vs good", ur: "کمزور بمقابلہ بہتر" },
      {
        t: "ul",
        en: [
          "Weak: “Users can log in.”",
          "Strong: “Users log in with email + password. A JWT is issued on success, stored in an httpOnly cookie named app_token, expiring in 24 hours.”",
        ],
        ur: [
          "کمزور: ”صارفین لاگ اِن کر سکتے ہیں۔“",
          "بہتر: ”صارفین ای میل اور پاس ورڈ سے لاگ اِن کرتے ہیں۔ کامیابی پر JWT جاری ہوتا ہے، جو app_token نامی httpOnly کوکی میں محفوظ ہوتا ہے اور ۲۴ گھنٹے میں ختم ہو جاتا ہے۔“",
        ],
      },
    ],
  },
  {
    id: "generate",
    num: "07",
    title: { en: "Generate the specs", ur: "specs بنائیں" },
    blocks: [
      {
        t: "callout",
        tone: "tip",
        en: "The fastest path is the terminal (section 01): run npx @wewise/slc and it does all of this for you — reads your requirement, asks about the gaps, generates the spec tree, and validates it. The manual prompts below are the fallback if you'd rather paste files into a chat yourself.",
        ur: "سب سے تیز طریقہ ٹرمینل ہے (سیکشن 01): npx @wewise/slc چلائیں اور یہ سب کچھ خود کر دیتا ہے — آپ کی requirement پڑھتا ہے، کمی کے سوال پوچھتا ہے، spec tree بناتا ہے، اور تصدیق کرتا ہے۔ نیچے دیے گئے دستی prompts صرف اُس صورت کے لیے ہیں جب آپ خود chat میں فائلیں پیسٹ کرنا چاہیں۔",
      },
      {
        t: "p",
        en: "Open the LLM in a fresh conversation and give it three files to read carefully: SLC.md, slc_universal_structure.md, and your requirement.md. Then ask it to generate the full spec — no code yet.",
        ur: "LLM کو ایک نئی گفتگو میں کھولیں اور اسے تین فائلیں غور سے پڑھنے کے لیے دیں: SLC.md، slc_universal_structure.md، اور آپ کی requirement.md۔ پھر اس سے پورا spec بنوائیں — ابھی کوئی کوڈ نہیں۔",
      },
      {
        t: "code",
        lang: "text",
        code: `I am giving you three files to read carefully. Do not miss a single point.

1. SLC.md — the SLC language & framework spec. Follow every rule exactly.
2. slc_universal_structure.md — the universal folder/file structure. Conform to it.
3. requirement.md — the full requirements for the app I want to build.

After reading all three, generate the full spec following SLC rules:
SPEC.md, CONTEXT.md, CONSTRAINTS.md, SECURITY.md, MEMORY.md,
backend_specs/ (ARCH, CONTRACT, PLAN, tasks/),
frontend_specs/ (ARCH, CONTRACT, PLAN, tasks/).

Do not generate code. Do not assume — if something is missing, ask first.

[PASTE requirement.md]
[PASTE SLC.md]
[PASTE slc_universal_structure.md]`,
      },
      {
        t: "callout",
        tone: "info",
        en: "Paste file contents inline. Many chat interfaces silently truncate attachments.",
        ur: "فائلوں کا مواد براہِ راست (inline) پیسٹ کریں۔ بہت سے chat انٹرفیس attachments کو خاموشی سے کاٹ دیتے ہیں۔",
      },
      { t: "h3", en: "What good output looks like", ur: "اچھا نتیجہ کیسا ہوتا ہے" },
      {
        t: "ul",
        en: [
          "Every file uses @block / @end SLC syntax.",
          "MEMORY.md has numbered decisions (D1, D2…) with rationale and dates.",
          "CONTRACT.md lists every endpoint with an ID, full request schema, and all response codes.",
          "Task files include acceptance_criteria and blocked_by fields.",
        ],
        ur: [
          "ہر فائل @block / @end SLC syntax استعمال کرتی ہے۔",
          "MEMORY.md میں نمبر شدہ فیصلے (D1، D2…) وجہ اور تاریخ کے ساتھ ہوتے ہیں۔",
          "CONTRACT.md ہر endpoint کو ID، مکمل request schema اور تمام response codes کے ساتھ درج کرتی ہے۔",
          "Task فائلوں میں acceptance_criteria اور blocked_by شامل ہوتے ہیں۔",
        ],
      },
    ],
  },
  {
    id: "execute",
    num: "08",
    title: { en: "Execute tasks", ur: "tasks مکمل کریں" },
    blocks: [
      {
        t: "p",
        en: "Once the specs are saved, every new conversation starts the same way — by reading SPEC.md first, then executing one task at a time.",
        ur: "جب specs محفوظ ہو جائیں، تو ہر نئی گفتگو ایک ہی طرح شروع ہوتی ہے — پہلے SPEC.md پڑھیں، پھر ایک وقت میں ایک task مکمل کریں۔",
      },
      {
        t: "code",
        lang: "text",
        code: `Read SPEC.md first. It is the entry point for this project.
Follow the read_order in SPEC.md exactly — do not skip any file.
Use Context7 to fetch the latest docs for every service in must_read_latest.
After reading all spec files, execute task [TASK_ID] from the task index.`,
      },
      {
        t: "p",
        en: "Why always start with SPEC.md? It is the global router — its read_order is the strict sequence of files the model must read before touching any code. Skip it and the model starts blind to your constraints, security rules, and decisions.",
        ur: "ہمیشہ SPEC.md سے کیوں شروع کریں؟ یہی عالمی router ہے — اس کا read_order ان فائلوں کی سخت ترتیب ہے جنہیں ماڈل کوڈ کو ہاتھ لگانے سے پہلے پڑھتا ہے۔ اسے چھوڑ دیں تو ماڈل آپ کی پابندیوں، سیکیورٹی اصولوں اور فیصلوں سے بے خبر شروع ہو جاتا ہے۔",
      },
      {
        t: "callout",
        tone: "warn",
        en: "Execute one task per conversation. Batching tasks makes the model lose track of acceptance criteria.",
        ur: "ایک گفتگو میں ایک ہی task کریں۔ کئی tasks ایک ساتھ دینے سے ماڈل acceptance criteria کا دھیان کھو دیتا ہے۔",
      },
    ],
  },
  {
    id: "sync",
    num: "09",
    title: { en: "Keep specs in sync", ur: "specs کو ہم آہنگ رکھیں" },
    blocks: [
      {
        t: "p",
        en: "The model won't update your spec files on its own — you have to ask. Don't let spec drift accumulate: if MEMORY.md falls out of sync with reality, future sessions make decisions on stale facts, and the errors compound.",
        ur: "ماڈل آپ کی spec فائلیں خود نہیں بدلے گا — آپ کو کہنا پڑے گا۔ spec کے بھٹکاؤ کو جمع نہ ہونے دیں: اگر MEMORY.md حقیقت سے ہٹ جائے، تو آئندہ سیشن پرانی معلومات پر فیصلے کرتے ہیں اور غلطیاں بڑھتی چلی جاتی ہیں۔",
      },
      {
        t: "ul",
        en: [
          "New technical decision → add a D{n} entry in MEMORY.md.",
          "An endpoint changed → update both CONTRACT.md files.",
          "New table / component → update the relevant ARCH.md.",
          "Security tightened → update SECURITY.md.",
        ],
        ur: [
          "نیا تکنیکی فیصلہ → MEMORY.md میں ایک D{n} اندراج شامل کریں۔",
          "کوئی endpoint بدلا → دونوں CONTRACT.md فائلیں اپ ڈیٹ کریں۔",
          "نئی table / component → متعلقہ ARCH.md اپ ڈیٹ کریں۔",
          "سیکیورٹی سخت ہوئی → SECURITY.md اپ ڈیٹ کریں۔",
        ],
      },
      {
        t: "code",
        lang: "text",
        code: `The following change was made during task execution:
[describe what changed]

Update these spec files to reflect it accurately:
- [list the files]

Follow SLC rules. Do not change anything unrelated to this update.`,
      },
    ],
  },
  {
    id: "scope",
    num: "10",
    title: { en: "Extending scope", ur: "دائرہ کار بڑھانا" },
    blocks: [
      {
        t: "p",
        en: "Want to add features after the initial tasks are done? Never ask for them informally — that bypasses SLC's scope control. Follow this exact process instead:",
        ur: "ابتدائی tasks مکمل ہونے کے بعد نئے features شامل کرنا چاہتے ہیں؟ انہیں کبھی غیر رسمی طور پر نہ مانگیں — اس سے SLC کا scope کنٹرول نظرانداز ہو جاتا ہے۔ اس کے بجائے یہ طریقہ اپنائیں:",
      },
      {
        t: "ol",
        en: [
          "Update requirement.md — add the new feature with the same detail as the originals.",
          "Tell the model to read the updated requirement.md and the current SPEC.md read_order.",
          "Have it extend CONTEXT, CONSTRAINTS, ARCH, CONTRACT, and create new task files — without touching completed tasks.",
        ],
        ur: [
          "requirement.md اپ ڈیٹ کریں — نیا feature اُسی تفصیل کے ساتھ شامل کریں جیسے اصل ضروریات تھیں۔",
          "ماڈل سے کہیں کہ تازہ requirement.md اور موجودہ SPEC.md کا read_order پڑھے۔",
          "اس سے CONTEXT، CONSTRAINTS، ARCH، CONTRACT بڑھوائیں اور نئی task فائلیں بنوائیں — مکمل شدہ tasks کو چھیڑے بغیر۔",
        ],
      },
      {
        t: "callout",
        tone: "warn",
        en: "Never ask for “just one more thing” informally. Undocumented additions break the spec's integrity and cause hallucinations later.",
        ur: "”بس ایک اور چیز“ کبھی غیر رسمی طور پر نہ مانگیں۔ غیر دستاویزی اضافے spec کی سالمیت توڑ دیتے ہیں اور بعد میں hallucinations کا سبب بنتے ہیں۔",
      },
    ],
  },
  {
    id: "mistakes",
    num: "11",
    title: { en: "Common mistakes", ur: "عام غلطیاں" },
    blocks: [
      {
        t: "ul",
        en: [
          "Skipping Context7 → hallucinated API signatures. Install it before starting.",
          "Thin requirement.md → specs full of guesses. Rewrite in detail, regenerate.",
          "Switching LLM mid-project → conflicting interpretations. Pick one, stick to it.",
          "Not starting with SPEC.md → the model ignores your constraints and security rules.",
          "Not updating MEMORY.md → future sessions make contradictory choices.",
        ],
        ur: [
          "Context7 چھوڑ دینا → غلط API signatures۔ شروع کرنے سے پہلے انسٹال کریں۔",
          "ناقص requirement.md → اندازوں سے بھرے specs۔ تفصیل سے دوبارہ لکھیں اور specs دوبارہ بنوائیں۔",
          "درمیان میں LLM بدلنا → متضاد تشریحات۔ ایک منتخب کریں اور اسی پر رہیں۔",
          "SPEC.md سے شروع نہ کرنا → ماڈل آپ کی پابندیاں اور سیکیورٹی اصول نظرانداز کر دیتا ہے۔",
          "MEMORY.md اپ ڈیٹ نہ کرنا → آئندہ سیشن متضاد فیصلے کرتے ہیں۔",
        ],
      },
      {
        t: "callout",
        tone: "tip",
        en: "Master these and SLC mostly takes care of itself — structured specs in, structured software out.",
        ur: "ان پر عبور حاصل کر لیں تو SLC زیادہ تر خود سنبھل جاتا ہے — منظم specs اندر، منظم سافٹ ویئر باہر۔",
      },
    ],
  },
];
