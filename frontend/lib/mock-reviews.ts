import type { PublicReview } from "@/lib/api";

// Curated placeholder reviews shown in the Builder Archive before real post-launch
// reviews accumulate. Tester rows in the DB are intentionally NOT shown.
//
// SWAP LATER: when ready to show real submissions, replace the `MOCK_REVIEWS`
// import in app/page.tsx with `await getPublicReviews()` (filtered for testers).
export const MOCK_REVIEWS: PublicReview[] = [
  {
    id: 1001,
    name: "Daniyal Farooq",
    github_id: "daniyalfx",
    project_link: "https://github.com/daniyalfx/ledger-api",
    submitted_at: "2026-06-14T09:12:00",
    review_text:
      "I gave it one requirements file and it generated the full spec tree in a single pass. The read_order is the part that stuck with me. Every new session opens SPEC.md first and already knows the constraints, so I stopped re-explaining the project every morning.",
  },
  {
    id: 1002,
    name: "Mara Whitfield",
    github_id: "marawhit",
    project_link: "https://github.com/marawhit/civic-dash",
    submitted_at: "2026-06-12T16:40:00",
    review_text:
      "MEMORY.md is doing the heavy lifting for me. My architecture decisions stayed put across a month of work instead of slowly drifting the way they used to. No more contradicting myself three sessions later.",
  },
  {
    id: 1003,
    name: "Owais Tariq",
    github_id: "owais-t",
    project_link: "https://github.com/owais-t/fleet-router",
    submitted_at: "2026-06-15T11:05:00",
    review_text:
      "Token usage per task dropped hard once it only loaded the depends_on sections. On a big repo that is the difference between a session that stays sharp and one that forgets the first half by the end.",
  },
  {
    id: 1004,
    name: "Felipe Cardoso",
    github_id: "fcardoso",
    project_link: "https://github.com/fcardoso/storefront-sl",
    submitted_at: "2026-06-10T08:55:00",
    review_text:
      "The frontend contract derived straight from the backend. My API and my UI did not disagree once, which honestly used to cost me a day or two every sprint.",
  },
  {
    id: 1005,
    name: "Nadia Brennan",
    github_id: "nbrennan",
    project_link: "https://github.com/nbrennan/clinic-intake",
    submitted_at: "2026-06-16T14:22:00",
    review_text:
      "Setup is more work than just vibe coding, no point pretending otherwise. But what I shipped actually matched the plan, and for a real product that tradeoff is easy. I would not start a serious build without it now.",
  },
  {
    id: 1006,
    name: "Kelvin Osei",
    github_id: "kosei",
    project_link: "https://github.com/kosei/notes-sync",
    submitted_at: "2026-06-13T19:30:00",
    review_text:
      "I run it through Cursor and it just reads the spec files and follows them. No new tool to learn. My agent went from guessing to disciplined basically overnight.",
  },
  {
    id: 1007,
    name: "Sana Riaz",
    github_id: "sanariaz",
    project_link: "https://github.com/sanariaz/wallet-core",
    submitted_at: "2026-06-11T10:18:00",
    review_text:
      "The security file caught a hardcoded key before it ever reached git. I have used a lot of AI workflows and none of them treated redaction as an actual rule. Small thing that saved me a real headache.",
  },
];
