// Bilingual (English + Urdu) documentation for SLC, in TWO editions:
//   "cli"    — Groundwork, the SLC terminal (the primary, current way)
//   "manual" — the classic file-based workflow (no harness, no CLI)
// The docs page renders one edition at a time via a toggle.
// Code blocks are shared across languages (commands/prompts are English).
// The CLI edition mirrors GROUNDWORK.md — keep the two in sync on release.

export type Lang = "en" | "ur";
export type Edition = "cli" | "manual";

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
  subtitleCli: {
    en: "Groundwork — the SLC terminal: it scrutinizes your idea, then writes a complete, validated spec tree — using your own AI.",
    ur: "Groundwork — SLC کا ٹرمینل: یہ آپ کے خیال کی جانچ (scrutiny) کرتا ہے، پھر مکمل، تصدیق شدہ spec tree لکھتا ہے — آپ کے اپنے AI کے ذریعے۔",
  },
  subtitleManual: {
    en: "The classic file-based workflow: two SLC files, your requirement, and careful prompts — no CLI, no harness.",
    ur: "کلاسک فائل والا طریقہ: دو SLC فائلیں، آپ کی requirement، اور محتاط prompts — نہ CLI، نہ harness۔",
  },
  editionLabel: { en: "Docs edition", ur: "دستاویزات کی قسم" },
  editionCli: { en: "CLI · Groundwork", ur: "CLI · Groundwork" },
  editionCliHint: { en: "current", ur: "موجودہ" },
  editionManual: { en: "Manual · Classic", ur: "دستی · کلاسک" },
  editionManualHint: { en: "legacy", ur: "پرانا طریقہ" },
  onThisPage: { en: "On this page", ur: "اس صفحے پر" },
  back: { en: "Back to home", ur: "ہوم پر واپس" },
  langLabel: { en: "Language", ur: "زبان" },
  footer: {
    en: "Written with care for the SLC community — WeWise Labs.",
    ur: "SLC کمیونٹی کے لیے محبت سے لکھا گیا — WeWise Labs۔",
  },
};

