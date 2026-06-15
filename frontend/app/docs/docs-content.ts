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
        en: "Two files do the heavy lifting: SLC.md (the language) and slc_universal_structure.md (the structure). Drop them in your project root and every session starts from the same page.",
        ur: "اصل کام دو فائلیں کرتی ہیں: SLC.md (زبان) اور slc_universal_structure.md (ساخت)۔ انہیں اپنے پروجیکٹ کے root میں رکھ دیں، پھر ہر سیشن ایک ہی نقطے سے شروع ہوتا ہے۔",
      },
      {
        t: "p",
        en: "This guide walks you through the whole flow: setting up, writing your requirements, generating the specs, executing tasks, and keeping everything in sync as your project grows. Take it one section at a time.",
        ur: "یہ رہنما آپ کو پورے عمل سے گزارتا ہے: سیٹ اپ، اپنی ضروریات لکھنا، specs بنانا، tasks مکمل کرنا، اور پروجیکٹ بڑھنے کے ساتھ ہر چیز کو ہم آہنگ رکھنا۔ ایک وقت میں ایک حصہ پڑھیں، جلدی کی ضرورت نہیں۔",
      },
    ],
  },
  {
    id: "prerequisites",
    num: "01",
    title: { en: "Before you start", ur: "شروع کرنے سے پہلے" },
    blocks: [
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
          "claude-sonnet-4.5–4.6 / claude-opus — best for complex specs and long-context reasoning",
          "gpt-5 — solid for task execution",
          "gemini-3.0 / 3.0 pro — a good alternative",
        ],
        ur: [
          "claude-sonnet-4.5–4.6 / claude-opus — پیچیدہ specs اور لمبے context کے لیے بہترین",
          "gpt-5 — tasks مکمل کرنے کے لیے مضبوط",
          "gemini-3.0 / 3.0 pro — ایک اچھا متبادل",
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
    num: "02",
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
    id: "mistakes",
    num: "07",
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