// ── shared: the requirement.md guide (identical in both editions) ─────────────
const REQUIREMENT_BLOCKS: Block[] = [
  {
    t: "p",
    en: "Everything starts from a requirements document — the single source of truth SLC uses to generate your whole spec. requirement.md at the project root is the convention, but neither the name nor the shape is enforced; what matters is what's inside it. The more detail you give, the fewer guesses the model has to make.",
    ur: "سب کچھ ایک requirements document سے شروع ہوتا ہے — یہی وہ بنیادی سچ ہے جس سے SLC آپ کا پورا spec بناتا ہے۔ پروجیکٹ کے root میں requirement.md رکھنا رواج ہے، مگر نہ نام لازم ہے نہ ڈھانچہ؛ اصل بات یہ ہے کہ اندر کیا لکھا ہے۔ جتنی زیادہ تفصیل، اتنے کم اندازے۔",
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
];

// ══════════════════════════════════════════════════════════════════════════════
// CLI EDITION — Groundwork, the SLC terminal (mirrors GROUNDWORK.md)
// ══════════════════════════════════════════════════════════════════════════════
export const CLI_SECTIONS: DocSection[] = [
  {
    id: "welcome",
    num: "00",
    title: { en: "Welcome", ur: "خوش آمدید" },
    blocks: [
      {
        t: "p",
        en: "SLC — the Spec Language for Cognition — keeps AI on track by writing your project down as a set of spec files that every session reads first. Groundwork is the SLC terminal: it lays the groundwork (your specs) before a single line of code. It reads your requirements, asks only what it genuinely doesn't know, and writes a complete, validated spec tree — using your own AI.",
        ur: "SLC — یعنی Spec Language for Cognition — آپ کے پروجیکٹ کو spec فائلوں کی صورت میں لکھ کر AI کو راہ پر رکھتا ہے، جنہیں ہر سیشن سب سے پہلے پڑھتا ہے۔ Groundwork، SLC کا ٹرمینل ہے: کوڈ کی پہلی لائن سے پہلے یہ بنیاد (آپ کی specs) رکھتا ہے۔ یہ آپ کی requirements پڑھتا ہے، صرف وہی پوچھتا ہے جو اسے واقعی معلوم نہ ہو، اور آپ کے اپنے AI سے مکمل، تصدیق شدہ spec tree لکھتا ہے۔",
      },
      {
        t: "callout",
        tone: "info",
        en: "SLC writes specs, never application code. Then you point any coding agent (Claude Code, Cursor, Copilot…) at those specs and build.",
        ur: "SLC صرف specs لکھتا ہے، ایپلیکیشن کوڈ کبھی نہیں۔ پھر آپ کوئی بھی coding agent (Claude Code، Cursor، Copilot…) ان specs پر لگا کر build کرتے ہیں۔",
      },
      {
        t: "p",
        en: "It's built on Ink (React for terminals), so the mission map, every prompt, and every report — doctor, estimate, db, audit — are real components rather than concatenated strings.",
        ur: "یہ Ink (ٹرمینل کے لیے React) پر بنا ہے، اس لیے mission map، ہر prompt اور ہر report — doctor، estimate، db، audit — اصلی components ہیں، جوڑی ہوئی سطریں نہیں۔",
      },
      {
        t: "p",
        en: "Prefer to work by hand, with no CLI at all? Switch to the Manual · Classic edition using the toggle above — it documents the original file-based workflow.",
        ur: "بغیر CLI کے، ہاتھ سے کام کرنا پسند کرتے ہیں؟ اوپر موجود ٹوگل سے Manual · Classic ایڈیشن پر جائیں — وہاں اصل فائل والا طریقہ درج ہے۔",
      },
    ],
  },
  {
    id: "install",
    num: "01",
    title: { en: "Install & first run", ur: "انسٹال اور پہلی بار چلانا" },
    blocks: [
      {
        t: "p",
        en: "No install needed — run it straight from your package manager, inside the folder that has (or will have) your requirement. It doesn't have to be named requirement.md; SLC finds it either way (see 03). Pick the one you use:",
        ur: "انسٹال کی ضرورت نہیں — اپنے package manager سے براہِ راست چلائیں، اسی فولڈر میں جہاں آپ کی requirement ہے (یا ہوگی)۔ اس کا نام requirement.md ہونا ضروری نہیں؛ SLC اسے ہر صورت ڈھونڈ لیتا ہے (دیکھیں 03)۔ جو استعمال کرتے ہیں وہ چنیں:",
      },
      { t: "code", lang: "npm", code: "npx @wewiselabs/slc" },
      { t: "code", lang: "pnpm", code: "pnpm dlx @wewiselabs/slc" },
      { t: "code", lang: "bun", code: "bunx @wewiselabs/slc" },
      {
        t: "p",
        en: "Prefer the bare slc command? Install it globally once — then slc, slc doctor, and slc --help work anywhere:",
        ur: "سیدھی slc کمانڈ پسند ہے؟ ایک بار global انسٹال کر لیں — پھر slc، slc doctor اور slc --help ہر جگہ چلتے ہیں:",
      },
      { t: "code", lang: "bash", code: "npm install -g @wewiselabs/slc" },
      {
        t: "callout",
        tone: "warn",
        en: "With npx, always use the full scoped name. npx slc (unscoped) is a different, unrelated package on npm.",
        ur: "npx کے ساتھ ہمیشہ پورا scoped نام لکھیں۔ npx slc (بغیر scope کے) npm پر ایک الگ، غیر متعلق پیکج ہے۔",
      },
      {
        t: "callout",
        tone: "warn",
        en: "Requires Node 22 or newer — that's what the Ink terminal UI needs. If the install fails or the prompts behave oddly, check node --version first (Node 18 is past its own end-of-life anyway).",
        ur: "Node 22 یا اس سے نیا درکار ہے — Ink والے ٹرمینل UI کی یہی شرط ہے۔ انسٹال ناکام ہو یا prompts عجیب چلیں تو پہلے node --version دیکھیں (ویسے بھی Node 18 اپنی مدت پوری کر چکا ہے)۔",
      },
      {
        t: "callout",
        tone: "tip",
        en: "Everything SLC saves for itself (AI config, mission map, run files, backups) lives in .slc/ — created automatically and auto-gitignored.",
        ur: "SLC اپنی ہر چیز (AI config، mission map، run فائلیں، backups) .slc/ میں رکھتا ہے — جو خودبخود بنتا ہے اور .gitignore میں شامل ہو جاتا ہے۔",
      },
    ],
  },
  {
    id: "connect",
    num: "02",
    title: { en: "Connect your AI", ur: "اپنا AI جوڑیں" },
    blocks: [
      {
        t: "p",
        en: "SLC never ships its own model — you bring the brain, so the specs are 100% yours. There are two ways to connect, and you do NOT need an API key.",
        ur: "SLC اپنا کوئی ماڈل نہیں رکھتا — دماغ آپ لاتے ہیں، اس لیے specs مکمل طور پر آپ کی ہوتی ہیں۔ جوڑنے کے دو طریقے ہیں، اور API key ضروری نہیں۔",
      },
      { t: "h3", en: "Bridge mode — recommended", ur: "Bridge mode — تجویز کردہ" },
      {
        t: "p",
        en: "Already paying for Claude Code, Copilot, or a chat plan that bundles many models? Bridge mode uses exactly that — no separate API key. SLC writes the full generation prompt to a file; you tell your agent to follow it and save the JSON result; SLC reads it back, writes the spec files, and validates them. Your subscription does the thinking; SLC does the structure.",
        ur: "پہلے ہی Claude Code، Copilot یا کسی chat plan کے صارف ہیں؟ Bridge mode بالکل وہی استعمال کرتا ہے — الگ API key کی ضرورت نہیں۔ SLC مکمل prompt ایک فائل میں لکھتا ہے؛ آپ اپنے agent سے کہتے ہیں کہ اس پر عمل کرے اور JSON نتیجہ محفوظ کرے؛ SLC اسے پڑھ کر spec فائلیں لکھتا اور تصدیق کرتا ہے۔ سوچنے کا کام آپ کی سبسکرپشن کرتی ہے؛ ساخت اور جانچ SLC۔",
      },
      {
        t: "code",
        lang: "text",
        code: `"Follow .slc/run/backend.prompt.md and save the JSON to .slc/run/backend.output.json"`,
      },
      {
        t: "callout",
        tone: "info",
        en: "The SLC rulebook is staged once under .slc/rulebook/ and referenced from each prompt, so prompt files stay a few KB. Output files are decoded in any encoding — UTF-8, UTF-16, BOM all fine.",
        ur: "SLC کی rulebook ایک بار .slc/rulebook/ میں رکھی جاتی ہے اور ہر prompt اس کا حوالہ دیتا ہے، اس لیے prompt فائلیں چند KB ہی رہتی ہیں۔ output فائلیں کسی بھی encoding میں پڑھ لی جاتی ہیں — UTF-8، UTF-16، BOM سب ٹھیک ہیں۔",
      },
      { t: "h3", en: "API-key mode", ur: "API key والا طریقہ" },
      {
        t: "p",
        en: "Have a key? Pick Anthropic (Claude, Messages API) or OpenAI-compatible and point it anywhere that speaks /chat/completions. The key is verified with a tiny test call, then saved to .slc/config.json (auto-gitignored). ANTHROPIC_API_KEY / OPENAI_API_KEY in your environment are picked up automatically.",
        ur: "key موجود ہے؟ Anthropic (Claude، Messages API) یا OpenAI-compatible چنیں اور کسی بھی ایسے endpoint سے جوڑیں جو /chat/completions سمجھتا ہو۔ key ایک چھوٹی سی جانچ کے بعد .slc/config.json میں محفوظ ہو جاتی ہے (خودبخود gitignore)۔ ماحول میں موجود ANTHROPIC_API_KEY / OPENAI_API_KEY خودبخود اٹھا لی جاتی ہیں۔",
      },
      {
        t: "ul",
        en: [
          "OpenAI — base URL https://api.openai.com/v1 · e.g. gpt-5",
          "Anthropic — pick the Anthropic shape · e.g. claude-opus-4-8",
          "OpenRouter — base URL https://openrouter.ai/api/v1 · any listed model",
          "Ollama (fully local, free) — base URL http://localhost:11434/v1 · e.g. llama3.3, key: ollama",
        ],
        ur: [
          "OpenAI — base URL یہ ہے: https://api.openai.com/v1 · مثلاً gpt-5",
          "Anthropic — Anthropic والی شکل چنیں · مثلاً claude-opus-4-8",
          "OpenRouter — base URL یہ ہے: https://openrouter.ai/api/v1 · فہرست کا کوئی بھی ماڈل",
          "Ollama (مکمل local، مفت) — base URL یہ ہے: http://localhost:11434/v1 · مثلاً llama3.3، key: ollama",
        ],
      },
      {
        t: "callout",
        tone: "warn",
        en: "Use one consistent model for the whole project. Switching mid-way causes conflicting interpretations. Best picks: Claude Opus 4.8 / Sonnet 4.6 for spec generation; GPT-5 and Gemini 3 Pro are solid alternatives.",
        ur: "پورے پروجیکٹ میں ایک ہی ماڈل رکھیں۔ درمیان میں بدلنے سے تشریحات ٹکراتی ہیں۔ بہترین انتخاب: specs کے لیے Claude Opus 4.8 / Sonnet 4.6؛ GPT-5 اور Gemini 3 Pro اچھے متبادل ہیں۔",
      },
      {
        t: "p",
        en: "Either way, your choice is saved to .slc/config.json so the next run is one tap.",
        ur: "دونوں صورتوں میں آپ کا انتخاب .slc/config.json میں محفوظ ہو جاتا ہے، تاکہ اگلی بار صرف ایک tap لگے۔",
      },
    ],
  },
  {
    id: "requirement",
    num: "03",
    title: { en: "Your requirement", ur: "آپ کی requirement" },
    blocks: [
      ...REQUIREMENT_BLOCKS,
      { t: "h3", en: "How SLC finds it", ur: "SLC اسے کیسے ڈھونڈتا ہے" },
      {
        t: "p",
        en: "Your file doesn't have to be named requirement.md, and it doesn't have to look like the template above. Discovery is layered, and every layer judges content, never format:",
        ur: "آپ کی فائل کا نام requirement.md ہونا ضروری نہیں، اور نہ ہی اس کا اوپر والے سانچے جیسا ہونا۔ تلاش کئی درجوں میں ہوتی ہے، اور ہر درجہ مواد دیکھتا ہے، شکل نہیں:",
      },
      {
        t: "ol",
        en: [
          "Common names first — requirement.md, requirements.md, PRD.md (any case). Instant, silent, zero setup.",
          "Not found? SLC scans the folder — any root-level .md or .txt file — and scores each one on whether it actually covers the essentials (goal, users, stack, auth, data, non-goals, constraints — checked by keyword, not by header text, so any structure counts). One clear winner is used automatically and SLC tells you which and why; a few plausible files get you a quick picker; nothing plausible falls through to describing the idea or scaffolding a template. It never just gives up.",
          "Know exactly which file? Skip discovery entirely with --file.",
        ],
        ur: [
          "پہلے عام نام — requirement.md، requirements.md، PRD.md (کوئی بھی case)۔ فوری، خاموش، بغیر کسی سیٹ اپ کے۔",
          "نہ ملے؟ SLC فولڈر کو دیکھتا ہے — root کی کوئی بھی .md یا .txt فائل — اور ہر ایک کو اس بنیاد پر نمبر دیتا ہے کہ وہ بنیادی باتیں (مقصد، صارفین، stack، auth، ڈیٹا، non-goals، پابندیاں) واقعی بیان کرتی ہے یا نہیں — یہ جانچ الفاظ سے ہوتی ہے، headings سے نہیں، اس لیے ہر ساخت قبول ہے۔ ایک واضح فاتح خودبخود چن لیا جاتا ہے (SLC بتاتا ہے کون سا اور کیوں)؛ کئی ممکنہ فائلیں ہوں تو ایک چھوٹا سا انتخاب سامنے آتا ہے؛ کچھ بھی موزوں نہ ہو تو بات خیال بیان کرنے یا نیا سانچہ بنانے تک جاتی ہے۔ یہ کبھی ہاتھ نہیں کھڑے کرتا۔",
          "معلوم ہے کون سی فائل ہے؟ --file سے تلاش کا مرحلہ ہی چھوڑ دیں۔",
        ],
      },
      { t: "code", lang: "bash", code: "npx @wewiselabs/slc --file docs/product-brief.md" },
      {
        t: "callout",
        tone: "info",
        en: "Once found, the format is never judged. Scrutiny checks whether the content covers the essentials — never whether it's shaped like SLC's own template. A complete brief in your own structure is left exactly as you wrote it.",
        ur: "فائل مل جائے تو اس کی شکل پر کوئی اعتراض نہیں ہوتا۔ Scrutiny صرف یہ دیکھتی ہے کہ مواد میں بنیادی باتیں موجود ہیں یا نہیں — یہ نہیں کہ وہ SLC کے اپنے سانچے جیسی ہے یا نہیں۔ اگر آپ کی brief آپ کی اپنی ساخت میں مکمل ہے تو وہ بالکل ویسی ہی رہتی ہے جیسی آپ نے لکھی۔",
      },
      {
        t: "callout",
        tone: "info",
        en: "No requirement file at all? Type the idea straight into the terminal and scrutiny reviews it and drafts the file for you — or pick “Point me at a file” from the same menu and give it a path to anything, anywhere on disk.",
        ur: "کوئی requirement فائل سرے سے موجود نہیں؟ خیال سیدھا ٹرمینل میں لکھ دیں — scrutiny اس کا جائزہ لے کر فائل خود تیار کر دیتی ہے — یا اسی مینو سے ”Point me at a file“ چن کر ڈسک پر کہیں بھی موجود کسی فائل کا راستہ دے دیں۔",
      },
      {
        t: "callout",
        tone: "warn",
        en: "SLC scans your requirement for secret-looking strings and warns before sending anything to your AI. Keep real keys in .slc_secrets or your environment — never in the requirement.",
        ur: "SLC آپ کی requirement کو secrets جیسی چیزوں کے لیے اسکین کرتا ہے اور آپ کے AI کو کچھ بھی بھیجنے سے پہلے خبردار کرتا ہے۔ اصلی keys ہمیشہ .slc_secrets یا ماحول میں رکھیں — requirement میں کبھی نہیں۔",
      },
    ],
  },
  {
    id: "scrutiny",
    num: "04",
    title: { en: "Scrutiny — the idea gate", ur: "Scrutiny — خیال کی جانچ" },
    blocks: [
      {
        t: "p",
        en: "Most AI tools execute whatever you typed. SLC doesn't. Before a single spec is generated, your own LLM audits the brief like a principal engineer reviewing it: clarity (contradictions, missing essentials), feasibility & compatibility (stack choices that fight each other or your hosting), security footguns, scale & cost, and monetization.",
        ur: "زیادہ تر AI ٹولز جو آپ نے لکھا وہی چلا دیتے ہیں۔ SLC ایسا نہیں کرتا۔ کوئی بھی spec بننے سے پہلے آپ کا اپنا LLM اس brief کا اس طرح جائزہ لیتا ہے جیسے کوئی principal engineer کرے: وضاحت (تضادات، چھوٹی ہوئی بنیادی چیزیں)، قابلِ عمل ہونا اور compatibility (ایسے stack انتخاب جو آپس میں یا آپ کی ہوسٹنگ سے ٹکرائیں)، سیکیورٹی کے خطرے، scale اور لاگت، اور monetization۔",
      },
      {
        t: "p",
        en: "One question sets the lens — the posture: hobby (simplest, cheapest, no enterprise nagging), growth (flag scale traps and cost hotspots), or business (security, costs, and billing flows are first-class).",
        ur: "ایک سوال زاویہ طے کرتا ہے — یعنی posture: hobby (سب سے سادہ اور سستا، enterprise والی جھک جھک نہیں)، growth (scale کے جال اور لاگت کے گرم مقامات نشان زد)، یا business (سیکیورٹی، لاگت اور billing flows اوّل درجے پر)۔",
      },
      {
        t: "code",
        lang: "text",
        code: `┌  Scrutiny report
│  !  Good idea — needs repairs before specs.
│
│  ✗ BLOCK [security]  The admin dashboard has no authentication
│     ↳ Gate every /admin route behind the same login + admin role check
│  !  [compatibility]  SQLite won't survive multi-instance hosting
│     ↳ Use the hosted Postgres your platform offers
│  ·  [cost]  Image uploads on serverless get pricey past ~10k users
└`,
      },
      { t: "h3", en: "What you get back", ur: "آپ کو کیا ملتا ہے" },
      {
        t: "ul",
        en: [
          "A scrutiny report — blockers → warnings → notes, each with a one-line fix. The full report is saved to .slc/scrutiny.json.",
          "Every decision genuinely worth making — there is no cap. A real gap SLC doesn't ask about becomes a silent wrong guess later, which is worse than one more question. Each decision ships a suggested answer you can accept by just pressing Enter.",
          "Repairs you can see before they land — and only if there is anything to repair.",
        ],
        ur: [
          "ایک scrutiny report — blockers ← warnings ← notes، ہر ایک کے ساتھ ایک سطری حل۔ مکمل report .slc/scrutiny.json میں محفوظ ہوتی ہے۔",
          "ہر وہ فیصلہ جو واقعی کرنے لائق ہو — کوئی حد مقرر نہیں۔ جو اصلی خلا SLC نہ پوچھے، وہ آگے چل کر خاموش غلط اندازہ بن جاتا ہے، اور یہ ایک اضافی سوال سے کہیں برا ہے۔ ہر فیصلے کے ساتھ تجویز کردہ جواب ہوتا ہے، جسے صرف Enter دبا کر قبول کیا جا سکتا ہے۔",
          "ایسی مرمتیں جو نافذ ہونے سے پہلے آپ دیکھ لیتے ہیں — اور صرف اُس صورت میں جب مرمت کی کوئی ضرورت ہو۔",
        ],
      },
      { t: "h3", en: "Scrutiny reviews; it does not rewrite", ur: "Scrutiny جائزہ لیتی ہے، دوبارہ نہیں لکھتی" },
      {
        t: "p",
        en: "If your requirement already exists as a file, SLC treats it as yours — your structure, your wording, your section order, even if it's nothing like SLC's own template (it might be better). A brief that's already solid is left completely untouched: no menu, no “repaired” copy, nothing to confirm. SLC says so and moves straight on.",
        ur: "اگر آپ کی requirement پہلے سے ایک فائل کی صورت موجود ہے تو SLC اسے آپ کی ملکیت سمجھتا ہے — آپ کی ساخت، آپ کے الفاظ، آپ کی ترتیب، چاہے وہ SLC کے اپنے سانچے سے بالکل مختلف ہو (ہو سکتا ہے بہتر ہی ہو)۔ جو brief پہلے ہی مضبوط ہو، اسے بالکل ہاتھ نہیں لگایا جاتا: نہ کوئی مینو، نہ ”مرمت شدہ“ نقل، نہ کچھ تصدیق کرنے کو۔ SLC یہ بتا کر آگے بڑھ جاتا ہے۔",
      },
      {
        t: "p",
        en: "When there genuinely are fixes, SLC shows you a diff — lines added and removed — before anything is written, so “apply” never means “trust me”. Only the flagged spots change, plus one appended ## Assumptions (recorded by SLC) section if anything was left undecided. Your original is backed up to .slc/requirement.backup.md before any real change lands.",
        ur: "جب واقعی کچھ درست کرنا ہو، تو کچھ بھی لکھنے سے پہلے SLC آپ کو diff دکھاتا ہے — کون سی سطریں شامل ہوئیں، کون سی نکلیں — تاکہ ”apply“ کا مطلب کبھی ”مجھ پر بھروسہ کریں“ نہ ہو۔ صرف نشان زد جگہیں بدلتی ہیں، اور اگر کوئی بات غیر طے شدہ رہ جائے تو آخر میں ایک ## Assumptions (recorded by SLC) سیکشن جُڑ جاتا ہے۔ کوئی بھی حقیقی تبدیلی سے پہلے آپ کی اصل فائل .slc/requirement.backup.md میں محفوظ ہو جاتی ہے۔",
      },
      {
        t: "callout",
        tone: "info",
        en: "Skipped decisions become explicit assumptions recorded in spec/MEMORY.md — never silent inventions.",
        ur: "چھوڑے گئے فیصلے واضح مفروضے بن کر spec/MEMORY.md میں درج ہوتے ہیں — خاموش ایجادات کبھی نہیں۔",
      },
      {
        t: "callout",
        tone: "tip",
        en: "Disagree with a flag? Pick “Continue with my original text” — the flag is recorded as an assumption, never enforced. You can also go edit the requirement yourself and get re-checked.",
        ur: "کسی نشان زد بات سے اختلاف ہے؟ ”اپنے اصل متن کے ساتھ جاری رکھیں“ چنیں — وہ بات صرف مفروضے کے طور پر درج ہوتی ہے، زبردستی لاگو نہیں۔ آپ خود requirement بدل کر دوبارہ جانچ بھی کروا سکتے ہیں۔",
      },
    ],
  },
  {
    id: "flow",
    num: "05",
    title: { en: "The guided flow", ur: "رہنمائی والا عمل" },
    blocks: [
      {
        t: "p",
        en: "Groundwork runs on a harness: a persistent mission map saved to .slc/mission.json. It always knows where you are, what's done, and what the end goal is — across pauses, Ctrl+C, and restarts. Every phase gets a numbered section header, so a long run never turns into a wall of text.",
        ur: "Groundwork ایک harness پر چلتا ہے: ایک مستقل mission map جو .slc/mission.json میں محفوظ رہتا ہے۔ اسے ہمیشہ معلوم ہوتا ہے کہ آپ کہاں ہیں، کیا مکمل ہوا، اور آخری منزل کیا ہے — وقفوں، Ctrl+C اور دوبارہ چلانے کے باوجود۔ ہر مرحلے کو نمبر شدہ سیکشن ہیڈر ملتا ہے۔",
      },
      {
        t: "code",
        lang: "text",
        code: `✦ MISSION — a validated spec tree, then handoff
│
├ ✓ Connect your AI
├ ✓ Read your requirement
├ ✓ Scrutiny — check, repair & confirm the idea
├ ▸ Backend specs   ◄ you are here
│   ├ ✓ generate
│   ├ ✓ health check
│   └ ▸ your review
├ · Checkpoint — project setup
├ · Frontend specs (from the backend contract)
└ · Handoff to your coding agent`,
      },
      { t: "h3", en: "Backend first, then the review gate", ur: "پہلے backend، پھر review gate" },
      {
        t: "ol",
        en: [
          "SLC detects the scope (full-stack, backend-only, frontend-only) and asks you to confirm — its guess is only a proposal.",
          "Backend specs are generated first and validated with slc doctor automatically.",
          "The review gate: open spec/backend_specs and look. Lock them in — or pick “Something's off” and describe the change in a sentence (“split auth into its own phase”, “we use Prisma not raw SQL”). The backend regenerates with your note attached, as many rounds as you need. Nothing is frozen until you say so.",
        ],
        ur: [
          "SLC دائرہ کار (full-stack، صرف backend، صرف frontend) خود پہچانتا ہے اور آپ سے تصدیق مانگتا ہے — اس کا اندازہ محض تجویز ہوتا ہے۔",
          "پہلے backend specs بنتی ہیں اور slc doctor سے خودبخود تصدیق ہوتی ہے۔",
          "review gate: spec/backend_specs کھول کر دیکھیں۔ منظور کریں — یا ”کچھ ٹھیک نہیں“ چن کر ایک جملے میں تبدیلی بتائیں (”auth کو الگ phase بناؤ“، ”ہم Prisma استعمال کرتے ہیں، raw SQL نہیں“)۔ backend آپ کے نوٹ کے ساتھ دوبارہ بنتا ہے، جتنے چکر چاہیں۔ جب تک آپ نہ کہیں، کچھ منجمد نہیں ہوتا۔",
        ],
      },
      {
        t: "callout",
        tone: "info",
        en: "The frontend CONTRACT is derived from the backend — never invented. Frontend-only project? The CONTRACT derives from the requirement itself, and every derived endpoint is recorded as an explicit ASSUMPTION in spec/MEMORY.md.",
        ur: "frontend کا CONTRACT ہمیشہ backend سے اخذ ہوتا ہے — کبھی ایجاد نہیں۔ صرف frontend والا پروجیکٹ؟ تو CONTRACT خود requirement سے نکلتا ہے، اور ہر اخذ شدہ endpoint واضح ASSUMPTION کے طور پر spec/MEMORY.md میں درج ہوتا ہے۔",
      },
      { t: "h3", en: "The checkpoint — SLC waits for you", ur: "چیک پوائنٹ — SLC آپ کا انتظار کرتا ہے" },
      {
        t: "p",
        en: "After the backend specs are locked, SLC pauses on purpose. Some things only you can do: create the database, set real secrets, configure hosting. SLC scans your specs for their {PLACEHOLDER} tokens and turns them into your setup checklist. Put real values in .slc_secrets (gitignored) or your environment — then answer “all set”, “give me a minute” (SLC waits), or “skip for now” (the handoff reminds you).",
        ur: "backend specs لاک ہونے کے بعد SLC جان بوجھ کر رکتا ہے۔ کچھ کام صرف آپ کر سکتے ہیں: ڈیٹابیس بنانا، اصلی secrets رکھنا، ہوسٹنگ سیٹ کرنا۔ SLC آپ کی specs کے {PLACEHOLDER} tokens سے آپ کی سیٹ اپ فہرست بناتا ہے۔ اصل قیمتیں .slc_secrets (gitignored) یا ماحول میں رکھیں — پھر جواب دیں: ”سب ہو گیا“، ”ذرا رکیں“ (SLC انتظار کرتا ہے) یا ”ابھی چھوڑ دیں“ (handoff یاد دلا دے گا)۔",
      },
      { t: "h3", en: "Your brand, your taste", ur: "آپ کا برانڈ، آپ کا ذوق" },
      {
        t: "p",
        en: "Want it to look like YOUR brand? Drop reference material in an inspo/ folder before the design-taste step: up to 4 images (screenshots, a logo, a moodboard — ≤3MB each), brand/design files (.css, tokens.json, tailwind.config.js — their colors/fonts/radii are treated as law), or links. In API mode images are attached to the model's vision call; in bridge mode your agent is told to open and study the files. Whatever got picked up is printed before the demo renders, and the locked design.json records which references shaped the look.",
        ur: "چاہتے ہیں کہ سب کچھ آپ کے اپنے برانڈ جیسا لگے؟ design-taste مرحلے سے پہلے حوالہ جاتی مواد ایک inspo/ فولڈر میں رکھ دیں: زیادہ سے زیادہ 4 تصاویر (اسکرین شاٹس، لوگو، موڈ بورڈ — ہر ایک ≤3MB)، برانڈ/ڈیزائن فائلیں (.css، tokens.json، tailwind.config.js — ان کے رنگ/فونٹ/radii قانون سمجھے جاتے ہیں)، یا لنکس۔ API mode میں تصاویر ماڈل کی vision کال سے جڑتی ہیں؛ bridge mode میں آپ کے agent سے کہا جاتا ہے کہ فائلیں کھول کر غور سے دیکھے۔ جو کچھ اٹھایا گیا وہ demo بننے سے پہلے دکھا دیا جاتا ہے، اور لاک شدہ design.json درج رکھتی ہے کہ کن حوالوں نے شکل بنائی۔",
      },
      { t: "h3", en: "Pause, resume, crash — all safe", ur: "رکیں، دوبارہ شروع کریں، crash — سب محفوظ" },
      {
        t: "ul",
        en: [
          "Interrupted? Re-run slc — it offers Resume (reopens the mission map exactly where you stopped) or Regenerate. Nothing is silently overwritten.",
          "Stopped mid-bridge after your agent wrote the output? SLC detects the prompt is unchanged and offers to reuse the file — the work is never thrown away.",
          "State files are written atomically (temp + rename) — a crash can't leave a half-written state behind. A corrupt old state is moved aside and reported, never silently treated as “no state”.",
          "An existing spec/ tree is never touched without asking — and regenerating over uncommitted changes demands an explicit extra confirmation.",
          "Cloned an already-built project? .slc/state.json is gitignored (it can hold an API key), so a fresh clone never has it — but SLC doesn't call that “start over”. It samples evidence off the spec tree itself (which sides exist, task status counts, a leftover scrutiny report) and offers Resume at the inferred phase, labelled “inferred, not saved state”, with the reasons printed above the menu.",
        ],
        ur: [
          "کام رک گیا؟ slc دوبارہ چلائیں — یہ Resume (mission map بالکل وہیں سے کھلتا ہے) یا Regenerate کی پیشکش کرتا ہے۔ کچھ بھی خاموشی سے overwrite نہیں ہوتا۔",
          "bridge کے دوران رکے اور agent output لکھ چکا تھا؟ SLC پہچان لیتا ہے کہ prompt وہی ہے اور فائل دوبارہ استعمال کرنے کی پیشکش کرتا ہے — کام کبھی ضائع نہیں ہوتا۔",
          "state فائلیں atomically لکھی جاتی ہیں (temp + rename) — crash ادھوری state نہیں چھوڑ سکتا۔ خراب پرانی state الگ کر کے رپورٹ کی جاتی ہے، خاموشی سے ”کوئی state نہیں“ نہیں سمجھی جاتی۔",
          "موجودہ spec/ tree کو پوچھے بغیر کبھی ہاتھ نہیں لگایا جاتا — اور uncommitted تبدیلیوں پر دوبارہ generate کرنے کے لیے الگ سے واضح تصدیق مانگی جاتی ہے۔",
          "پہلے سے بنے پروجیکٹ کو clone کیا؟ .slc/state.json gitignored ہوتی ہے (اس میں API key ہو سکتی ہے)، اس لیے نئے clone میں یہ موجود نہیں ہوتی — مگر SLC اسے ”سب کچھ نئے سرے سے“ نہیں سمجھتا۔ یہ خود spec tree سے شواہد لیتا ہے (کون سے حصے موجود ہیں، tasks کے status کی گنتی، پچھلی scrutiny report) اور اندازہ شدہ مرحلے پر Resume پیش کرتا ہے — جس پر ”inferred, not saved state“ لکھا ہوتا ہے اور وجوہات مینو کے اوپر درج ہوتی ہیں۔",
        ],
      },
    ],
  },
  {
    id: "handoff",
    num: "06",
    title: { en: "Handoff — your agent builds", ur: "حوالگی — کوڈ آپ کا agent لکھتا ہے" },
    blocks: [
      {
        t: "p",
        en: "SLC's job ends at a validated spec tree — it does not write application code; your agent does. The final screen prints the exact line to paste into your coding agent, using the real first task from your task_index (not a guess). It's also saved to .slc/START_HERE.md so it survives the terminal scrolling.",
        ur: "SLC کا کام تصدیق شدہ spec tree پر ختم ہوتا ہے — ایپلیکیشن کوڈ یہ نہیں لکھتا؛ آپ کا agent لکھتا ہے۔ آخری اسکرین وہ درست لائن دکھاتی ہے جو آپ اپنے coding agent میں پیسٹ کرتے ہیں — آپ کے task_index کے اصل پہلے task کے ساتھ (اندازہ نہیں)۔ یہ .slc/START_HERE.md میں بھی محفوظ ہوتی ہے تاکہ ٹرمینل اسکرول ہونے پر بھی نہ کھوئے۔",
      },
      {
        t: "code",
        lang: "text",
        code: `Read SPEC.md, follow its read_order, then execute task 1.1 from spec/backend_specs/tasks/task_index.md`,
      },
      {
        t: "ul",
        en: [
          "Bridge mode: you're already in your agent — just send it that line.",
          "API mode: open your agent (Claude Code, Cursor, …) in the folder and send it that line.",
        ],
        ur: [
          "Bridge mode: آپ پہلے ہی اپنے agent میں ہیں — بس اسے وہی لائن بھیج دیں۔",
          "API mode: اسی فولڈر میں اپنا agent (Claude Code، Cursor، …) کھولیں اور وہی لائن بھیجیں۔",
        ],
      },
      {
        t: "p",
        en: "From there your agent self-drives the SLC execution loop: read SPEC.md → task_index → execute → update status. SLC decides what to build and in what order; your agent writes the code. One task per conversation works best.",
        ur: "اس کے بعد آپ کا agent خود SLC execution loop چلاتا ہے: SPEC.md پڑھو ← task_index ← عمل کرو ← status اپ ڈیٹ کرو۔ کیا بنانا ہے اور کس ترتیب سے، یہ SLC طے کرتا ہے؛ کوڈ آپ کا agent لکھتا ہے۔ ایک گفتگو میں ایک task بہترین رہتا ہے۔",
      },
    ],
  },
  {
    id: "built",
    num: "07",
    title: { en: "Working on a built project", ur: "بنے ہوئے پروجیکٹ پر کام" },
    blocks: [
      {
        t: "p",
        en: "Once the spec tree exists, you don't re-run slc for every change — that command is for a new project or a deliberate full regeneration. Four commands cover the life after the first run.",
        ur: "جب ایک بار spec tree بن جائے تو ہر تبدیلی کے لیے slc دوبارہ چلانے کی ضرورت نہیں — وہ کمانڈ نئے پروجیکٹ یا جان بوجھ کر پوری چیز دوبارہ بنانے کے لیے ہے۔ پہلی بار کے بعد کی زندگی چار کمانڈز سنبھالتی ہیں۔",
      },
      { t: "h3", en: "Add one feature — slc feature", ur: "ایک feature شامل کریں — slc feature" },
      {
        t: "code",
        lang: "bash",
        code: `slc feature "Add a due-date field to todos, shown on the list and editable per item"`,
      },
      {
        t: "p",
        en: "This is a narrow, additive operation, not a re-run of the guided flow. It reads what already exists — CONTEXT.md's non-goals, CONSTRAINTS.md's hard rules, MEMORY.md's frozen decisions, the current backend/frontend CONTRACT and task_index.md — and checks your request against them. A real conflict comes back as a flag (severity block for anything that truly contradicts something frozen) instead of being silently generated around.",
        ur: "یہ ایک محدود، اضافی عمل ہے — رہنمائی والے پورے flow کا دوبارہ چلنا نہیں۔ یہ پہلے سے موجود چیزیں پڑھتا ہے — CONTEXT.md کے non-goals، CONSTRAINTS.md کے سخت اصول، MEMORY.md کے منجمد فیصلے، موجودہ backend/frontend CONTRACT اور task_index.md — اور آپ کی درخواست کو ان کے سامنے رکھ کر جانچتا ہے۔ اگر واقعی ٹکراؤ ہو تو وہ ایک flag بن کر سامنے آتا ہے (کسی منجمد بات سے صریح تضاد پر شدت block) — خاموشی سے اس کے گرد گھوم کر کچھ نہیں بنایا جاتا۔",
      },
      {
        t: "ul",
        en: [
          "New tasks always land in a brand-new phase number — never a renumbered slot inside an existing phase — so ids can't collide by construction, not by careful counting.",
          "CONTEXT.md, CONSTRAINTS.md and SECURITY.md are never touched. If the feature genuinely needs one of them to change, that's a full slc run — SLC says so instead of guessing.",
          "You see the exact file list before anything is written, and slc doctor runs both before (adding to an already-broken tree just compounds the breakage) and immediately after.",
          "No description on the command line? SLC asks for one — and you can attach a file instead of typing, which helps when the request is a long bug report or a design note you already wrote somewhere else.",
        ],
        ur: [
          "نئے tasks ہمیشہ ایک بالکل نئے phase نمبر میں آتے ہیں — کسی موجودہ phase کے اندر دوبارہ نمبر لگا کر نہیں — اس لیے ids کا ٹکرانا ساخت ہی سے ناممکن ہے، محتاط گنتی سے نہیں۔",
          "CONTEXT.md، CONSTRAINTS.md اور SECURITY.md کو کبھی ہاتھ نہیں لگایا جاتا۔ اگر feature کے لیے واقعی ان میں سے کوئی بدلنی ضروری ہو تو یہ پورے slc run کا کام ہے — SLC اندازہ لگانے کے بجائے یہ صاف کہہ دیتا ہے۔",
          "کچھ لکھے جانے سے پہلے آپ کو فائلوں کی مکمل فہرست دکھتی ہے، اور slc doctor پہلے بھی چلتا ہے (پہلے سے خراب tree میں اضافہ خرابی کو بڑھاتا ہے) اور فوراً بعد بھی۔",
          "کمانڈ لائن پر تفصیل نہیں دی؟ SLC خود پوچھ لیتا ہے — اور ٹائپ کرنے کے بجائے آپ فائل بھی لگا سکتے ہیں، جو لمبی bug report یا پہلے سے لکھے ڈیزائن نوٹ کے لیے آسان رہتا ہے۔",
        ],
      },
      { t: "h3", en: "What it saved you — slc estimate", ur: "اس نے کیا بچایا — slc estimate" },
      { t: "code", lang: "bash", code: "slc estimate" },
      {
        t: "p",
        en: "A token report for the spec tree that's already there, split into three kinds of number on purpose — SLC avoids confident-sounding figures it can't back up. MEASURED: file count, size, and a rough token estimate (bytes ÷ 4, labelled rough — not an exact tokenizer count), read straight off disk. DERIVED: task count and total agent-time, surfaced from the total_tasks / total_estimate your specs already carry — not a new guess. ESTIMATED: a token-savings range for spec-driven vs. no spec tree, with the assumption printed next to it, shown as a range and never a single confident number.",
        ur: "موجودہ spec tree کے لیے ایک token report، جو جان بوجھ کر تین طرح کے اعداد میں بٹی ہوتی ہے — SLC ایسے پُریقین اعداد سے گریز کرتا ہے جن کی وہ ضمانت نہ دے سکے۔ MEASURED: فائلوں کی تعداد، حجم، اور ایک تخمینی token شمار (bytes ÷ 4، جسے صاف ”تخمینی“ لکھا جاتا ہے، اصل tokenizer شمار نہیں) — سیدھا ڈسک سے پڑھا ہوا۔ DERIVED: tasks کی تعداد اور کل agent وقت، جو آپ کی specs میں پہلے سے موجود total_tasks / total_estimate سے لیا جاتا ہے — کوئی نیا اندازہ نہیں۔ ESTIMATED: spec کے ساتھ اور بغیر spec کے کام کا token بچت کا دائرہ، جس کے ساتھ اس کی بنیاد بھی لکھی ہوتی ہے — ہمیشہ ایک دائرہ، کبھی ایک پُریقین عدد نہیں۔",
      },
      {
        t: "callout",
        tone: "info",
        en: "No dollar figure is ever built in — model pricing changes too often to bake into a CLI without going stale and misleading you. Give it a $/million-token rate when it asks (Enter to skip) and it converts the range for you.",
        ur: "کوئی ڈالر والا عدد اس میں شامل نہیں کیا گیا — ماڈلز کی قیمتیں اتنی جلدی بدلتی ہیں کہ CLI میں پکا کر رکھنا صرف پرانی اور گمراہ کن معلومات دے گا۔ جب یہ پوچھے تو $/ملین-token کی شرح دے دیں (چھوڑنے کے لیے Enter) اور یہ خود حساب کر دے گا۔",
      },
      { t: "h3", en: "The data model — slc db", ur: "ڈیٹا ماڈل — slc db" },
      { t: "code", lang: "bash", code: "slc db" },
      {
        t: "p",
        en: "Reads every data_model entry under backend_specs/ARCH.md (or arch/*.md when split) and prints entities, fields and types, plus the relationships it can infer from *_id-style field names — for example Session.user_id → User.id. Pure and instant, with no LLM call, and it says so plainly when nothing matches the documented shape rather than guessing at a different one.",
        ur: "یہ backend_specs/ARCH.md (یا تقسیم کی صورت میں arch/*.md) کے ہر data_model اندراج کو پڑھ کر entities، fields اور types دکھاتا ہے، اور ساتھ وہ تعلقات بھی جو *_id جیسے field ناموں سے اخذ ہو سکیں — مثلاً Session.user_id ← User.id۔ خالص اور فوری، بغیر کسی LLM کال کے — اور اگر کچھ بھی دستاویزی شکل سے میل نہ کھائے تو یہ صاف کہہ دیتا ہے، کسی اور شکل کا اندازہ نہیں لگاتا۔",
      },
      { t: "h3", en: "Risk in the specs — slc audit", ur: "specs میں خطرہ — slc audit" },
      { t: "code", lang: "bash", code: "slc audit" },
      {
        t: "p",
        en: "Scrutiny reviews your requirement before any spec exists. Doctor checks that the generated specs are structurally valid SLC. Neither one reads the actual architecture for security or design risk — audit is that missing pass: an LLM review of ARCH + CONTRACT + SECURITY + CONSTRAINTS for authn/authz gaps, unprotected sensitive fields, boundary violations the ARCH itself declares and then contradicts, and constraint conflicts. Same flag shape as scrutiny: block / warn / note, each with a one-line fix.",
        ur: "Scrutiny کوئی spec بننے سے پہلے آپ کی requirement دیکھتی ہے۔ Doctor یہ جانچتا ہے کہ بنی ہوئی specs ساخت کے لحاظ سے درست SLC ہیں۔ ان میں سے کوئی بھی اصل آرکیٹیکچر کو سیکیورٹی یا ڈیزائن کے خطرے کے لیے نہیں پڑھتا — audit وہی چھوٹا ہوا مرحلہ ہے: ARCH + CONTRACT + SECURITY + CONSTRAINTS کا LLM جائزہ، جس میں authn/authz کے خلا، غیر محفوظ حساس fields، وہ boundary خلاف ورزیاں جو خود ARCH بیان کر کے پھر توڑتا ہے، اور constraints کے ٹکراؤ دیکھے جاتے ہیں۔ نشان زد کرنے کا انداز scrutiny جیسا ہی: block / warn / note، ہر ایک کے ساتھ ایک سطری حل۔",
      },
      {
        t: "callout",
        tone: "info",
        en: "audit is read-only — a report, not an auto-fix — because a wrong security “fix” is worse than a wrong structural one. Address the findings with slc feature or by editing the specs yourself.",
        ur: "audit صرف پڑھتا ہے — یہ رپورٹ ہے، خودکار مرمت نہیں — کیونکہ غلط سیکیورٹی ”مرمت“ غلط ساختی مرمت سے زیادہ نقصان دہ ہے۔ نتائج پر slc feature سے یا خود specs میں ترمیم کر کے عمل کریں۔",
      },
    ],
  },
  {
    id: "commands",
    num: "08",
    title: { en: "Commands", ur: "کمانڈز" },
    blocks: [
      {
        t: "p",
        en: "The guided generator — the whole flow above, resumable. It finds your requirement automatically:",
        ur: "رہنمائی والا generator — اوپر بیان کردہ پورا عمل، دوبارہ شروع کے قابل۔ یہ آپ کی requirement خود ڈھونڈ لیتا ہے:",
      },
      { t: "code", lang: "bash", code: "npx @wewiselabs/slc" },
      {
        t: "p",
        en: "The same run, but reading the requirement from an exact path — any name, any format:",
        ur: "وہی عمل، مگر requirement بالکل بتائے گئے راستے سے پڑھی جاتی ہے — کوئی بھی نام، کوئی بھی شکل:",
      },
      { t: "code", lang: "bash", code: "npx @wewiselabs/slc --file docs/product-brief.md" },
      {
        t: "p",
        en: "For a project that already has a spec tree (section 07 covers each of these in full):",
        ur: "ایسے پروجیکٹ کے لیے جس کا spec tree پہلے سے موجود ہو (سیکشن 07 میں ہر ایک کی تفصیل ہے):",
      },
      {
        t: "code",
        lang: "bash",
        code: `slc feature "<description>"   # add one feature — new phase, nothing renumbered
slc estimate                  # token report: measured + derived + estimated
slc db                        # entities, fields, inferred relationships (no LLM call)
slc audit                     # security/architecture review of the specs — report only`,
      },
      {
        t: "p",
        en: "Validate an existing spec/ tree — structure, references, contracts, secrets, and post-merge damage. Exit code 1 on errors:",
        ur: "موجودہ spec/ tree کی جانچ — ساخت، حوالے، contracts، secrets اور merge کے بعد کا نقصان۔ غلطی پر exit code 1:",
      },
      { t: "code", lang: "bash", code: "npx @wewiselabs/slc doctor" },
      {
        t: "p",
        en: "The same check as machine-readable JSON — headless, CI-friendly. Drop this line into your workflow to guard the spec tree:",
        ur: "وہی جانچ مشین کے پڑھنے لائق JSON میں — بغیر ٹرمینل، CI کے لیے۔ spec tree کی حفاظت کے لیے یہ لائن اپنے workflow میں ڈال دیں:",
      },
      { t: "code", lang: "yaml", code: "- run: npx @wewiselabs/slc doctor --json" },
      {
        t: "p",
        en: "Help and version:",
        ur: "مدد اور ورژن:",
      },
      { t: "code", lang: "bash", code: "npx @wewiselabs/slc --help\nnpx @wewiselabs/slc --version" },
      {
        t: "callout",
        tone: "tip",
        en: "Banner looks garbled on a legacy console? SLC_ASCII=1 slc renders plain-ASCII art, and SLC_ANIM=0 disables the intro animation. slc itself needs a real terminal; doctor --json runs headless.",
        ur: "پرانے کنسول پر banner بگڑا نظر آئے؟ SLC_ASCII=1 slc سادہ ASCII آرٹ دکھاتا ہے، اور SLC_ANIM=0 ابتدائی اینیمیشن بند کر دیتا ہے۔ slc کو اصل ٹرمینل چاہیے؛ doctor --json بغیر ٹرمینل بھی چلتا ہے۔",
      },
    ],
  },
  {
    id: "teams",
    num: "09",
    title: { en: "Teams & CI", ur: "ٹیمیں اور CI" },
    blocks: [
      {
        t: "p",
        en: "The spec tree is designed to be merged, but merges break specs in ways no single branch can see. Three habits keep it safe:",
        ur: "spec tree merge ہونے کے لیے بنایا گیا ہے، لیکن merges اسے ایسے طریقوں سے توڑتے ہیں جو کوئی اکیلی branch نہیں دیکھ سکتی۔ تین عادتیں اسے محفوظ رکھتی ہیں:",
      },
      {
        t: "ol",
        en: [
          "Never number things sequentially on a branch. Decisions are dec-<slug> (e.g. dec-auth-jwt-over-sessions), never dec1, dec2 — two branches will both allocate “the next number” and collide, in MEMORY.md and in every code comment that cites it. Slugs derived from content don't collide; when they do, it's literally the same decision.",
          "Run slc doctor after every merge — or gate merges with the CI line above. It catches exactly the post-merge breakage: leftover conflict markers, duplicate block names and task ids, ambiguous references, ARCH.md and arch/ coexisting, orphaned task files, stale total_tasks counts.",
          "Know what's shared and what's local. spec/, requirement.md, and AGENTS.md/CLAUDE.md are shared — commit them. .slc/ is local per developer (your key, your run state, your paper trail) and stays gitignored.",
        ],
        ur: [
          "branch پر چیزوں کو کبھی ترتیب وار نمبر نہ دیں۔ فیصلے dec-<slug> ہوتے ہیں (مثلاً dec-auth-jwt-over-sessions)، کبھی dec1، dec2 نہیں — دو branches دونوں ”اگلا نمبر“ لے لیں گی اور ٹکرائیں گی، MEMORY.md میں بھی اور ہر اُس code comment میں بھی جو اس کا حوالہ دیتا ہے۔ مواد سے نکلے slugs نہیں ٹکراتے؛ اگر ٹکرائیں تو وہ حقیقتاً ایک ہی فیصلہ ہے۔",
          "ہر merge کے بعد slc doctor چلائیں — یا اوپر دی گئی CI لائن سے merges کی حفاظت کریں۔ یہ بالکل وہی نقصان پکڑتا ہے جو merge کے بعد ہوتا ہے: بچے ہوئے conflict markers، دہرے block نام اور task ids، مبہم حوالے، ARCH.md اور arch/ کا ایک ساتھ ہونا، یتیم task فائلیں، پرانے total_tasks شمار۔",
          "جانیں کیا مشترک ہے اور کیا مقامی۔ spec/، requirement.md اور AGENTS.md/CLAUDE.md مشترک ہیں — انہیں commit کریں۔ .slc/ ہر ڈیولپر کی اپنی ہوتی ہے (آپ کی key، آپ کی run state) اور gitignore میں رہتی ہے۔",
        ],
      },
      {
        t: "callout",
        tone: "info",
        en: "Two branches disagree on a task's status? Take the more advanced one: done beats in-progress beats todo. Counters like total_tasks are derived — the task list is the truth, and doctor tells you when a count went stale.",
        ur: "دو branches کسی task کے status پر متفق نہیں؟ زیادہ آگے والا لیں: done، in-progress سے جیتتا ہے اور in-progress، todo سے۔ total_tasks جیسے شمار اخذ شدہ ہیں — سچ task list ہے، اور شمار پرانا ہو جائے تو doctor بتا دیتا ہے۔",
      },
    ],
  },
  {
    id: "dodont",
    num: "10",
    title: { en: "Do & don't", ur: "کریں اور نہ کریں" },
    blocks: [
      { t: "h3", en: "Do", ur: "کریں" },
      {
        t: "ul",
        en: [
          "Write your requirement like you'd brief a junior dev — explicit features, stack, non-goals. Any filename, any structure; the content is what counts.",
          "Use bridge mode if you already pay for Claude Code / Copilot — no API key needed.",
          "Take the review gate seriously: the backend contract is frozen after you confirm.",
          "Run slc doctor in CI and after every merge so broken specs never land.",
          "Use slc feature to add to a built project — it lands in a new phase and leaves the frozen files alone.",
          "When the scope itself changes (non-goals, constraints, security), update the requirement first and regenerate — that's bigger than a feature.",
          "Run slc audit once the specs are locked — doctor proves they're valid SLC, audit reads them for actual risk.",
        ],
        ur: [
          "اپنی requirement ایسے لکھیں جیسے junior developer کو سمجھا رہے ہوں — واضح فیچرز، stack، non-goals۔ نام کوئی بھی ہو، ساخت کوئی بھی؛ اصل چیز مواد ہے۔",
          "اگر Claude Code / Copilot کی سبسکرپشن ہے تو bridge mode استعمال کریں — API key کی ضرورت نہیں۔",
          "review gate کو سنجیدہ لیں: تصدیق کے بعد backend contract منجمد ہو جاتا ہے۔",
          "CI میں اور ہر merge کے بعد slc doctor چلائیں تاکہ خراب specs کبھی نہ پہنچیں۔",
          "بنے ہوئے پروجیکٹ میں اضافے کے لیے slc feature استعمال کریں — یہ نئے phase میں آتا ہے اور منجمد فائلوں کو نہیں چھیڑتا۔",
          "جب دائرہ کار خود بدلے (non-goals، پابندیاں، سیکیورٹی) تو پہلے requirement بدلیں اور دوبارہ generate کریں — یہ ایک feature سے بڑی بات ہے۔",
          "specs لاک ہو جائیں تو ایک بار slc audit چلائیں — doctor بتاتا ہے کہ یہ درست SLC ہیں، audit انہیں اصل خطرے کے لیے پڑھتا ہے۔",
        ],
      },
      { t: "h3", en: "Don't", ur: "نہ کریں" },
      {
        t: "ul",
        en: [
          "Don't re-run slc on a built project just to add one thing — that's a full regeneration. Use slc feature.",
          "Don't put real secrets, emails, or keys in your requirement or any spec — SLC scans and will stop you.",
          "Don't hand-edit task status inside task files — task_index.md is the only status ledger.",
          "Don't let your agent invent endpoints — the frontend derives from the backend CONTRACT.",
          "Don't switch models mid-project; interpretations drift.",
          "Don't number decisions sequentially (dec1, dec2) — use content slugs like dec-auth-jwt-over-sessions.",
          "Don't batch many tasks in one agent prompt — one task, one loop.",
        ],
        ur: [
          "بنے ہوئے پروجیکٹ میں ایک چیز شامل کرنے کے لیے slc دوبارہ نہ چلائیں — وہ پوری چیز دوبارہ بناتا ہے۔ slc feature استعمال کریں۔",
          "اپنی requirement یا کسی spec میں اصلی secrets، ای میلز یا keys نہ رکھیں — SLC اسکین کر کے روک دے گا۔",
          "task فائلوں میں status ہاتھ سے نہ بدلیں — status صرف task_index.md میں ہوتا ہے۔",
          "agent کو endpoints ایجاد نہ کرنے دیں — frontend ہمیشہ backend CONTRACT سے نکلتا ہے۔",
          "project کے دوران ماڈل نہ بدلیں؛ تشریحات بہک جاتی ہیں۔",
          "فیصلوں کو ترتیب وار نمبر نہ دیں (dec1، dec2) — مواد والے slugs رکھیں جیسے dec-auth-jwt-over-sessions۔",
          "ایک prompt میں بہت سے tasks نہ دیں — ایک task، ایک چکر۔",
        ],
      },
    ],
  },
  {
    id: "troubleshoot",
    num: "11",
    title: { en: "Troubleshooting", ur: "مسائل کا حل" },
    blocks: [
      { t: "h3", en: "Installing / running", ur: "انسٹال / چلانا" },
      {
        t: "ul",
        en: [
          "“'slc' is not recognized” — the bare command only exists after a global install: npm install -g @wewiselabs/slc, then open a new terminal.",
          "Still unrecognized after the -g install — npm's global bin folder isn't on PATH. Run npm config get prefix, add that folder (Windows) or its bin/ (macOS/Linux) to PATH, open a new terminal.",
          "PowerShell: “slc.ps1 cannot be loaded because running scripts is disabled” — run slc.cmd instead, or once: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned.",
          "npx slc installs something weird — unscoped slc is a different, unrelated npm package. Always the full name: npx @wewiselabs/slc.",
          "“slc is interactive — run it in a real terminal” — output is piped or the shell has no TTY (some CI shells, Git Bash via MinTTY). Use Windows Terminal / PowerShell / a normal terminal; doctor --json still works piped.",
          "Banner/art looks garbled — legacy console without unicode. SLC_ASCII=1 slc gives plain-ASCII art; SLC_ANIM=0 disables the intro animation.",
          "Install fails, or prompts hang oddly, on an old Node — SLC's terminal UI runs on Ink, which needs Node 22 or newer. Check node --version and upgrade (Node 18 is past its own end-of-life anyway).",
        ],
        ur: [
          "”'slc' is not recognized“ — سیدھی کمانڈ صرف global انسٹال کے بعد ملتی ہے: npm install -g @wewiselabs/slc، پھر نیا ٹرمینل کھولیں۔",
          "-g انسٹال کے بعد بھی نہ پہچانے — npm کا global bin فولڈر PATH پر نہیں۔ npm config get prefix چلائیں، وہ فولڈر (Windows) یا اس کا bin/ (macOS/Linux) PATH میں شامل کریں، نیا ٹرمینل کھولیں۔",
          "PowerShell: ”slc.ps1 cannot be loaded because running scripts is disabled“ — اس کی جگہ slc.cmd چلائیں، یا ایک بار: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned۔",
          "npx slc کچھ عجیب انسٹال کرے — بغیر scope والا slc ایک الگ، غیر متعلق npm پیکج ہے۔ ہمیشہ پورا نام: npx @wewiselabs/slc۔",
          "”slc is interactive — run it in a real terminal“ — output pipe ہو رہی ہے یا shell کے پاس TTY نہیں (کچھ CI shells، MinTTY والا Git Bash)۔ Windows Terminal / PowerShell / عام ٹرمینل استعمال کریں؛ doctor --json پائپ ہو کر بھی چلتا ہے۔",
          "banner/آرٹ بگڑا نظر آئے — unicode کے بغیر پرانا کنسول۔ SLC_ASCII=1 slc سادہ ASCII آرٹ دیتا ہے؛ SLC_ANIM=0 ابتدائی اینیمیشن بند کرتا ہے۔",
          "پرانے Node پر انسٹال ناکام ہو یا prompts عجیب اٹک جائیں — SLC کا ٹرمینل UI Ink پر چلتا ہے، جسے Node 22 یا نیا چاہیے۔ node --version دیکھیں اور اپ گریڈ کریں (ویسے بھی Node 18 اپنی مدت پوری کر چکا ہے)۔",
        ],
      },
      { t: "h3", en: "During a run", ur: "run کے دوران" },
      {
        t: "ul",
        en: [
          "“Could not parse …output.json” — SLC shows what the file actually starts with. Empty → the agent saved to the wrong path. Prose → tell the agent “save the raw JSON only, no commentary”. (UTF-16/BOM encodings are decoded automatically.)",
          "“Expected a JSON array of files but found none” — use a more capable model, or in bridge mode make sure the agent wrote real JSON to the output file.",
          "“The output looks truncated” — the model hit its output limit. Use a larger-output model, or bridge mode with your agent.",
          "slc doctor: N error(s) — in API mode, accept the one-tap auto-fix (it re-prompts your model to repair only the broken files). In bridge mode, fix in your agent and run slc doctor again.",
          "Key check failed — check the base URL + key; you can still save and continue. OpenRouter/Ollama need their own base URLs.",
          "OpenAI 400 “Unsupported parameter” (gpt-5 / o-series) — handled automatically: SLC adapts max_tokens → max_completion_tokens and drops pinned temperature, then retries. Update SLC if you still see it.",
          "Generation dies at exactly 2 minutes — old versions had a 120s network cap; generations now get 5 minutes. Update SLC.",
          "“Rate limited (429)” / provider hiccup — wait a moment; API calls retry with backoff automatically.",
          "The taste demo didn't open in a browser — open .slc/preview/demo.html yourself; the path is always printed. A blocked opener never stops the run.",
          "It generated the wrong thing — answer No at the review gate and describe the change; the backend regenerates.",
          "Want a totally clean slate — delete spec/ and .slc/, run slc again.",
        ],
        ur: [
          "”Could not parse …output.json“ — SLC دکھاتا ہے کہ فائل واقعی کس چیز سے شروع ہوتی ہے۔ خالی ہو ← agent نے غلط راستے پر محفوظ کیا۔ عبارت ہو ← agent سے کہیں ”صرف خام JSON محفوظ کرو، کوئی تبصرہ نہیں“۔ (UTF-16/BOM encodings خودبخود پڑھ لی جاتی ہیں۔)",
          "”Expected a JSON array of files but found none“ — زیادہ قابل ماڈل لیں، یا bridge mode میں یقینی بنائیں کہ agent نے output فائل میں اصلی JSON لکھی ہے۔",
          "”The output looks truncated“ — ماڈل کی output حد آ گئی۔ بڑی output والا ماڈل لیں، یا اپنے agent کے ساتھ bridge mode۔",
          "slc doctor: N error(s) — API mode میں ایک tap والا auto-fix قبول کریں (یہ صرف خراب فائلوں کی مرمت کے لیے ماڈل کو دوبارہ کہتا ہے)۔ bridge mode میں اپنے agent سے ٹھیک کروا کر slc doctor دوبارہ چلائیں۔",
          "Key check failed — base URL اور key دیکھیں؛ پھر بھی محفوظ کر کے جاری رکھ سکتے ہیں۔ OpenRouter/Ollama کے اپنے base URLs ہوتے ہیں۔",
          "OpenAI 400 ”Unsupported parameter“ (gpt-5 / o-series) — خودبخود سنبھال لیا جاتا ہے: SLC، max_tokens کو max_completion_tokens بنا دیتا ہے اور مقررہ temperature ہٹا کر دوبارہ کوشش کرتا ہے۔ پھر بھی نظر آئے تو SLC اپ ڈیٹ کریں۔",
          "generation ٹھیک 2 منٹ پر مر جائے — پرانے ورژنز میں 120 سیکنڈ کی حد تھی؛ اب generations کو 5 منٹ ملتے ہیں۔ SLC اپ ڈیٹ کریں۔",
          "”Rate limited (429)“ / provider کی خرابی — تھوڑا انتظار کریں؛ API کالز backoff کے ساتھ خود دوبارہ کوشش کرتی ہیں۔",
          "taste demo براؤزر میں نہ کھلے — .slc/preview/demo.html خود کھول لیں؛ راستہ ہمیشہ چھپا ہوتا ہے۔ بند opener کبھی run نہیں روکتا۔",
          "غلط چیز بن گئی — review gate پر No کہہ کر تبدیلی بتائیں؛ backend دوبارہ بنتا ہے۔",
          "بالکل صاف شروعات چاہیے — spec/ اور .slc/ حذف کر کے slc دوبارہ چلائیں۔",
        ],
      },
      {
        t: "callout",
        tone: "tip",
        en: "SLC writes the specs. Your agent writes the code. Keep the two jobs separate and the drift goes away.",
        ur: "specs، SLC لکھتا ہے۔ کوڈ آپ کا agent لکھتا ہے۔ دونوں کام الگ رکھیں تو بھٹکاؤ خود ختم ہو جاتا ہے۔",
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// MANUAL EDITION — the classic file-based workflow (no CLI, no harness)
// ══════════════════════════════════════════════════════════════════════════════
export const MANUAL_SECTIONS: DocSection[] = [
  {
    id: "m-welcome",
    num: "00",
    title: { en: "The manual way", ur: "دستی طریقہ" },
    blocks: [
      {
        t: "p",
        en: "This is the original SLC workflow: you drive the model yourself, by hand — no CLI, no harness. Two files do the heavy lifting: SLC.md (the language) and slc_universal_structure.md (the structure). You paste them, with your requirement, into your LLM and follow the steps below.",
        ur: "یہ SLC کا اصل طریقہ ہے: آپ خود، ہاتھ سے ماڈل چلاتے ہیں — نہ CLI، نہ harness۔ اصل کام دو فائلیں کرتی ہیں: SLC.md (زبان) اور slc_universal_structure.md (ساخت)۔ آپ انہیں اپنی requirement کے ساتھ LLM میں پیسٹ کر کے نیچے دیے مراحل پر چلتے ہیں۔",
      },
      {
        t: "callout",
        tone: "tip",
        en: "Most people should use the CLI edition instead (toggle above) — it automates all of this and validates the result. This edition exists for those who prefer full manual control, and to document what happens under the hood.",
        ur: "زیادہ تر لوگوں کے لیے CLI ایڈیشن بہتر ہے (اوپر ٹوگل) — وہ یہ سب خودکار کرتا ہے اور نتیجے کی تصدیق بھی۔ یہ ایڈیشن ان کے لیے ہے جو مکمل دستی کنٹرول چاہتے ہیں۔",
      },
    ],
  },
  {
    id: "m-prereq",
    num: "01",
    title: { en: "Before you start", ur: "شروع کرنے سے پہلے" },
    blocks: [
      {
        t: "p",
        en: "Set up these three things first. The manual workflow will not work properly without them.",
        ur: "سب سے پہلے یہ تین چیزیں تیار کر لیں۔ ان کے بغیر دستی طریقہ ٹھیک سے کام نہیں کرے گا۔",
      },
      {
        t: "h3",
        en: "1. A way to fetch live docs (optional, but recommended)",
        ur: "۱۔ تازہ دستاویزات لانے کا کوئی ذریعہ (اختیاری، مگر تجویز کردہ)",
      },
      {
        t: "p",
        en: "SPEC.md carries a must_read_latest block naming the services in your stack (FastAPI, Next.js, SQLModel, …). Before implementing an integration, the agent should check current docs for it instead of relying purely on training data. Nothing specific is required — use whichever of these your agent already has, in this order: an MCP doc-resolution server if your editor has one (Context7 is one option, not the only one); your agent's own web search / fetch tool (most coding agents already have one, nothing to install); or trained knowledge with an explicit “may be stale, verify manually” note.",
        ur: "SPEC.md میں ایک must_read_latest بلاک ہوتا ہے جو آپ کے stack کی services کے نام رکھتا ہے (FastAPI، Next.js، SQLModel …)۔ کسی integration کو لکھنے سے پہلے agent کو صرف تربیتی معلومات پر بھروسہ کرنے کے بجائے موجودہ دستاویزات دیکھ لینی چاہئیں۔ کوئی مخصوص چیز لازم نہیں — ان میں سے جو آپ کے agent کے پاس پہلے سے ہو، اسی ترتیب سے استعمال کریں: ایڈیٹر میں کوئی MCP doc-resolution سرور (Context7 ایک آپشن ہے، واحد نہیں)؛ خود agent کا web search / fetch ٹول (زیادہ تر coding agents کے پاس پہلے سے ہوتا ہے، کچھ انسٹال نہیں کرنا پڑتا)؛ یا تربیتی معلومات، اس صاف نوٹ کے ساتھ کہ ”یہ پرانی ہو سکتی ہیں، خود تصدیق کریں“۔",
      },
      {
        t: "p",
        en: "If you do want an MCP doc server, Context7 is a common choice — add it to your editor's MCP config:",
        ur: "اگر آپ MCP doc سرور رکھنا ہی چاہتے ہیں تو Context7 ایک عام انتخاب ہے — اسے اپنے ایڈیٹر کی MCP config میں شامل کریں:",
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
        en: "must_read_latest is a SHOULD, not a MUST (SLC.md §9). An agent with none of the above skips the fetch and says so in its output, rather than blocking or silently guessing — you lose some freshness, not correctness.",
        ur: "must_read_latest ایک SHOULD ہے، MUST نہیں (SLC.md §9)۔ جس agent کے پاس ان میں سے کچھ نہ ہو، وہ یہ مرحلہ چھوڑ کر اپنے جواب میں یہ بات لکھ دیتا ہے — نہ رکتا ہے، نہ خاموشی سے اندازہ لگاتا ہے۔ آپ کچھ تازگی کھوتے ہیں، درستی نہیں۔",
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
    id: "m-requirement",
    num: "02",
    title: { en: "Write requirement.md", ur: "requirement.md لکھیں" },
    blocks: REQUIREMENT_BLOCKS,
  },
  {
    id: "m-generate",
    num: "03",
    title: { en: "Generate the specs", ur: "specs بنائیں" },
    blocks: [
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
          "MEMORY.md has slug-id decisions (dec-auth-jwt-over-sessions — never sequential D1, D2) with rationale and dates.",
          "CONTRACT.md lists every endpoint with an ID, full request schema, and all response codes.",
          "Task files include acceptance_criteria and blocked_by fields.",
        ],
        ur: [
          "ہر فائل @block / @end SLC syntax استعمال کرتی ہے۔",
          "MEMORY.md میں فیصلے slug ids کے ساتھ ہوتے ہیں (dec-auth-jwt-over-sessions — ترتیب وار D1، D2 کبھی نہیں)، وجہ اور تاریخ سمیت۔",
          "CONTRACT.md ہر endpoint کو ID، مکمل request schema اور تمام response codes کے ساتھ درج کرتی ہے۔",
          "Task فائلوں میں acceptance_criteria اور blocked_by شامل ہوتے ہیں۔",
        ],
      },
    ],
  },
  {
    id: "m-execute",
    num: "04",
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
Resolve live docs for every service in must_read_latest (an MCP doc server if you
have one, else your own web search/fetch tool, else note that they may be stale).
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
    id: "m-sync",
    num: "05",
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
          "New technical decision → add a dec-<slug> entry in MEMORY.md.",
          "An endpoint changed → update both CONTRACT.md files.",
          "New table / component → update the relevant ARCH.md.",
          "Security tightened → update SECURITY.md.",
        ],
        ur: [
          "نیا تکنیکی فیصلہ → MEMORY.md میں ایک dec-<slug> اندراج شامل کریں۔",
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
    id: "m-scope",
    num: "06",
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
    id: "m-mistakes",
    num: "07",
    title: { en: "Common mistakes", ur: "عام غلطیاں" },
    blocks: [
      {
        t: "ul",
        en: [
          "No live-doc resolution at all → hallucinated API signatures. An MCP doc server or your agent's own web search both work.",
          "Thin requirement → specs full of guesses. Add the missing essentials, regenerate.",
          "Switching LLM mid-project → conflicting interpretations. Pick one, stick to it.",
          "Not starting with SPEC.md → the model ignores your constraints and security rules.",
          "Not updating MEMORY.md → future sessions make contradictory choices.",
        ],
        ur: [
          "تازہ دستاویزات لانے کا کوئی ذریعہ ہی نہ ہونا → غلط API signatures۔ MCP doc سرور یا خود agent کا web search، دونوں کام دیتے ہیں۔",
          "ناقص requirement → اندازوں سے بھرے specs۔ چھوٹی ہوئی بنیادی باتیں شامل کریں اور specs دوبارہ بنوائیں۔",
          "درمیان میں LLM بدلنا → متضاد تشریحات۔ ایک منتخب کریں اور اسی پر رہیں۔",
          "SPEC.md سے شروع نہ کرنا → ماڈل آپ کی پابندیاں اور سیکیورٹی اصول نظرانداز کر دیتا ہے۔",
          "MEMORY.md اپ ڈیٹ نہ کرنا → آئندہ سیشن متضاد فیصلے کرتے ہیں۔",
        ],
      },
      {
        t: "callout",
        tone: "tip",
        en: "Master these and SLC mostly takes care of itself — structured specs in, structured software out. And whenever you're ready, the CLI edition automates the whole loop.",
        ur: "ان پر عبور حاصل کر لیں تو SLC زیادہ تر خود سنبھل جاتا ہے — منظم specs اندر، منظم سافٹ ویئر باہر۔ اور جب چاہیں، CLI ایڈیشن یہ پورا عمل خودکار کر دیتا ہے۔",
      },
    ],
  },
];

export const SECTIONS_BY_EDITION: Record<Edition, DocSection[]> = {
  cli: CLI_SECTIONS,
  manual: MANUAL_SECTIONS,
};
