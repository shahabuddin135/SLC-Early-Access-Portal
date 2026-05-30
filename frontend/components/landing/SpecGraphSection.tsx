"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuFile, LuFolder, LuChevronRight } from "react-icons/lu";

// ── Types ────────────────────────────────────────────────────────────────────
type TreeNode = { id: string; displayName: string; children?: TreeNode[] };

type D3Node = d3.HierarchyNode<TreeNode> & {
  x: number; y: number; vx: number; vy: number;
  fx: number | null; fy: number | null;
};
type D3Link = { source: D3Node; target: D3Node };

interface SpecContent {
  title: string;
  badge: string;
  intent: string;
  points: string[];
}

// ── Spec directory tree (real structure, sanitized) ───────────────────────────
const SLC_TREE: TreeNode = {
  id: "SLC",
  displayName: "SLC",
  children: [
    { id: "SPEC",        displayName: "SPEC.md" },
    { id: "CONTEXT",     displayName: "CONTEXT.md" },
    { id: "MEMORY",      displayName: "MEMORY.md" },
    { id: "SECURITY",    displayName: "SECURITY.md" },
    { id: "CONSTRAINTS", displayName: "CONSTRAINTS.md" },
    {
      id: "backend_specs",
      displayName: "backend_specs/",
      children: [
        { id: "be_arch",     displayName: "ARCH.md" },
        { id: "be_contract", displayName: "CONTRACT.md" },
        { id: "be_plan",     displayName: "PLAN.md" },
        {
          id: "be_tasks",
          displayName: "tasks/",
          children: [
            { id: "be_task_idx", displayName: "task_index" },
            { id: "be_p1", displayName: "phase-1" },
            { id: "be_p2", displayName: "phase-2" },
            { id: "be_p3", displayName: "phase-3" },
            { id: "be_p4", displayName: "phase-4" },
            { id: "be_p5", displayName: "phase-5" },
          ],
        },
      ],
    },
    {
      id: "frontend_specs",
      displayName: "frontend_specs/",
      children: [
        { id: "fe_arch",     displayName: "ARCH.md" },
        { id: "fe_contract", displayName: "CONTRACT.md" },
        { id: "fe_plan",     displayName: "PLAN.md" },
        {
          id: "fe_tasks",
          displayName: "tasks/",
          children: [
            { id: "fe_task_idx", displayName: "task_index" },
            { id: "fe_p1", displayName: "phase-1" },
            { id: "fe_p2", displayName: "phase-2" },
            { id: "fe_p3", displayName: "phase-3" },
            { id: "fe_p4", displayName: "phase-4" },
          ],
        },
      ],
    },
  ],
};

// ── Sanitized spec content ────────────────────────────────────────────────────
const SPEC_CONTENT: Record<string, SpecContent> = {
  SLC: {
    title: "SLC — Root Index",
    badge: "@block INDEX root_index",
    intent: "Global router — the LLM reads this file first, before anything else.",
    points: [
      "Defines read_order: all spec files must be read in strict sequence",
      "failure_if_skipped: true — cannot be bypassed or reordered",
      "Declares must_read_latest for FastAPI, SQLModel, Next.js, and Neon",
      "Violation of read_order aborts execution",
      "Silent correction is forbidden — violations must be reported",
    ],
  },
  SPEC: {
    title: "SPEC.md — Execution Rules",
    badge: "@block INDEX root_index",
    intent: "Entry point: defines global read_order and execution law for all LLMs.",
    points: [
      "No code generation before ARCH files are finalized",
      "TASK files are locked after user approval",
      "CONTRACT.md is authoritative for all API shapes",
      "SECURITY.md overrides all other files",
      "MEMORY.md wins all conflicts and assumption changes",
    ],
  },
  CONTEXT: {
    title: "CONTEXT.md — Intent Freezer",
    badge: "@block INTENT project_context",
    intent: "Defines the project purpose and user journeys. Immutable unless explicitly overridden.",
    points: [
      "Goal: registration portal for SLC language early access",
      "User journey: Register → Login → Agree NDA → Download → Submit Review",
      "Admin journey: Generate one-time keys → Share with approved users",
      "Non-goals: no social features, payments, real-time, or mobile app",
      "No email verification in v1 — explicitly excluded from scope",
    ],
  },
  MEMORY: {
    title: "MEMORY.md — Anti-Hallucination Anchor",
    badge: "@block ANCHOR project_memory",
    intent: "Frozen decisions that win all conflicts. If MEMORY.md disagrees, MEMORY.md wins.",
    points: [
      "D1: Auth is JWT in httpOnly cookie — never localStorage or sessionStorage",
      "D2: Database is Neon PostgreSQL with async SQLModel",
      "D3: Frontend on Vercel; backend on ASGI host (Railway/Render, not serverless)",
      "D4: Review form appears only after successful file download",
      "D5: GitHub ID collected at registration but OAuth not implemented in v1",
      "D6: Download requires a one-time key redeemed via POST /redeem",
    ],
  },
  SECURITY: {
    title: "SECURITY.md — Security Law",
    badge: "@block CONSTRAINTS security_rules",
    intent: "Overrides convenience, speed, and creativity. LLMs must refuse insecure code.",
    points: [
      "Passwords: bcrypt hash only — never plain text, never logged or returned",
      "JWT: HS256 · 24hr expiry · stored in httpOnly cookie exclusively",
      "Database: parameterized queries only — no string interpolation in SQL",
      "Rate limiting: 5 req/min on register, 10 req/min on login (slowapi)",
      "File access: storage URL never reaches the client — streamed server-side",
      "Admin: double-enforced via FastAPI dependency + Next.js SSR email guard",
    ],
  },
  CONSTRAINTS: {
    title: "CONSTRAINTS.md — Reality Anchor",
    badge: "@block CONSTRAINTS tech_stack",
    intent: "Fixed technology stack. LLMs cannot propose alternatives outside these bounds.",
    points: [
      "Frontend: Next.js App Router · TypeScript · Vercel hosting",
      "Backend: FastAPI · Python 3.12+ · SQLModel ORM · ASGI server",
      "Database: Neon PostgreSQL via asyncpg (async-only calls)",
      "Auth: JWT via python-jose · bcrypt direct (passlib is NOT used)",
      "Storage: private object storage bucket — backend access only",
      "Scale target: < 10K users · < 500 concurrent requests",
    ],
  },
  backend_specs: {
    title: "backend_specs/ — Backend Directory",
    badge: "@dir backend_specs",
    intent: "Complete backend specification: architecture, API contract, execution plan, and tasks.",
    points: [
      "ARCH.md — data models, control flow, and system boundaries",
      "CONTRACT.md — authoritative API contract for all endpoints",
      "PLAN.md — 5 execution phases with task IDs and milestones",
      "tasks/ — individual locked task files, one per sub-task",
      "This portal is an SLC dogfood project — built using SLC itself",
    ],
  },
  frontend_specs: {
    title: "frontend_specs/ — Frontend Directory",
    badge: "@dir frontend_specs",
    intent: "Complete frontend specification: architecture, contracts, plans, and tasks.",
    points: [
      "ARCH.md — component hierarchy and page architecture",
      "CONTRACT.md — all API call shapes derived from backend contract",
      "PLAN.md — 4 execution phases mirroring backend phases",
      "tasks/ — individual locked task files per phase",
      "Stack: Next.js · TypeScript · shadcn/ui · GSAP · D3.js",
    ],
  },
  be_arch: {
    title: "backend/ARCH.md — Architecture",
    badge: "@block ARCH [user | key | download_token | review]_model",
    intent: "Data models, control flow, and system boundaries. Authoritative for all backend implementation.",
    points: [
      "User: id · name · email · github_id · password_hash · has_downloaded · terms_agreed_at",
      "Key: XXXX-XXXX-XXXX-XXXX format · single-use flag · redemption timestamp",
      "DownloadToken: UUID v4 · 60-second TTL · consumed atomically on first use",
      "Download: tracks user download events with timestamps",
      "Review: project_link · review content · user reference",
    ],
  },
  be_contract: {
    title: "backend/CONTRACT.md — API Contract",
    badge: "@block ARCH api_contract  ·  base: /api/v1",
    intent: "Authoritative for all endpoints. Frontend must derive all API calls from this file.",
    points: [
      "AUTH-01:  POST /auth/register",
      "AUTH-02:  POST /auth/login → issues JWT token",
      "AUTH-03:  POST /auth/logout",
      "KEY-01:   POST /redeem → redeem key, issue short-lived download token",
      "DL-01:    GET  /download/file → stream file via token (server-side)",
      "REV-01:   POST /reviews → submit project review",
      "ADM-01:   POST /admin/keys → generate batch of keys (admin only)",
    ],
  },
  be_plan: {
    title: "backend/PLAN.md — Execution Plan",
    badge: "@block PLAN backend_phases",
    intent: "5 high-level phases with task references, milestones, and time estimates.",
    points: [
      "Phase 1 — Foundation: project setup, DB schema  (60min · tasks 1.1–1.5)",
      "Phase 2 — Authentication: register, login, JWT  (90min · tasks 2.1–2.4)",
      "Phase 3 — Download: token system, stream endpoint  (40min · tasks 3.1–3.2)",
      "Phase 4 — Review: model, endpoint, guard  (40min · tasks 4.1–4.2)",
      "Phase 5 — Polish & Deploy: CORS, errors, production  (30min · tasks 5.1–5.2)",
      "Total: 15 tasks · ~260 minutes estimated",
    ],
  },
  be_tasks: {
    title: "backend/tasks/ — Task Directory",
    badge: "@block TASK [phase].[n]",
    intent: "Individual locked task files — one per implementation unit.",
    points: [
      "task_index.md — master index of all 15 backend tasks",
      "phase-1/ — Foundation: project init, env, models, DB connection",
      "phase-2/ — Auth: register endpoint, login, JWT issuance, middleware",
      "phase-3/ — Download: protected endpoint, token flow, event tracking",
      "phase-4/ — Review: model definition, guarded submission endpoint",
      "phase-5/ — Deploy: CORS config, global error handling, production config",
    ],
  },
  be_task_idx: {
    title: "backend/tasks/task_index",
    badge: "@index backend_tasks",
    intent: "Master index of all 15 backend implementation tasks across 5 phases.",
    points: [
      "15 tasks total across 5 phases",
      "Each task references its parent PLAN phase",
      "Tasks locked after user approval — cannot be modified mid-execution",
      "Completion status tracked per task",
    ],
  },
  fe_arch: {
    title: "frontend/ARCH.md — Architecture",
    badge: "@block ARCH frontend_architecture",
    intent: "Component hierarchy, page architecture, and frontend data flow.",
    points: [
      "Pages: / (landing) · /login · /register · /dashboard · /admin",
      "Landing: 9 sections (Hero · Problem · CoreIdea · Insight · Framework · Token · SpecGraph · Protocol)",
      "Auth flow: register → login → NDA modal → dashboard",
      "Server Actions handle all API calls — no direct client-side fetch",
      "GSAP + ScrollTrigger for scroll animations · D3.js for Spec Graph",
    ],
  },
  fe_contract: {
    title: "frontend/CONTRACT.md — API Contract",
    badge: "@block CONTRACT frontend_api",
    intent: "Frontend-facing contract: all API call shapes and response types.",
    points: [
      "All API calls go through Next.js Server Actions or internal API routes",
      "Client components never call the backend directly",
      "Auth state stored in httpOnly cookie — read by Next.js middleware",
      "Download flow: redeem key → receive token → trigger server-side stream",
      "Admin routes protected by SSR email check before any render",
    ],
  },
  fe_plan: {
    title: "frontend/PLAN.md — Execution Plan",
    badge: "@block PLAN frontend_phases",
    intent: "4 execution phases mirroring the backend phases.",
    points: [
      "Phase 1 — Foundation: Next.js setup, routing, global styles, layout",
      "Phase 2 — Auth UI: login form, register form, NDA modal, dashboard",
      "Phase 3 — Download UI: warning dialog, key input field, file stream",
      "Phase 4 — Landing + Admin: all 9 landing sections, admin dashboard",
    ],
  },
  fe_tasks: {
    title: "frontend/tasks/ — Task Directory",
    badge: "@block TASK [phase].[n]",
    intent: "Individual locked task files — one per frontend implementation unit.",
    points: [
      "task_index.md — master index of all frontend tasks",
      "phase-1/ — Foundation: project setup, layout, globals",
      "phase-2/ — Auth: forms, cookies, session, dashboard",
      "phase-3/ — Download: warning dialog, key input, stream handler",
      "phase-4/ — Landing + Admin: all landing sections, admin panel",
    ],
  },
  fe_task_idx: {
    title: "frontend/tasks/task_index",
    badge: "@index frontend_tasks",
    intent: "Master index of all frontend implementation tasks.",
    points: [
      "Tasks organized by phase",
      "Each task specifies context, expected output, and acceptance criteria",
      "Locked after approval — deviation must be flagged, not silently corrected",
    ],
  },
};

const PHASE_MAP: Record<string, { name: string; desc: string }> = {
  be_p1: { name: "Phase 1 — Foundation",      desc: "Project init, env config, DB schema, table creation (tasks 1.1–1.5)" },
  be_p2: { name: "Phase 2 — Authentication",  desc: "Register endpoint, login, JWT issuance, auth middleware (tasks 2.1–2.4)" },
  be_p3: { name: "Phase 3 — Download",        desc: "Protected endpoint, download token system, event tracking (tasks 3.1–3.2)" },
  be_p4: { name: "Phase 4 — Review",          desc: "Review model, guarded submission endpoint (tasks 4.1–4.2)" },
  be_p5: { name: "Phase 5 — Deploy",          desc: "CORS config, global error handling, production config (tasks 5.1–5.2)" },
  fe_p1: { name: "Phase 1 — Foundation",      desc: "Next.js project setup, routing, layout, global styles" },
  fe_p2: { name: "Phase 2 — Auth UI",         desc: "Login form, register form, NDA modal, protected dashboard" },
  fe_p3: { name: "Phase 3 — Download UI",     desc: "Warning dialog, key input field, file stream handler" },
  fe_p4: { name: "Phase 4 — Landing + Admin", desc: "All 9 landing page sections + admin dashboard" },
};

function getNodeContent(id: string): SpecContent {
  if (SPEC_CONTENT[id]) return SPEC_CONTENT[id];
  const ph = PHASE_MAP[id];
  if (ph) {
    const isBe = id.startsWith("be_");
    return {
      title: `${isBe ? "backend" : "frontend"}/tasks/${id.replace(/^(be|fe)_/, "")}`,
      badge: `@phase  ·  ${ph.name}`,
      intent: ph.desc,
      points: [
        "Tasks are locked after user approval",
        "Each task has explicit acceptance criteria",
        "Deviation from spec must be flagged — silent correction is forbidden",
      ],
    };
  }
  return { title: id, badge: "@block", intent: "Spec file", points: [] };
}

// ── D3 visual helpers ─────────────────────────────────────────────────────────
function nodeR(d: d3.HierarchyNode<TreeNode>): number {
  if (d.depth === 0) return 22;
  if (d.depth === 1 && d.children) return 14;
  if (d.depth === 1) return 7;
  if (d.depth === 2 && d.children) return 9;
  if (d.depth === 2) return 5;
  return 4;
}

function nodeFill(d: d3.HierarchyNode<TreeNode>): string {
  if (d.depth === 0) return "#FF4500";
  if (d.depth === 1 && d.children) return "#0A0A0A";
  if (d.depth === 1) return "#E8E5DF";
  if (d.depth === 2 && d.children) return "#2A2A2A";
  if (d.depth === 2) return "#666";
  const idx = d.parent?.children?.indexOf(d) ?? 0;
  const s = ["#777", "#888", "#999", "#aaa", "#bbb", "#ccc"];
  return s[idx] ?? "#999";
}

function nodeLabelColor(d: d3.HierarchyNode<TreeNode>): string {
  if (d.depth === 0) return "#FF4500";
  if (d.depth === 1 && d.children) return "#1A1A1A";
  return "#777";
}

// ── Folder tree sub-component (tree-folder-structure.tsx pattern) ─────────────
function SLCTreeNode({
  node,
  selectedId,
  depth = 0,
}: {
  node: TreeNode;
  selectedId: string | null;
  depth?: number;
}) {
  const isFolder = !!node.children;
  const isSelected = node.id === selectedId;
  const [expanded, setExpanded] = useState(depth <= 1);

  return (
    <div>
      <div
        role={isFolder ? "button" : undefined}
        tabIndex={isFolder ? 0 : undefined}
        onClick={() => isFolder && setExpanded((v) => !v)}
        onKeyDown={(e) => isFolder && e.key === "Enter" && setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: `6px 14px 6px ${12 + depth * 16}px`,
          cursor: isFolder ? "pointer" : "default",
          background: isSelected ? "rgba(255,69,0,0.09)" : "transparent",
          borderLeft: `2px solid ${isSelected ? "#FF4500" : "transparent"}`,
          userSelect: "none",
        }}
      >
        <LuChevronRight
          size={9}
          style={{
            color: "#555",
            transform: isFolder && expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.18s ease",
            flexShrink: 0,
            visibility: isFolder ? "visible" : "hidden",
          }}
        />
        {isFolder ? (
          <LuFolder
            size={12}
            style={{ color: expanded ? "#FF6030" : "#5A5A5A", flexShrink: 0, transition: "color 0.15s" }}
          />
        ) : (
          <LuFile size={11} style={{ color: isSelected ? "#FF4500" : "#3A3A3A", flexShrink: 0 }} />
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            color: isSelected ? "#FF4500" : isFolder ? "#B8B5AE" : "#4A4A4A",
            fontWeight: isFolder ? 500 : 400,
            lineHeight: 1.65,
          }}
        >
          {node.displayName}
        </span>
      </div>
      {isFolder &&
        expanded &&
        node.children?.map((child) => (
          <SLCTreeNode key={child.id} node={child} selectedId={selectedId} depth={depth + 1} />
        ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SpecGraphSection() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLDivElement>(null);
  const graphPhaseRef = useRef<HTMLDivElement>(null);
  const svgRef        = useRef<SVGSVGElement>(null);
  const clickCbRef    = useRef<(id: string) => void>(() => {});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Keep click callback fresh without re-running the D3 effect
  useEffect(() => {
    clickCbRef.current = (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id));
    };
  });

  // ── D3 force-directed graph ───────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current) return;

    const W = 900, H = 560;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg
      .attr("viewBox", [-W / 2, -H / 2, W, H])
      .attr("width", "100%")
      .attr("height", H)
      .attr("style", "overflow: visible;");

    const root  = d3.hierarchy(SLC_TREE);
    const nodes = root.descendants() as D3Node[];
    const links = root.links() as unknown as D3Link[];

    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force("link",
        d3.forceLink<D3Node, D3Link>(links)
          .id(d => d.data.id)
          .distance(d => {
            const s = d.source as D3Node;
            if (s.depth === 0) return 115;
            if (s.depth === 1) return 75;
            return 50;
          })
          .strength(0.88)
      )
      .force("charge", d3.forceManyBody<D3Node>().strength(-185))
      .force("x", d3.forceX<D3Node>().strength(0.05))
      .force("y", d3.forceY<D3Node>().strength(0.05))
      .force("collide", d3.forceCollide<D3Node>().radius(d => nodeR(d) + 12).strength(0.8));

    const linkSel = svg.append("g")
      .selectAll<SVGLineElement, D3Link>("line")
      .data(links).join("line")
      .attr("stroke", "#C8C4BC")
      .attr("stroke-opacity", 0.55)
      .attr("stroke-width", d => (d.source as D3Node).depth === 0 ? 1.5 : 1);

    const nodeSel = svg.append("g")
      .selectAll<SVGGElement, D3Node>("g")
      .data(nodes).join("g")
      .style("cursor", "pointer");

    // Main circles
    nodeSel.append("circle")
      .attr("class", "node-main")
      .attr("r", nodeR)
      .attr("fill", nodeFill)
      .attr("stroke", d => d.depth === 1 && !d.children ? "#B8B4AE" : "none")
      .attr("stroke-width", 1);

    // Root + dir labels (above node)
    nodeSel.filter(d => d.depth === 0 || (d.depth === 1 && !!d.children))
      .append("text")
      .attr("dy", d => -(nodeR(d) + 8))
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .attr("font-size", d => d.depth === 0 ? 11 : 9)
      .attr("font-weight", "700")
      .attr("fill", nodeLabelColor)
      .attr("pointer-events", "none")
      .attr("user-select", "none")
      .text(d => d.data.displayName);

    // Core doc labels (below node)
    nodeSel.filter(d => d.depth === 1 && !d.children)
      .append("text")
      .attr("dy", d => nodeR(d) + 13)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .attr("font-size", 7.5)
      .attr("fill", "#888")
      .attr("pointer-events", "none")
      .attr("user-select", "none")
      .text(d => d.data.displayName);

    // Depth-2 dir labels (above)
    nodeSel.filter(d => d.depth === 2 && !!d.children)
      .append("text")
      .attr("dy", d => -(nodeR(d) + 7))
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .attr("font-size", 7)
      .attr("font-weight", "600")
      .attr("fill", "#888")
      .attr("pointer-events", "none")
      .attr("user-select", "none")
      .text(d => d.data.displayName);

    // Depth-2 file + depth-3 labels (below)
    nodeSel.filter(d => (d.depth === 2 && !d.children) || d.depth >= 3)
      .append("text")
      .attr("dy", d => nodeR(d) + 12)
      .attr("text-anchor", "middle")
      .style("font-family", "var(--font-mono)")
      .attr("font-size", 6.5)
      .attr("fill", "#AAA")
      .attr("pointer-events", "none")
      .attr("user-select", "none")
      .text(d => d.data.displayName);

    // Interactions
    let dragStartX = 0, dragStartY = 0, wasDragged = false;

    nodeSel.on("click", function(event, d) {
        if (wasDragged) { wasDragged = false; return; }
        clickCbRef.current(d.data.id);
      });

    const drag = d3.drag<SVGGElement, D3Node>()
      .on("start", (event, d) => {
        dragStartX = event.x; dragStartY = event.y;
        wasDragged = false;
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", (event, d) => {
        if (Math.abs(event.x - dragStartX) > 4 || Math.abs(event.y - dragStartY) > 4) wasDragged = true;
        d.fx = event.x; d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
        setTimeout(() => { wasDragged = false; }, 80);
      });

    nodeSel.call(drag);

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (l: D3Link) => l.source.x)
        .attr("y1", (l: D3Link) => l.source.y)
        .attr("x2", (l: D3Link) => l.target.x)
        .attr("y2", (l: D3Link) => l.target.y);
      nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  // ── GSAP: scroll-driven text-zoom explosion → graph reveal ────────────────
  // jQuery pattern translated: tall outer div (360vh) + position:sticky inner
  // (100vh) acts as the "fixed" container; scrollTop drives scale/opacity via
  // GSAP scrub — text zooms from tiny → fills screen → explodes out → graph
  // fades in.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Graph is hidden until headline exits — headline starts at its natural size
      gsap.set(graphPhaseRef.current, { opacity: 0, scale: 0.88 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200vh",
          scrub: 0.15,
        },
      });

      tl
        // Text is already visible at scale:1 — zoom it out as user scrolls
        .to(headlineRef.current, { scale: 22, opacity: 0, duration: 1.2, ease: "none" })
        // Graph fades in as headline exits
        .to(graphPhaseRef.current,
          { opacity: 1, scale: 1, duration: 0.5, ease: "none" },
          0.8
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ height: "250vh", background: "#F0EEE9", position: "relative" }}
    >
      {/* Sticky viewport — holds both phases */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* ── Phase 1: Headline zooms ──────────────────────────────────── */}
        <div
          ref={headlineRef}
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            zIndex: 2, pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.62rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#999", marginBottom: "14px",
          }}>
            03 · The Architecture
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)", fontWeight: 200,
            fontSize: "clamp(3.5rem, 8vw, 8rem)", letterSpacing: "-0.05em",
            lineHeight: 0.9, color: "#0A0A0A", margin: 0,
            textAlign: "center", whiteSpace: "nowrap",
          }}>
            Spec <span style={{ color: "#FF4500" }}>Graph</span>
          </h2>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 300,
            fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)", color: "#777",
            marginTop: "18px", letterSpacing: "-0.01em",
            textAlign: "center", lineHeight: 1.6,
          }}>
            This portal was built with SLC.
            <br />
            <span style={{ color: "#AAA", fontSize: "0.85em" }}>
              Scroll to see the spec that built it.
            </span>
          </p>
        </div>

        {/* ── Phase 2: D3 graph ────────────────────────────────────────── */}
        <div
          ref={graphPhaseRef}
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "20px 40px 12px", zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "4px" }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#999", margin: 0,
            }}>
              03 · Architecture — SLC Spec Graph
            </p>
          </div>

          <div style={{ width: "min(92vw, 900px)", position: "relative", zIndex: 1, willChange: "transform" }}>
            <svg ref={svgRef} />
          </div>

          {/* Instructions + legend */}
          <div style={{
            display: "flex", gap: "20px", marginTop: "4px",
            alignItems: "center", flexWrap: "wrap", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.56rem",
              letterSpacing: "0.18em", textTransform: "uppercase", color: "#FF4500",
            }}>
              Click node to open tree · Drag to explore
            </span>
            <span style={{ width: "1px", height: "10px", background: "#C8C4BC", flexShrink: 0 }} />
            {[
              { color: "#FF4500", label: "Root" },
              { color: "#0A0A0A", label: "Spec dirs" },
              { color: "#888",    label: "Files" },
              { color: "#C0C0C0", label: "Tasks" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.54rem",
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "#999",
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Spec panel ───────────────────────────────────────────────── */}
        <div style={{
          position: "absolute", top: 0, right: 0, bottom: 0,
          width: "min(360px, 92vw)",
          background: "rgba(8, 8, 8, 0.97)",
          backdropFilter: "blur(16px)",
          borderLeft: "1px solid #1A1A1A",
          transform: selectedId ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 20, display: "flex", flexDirection: "column",
        }}>
          {selectedId && (
            <>
              <div style={{
                padding: "16px 18px 12px", borderBottom: "1px solid #1A1A1A",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
              }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.55rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "#FF4500", marginBottom: "4px",
                  }}>
                    SLC Spec Tree
                  </p>
                  <h3 style={{
                    fontFamily: "var(--font-display)", fontWeight: 600,
                    fontSize: "0.85rem", color: "#F0EEE9", margin: 0,
                  }}>
                    {SLC_TREE.displayName} /
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    background: "none", border: "1px solid #2A2A2A",
                    color: "#555", cursor: "pointer", fontSize: "0.75rem",
                    padding: "5px 7px", borderRadius: "3px", flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ overflowY: "auto", flex: 1, padding: "12px 4px" }}>
                <SLCTreeNode node={SLC_TREE} selectedId={selectedId} />
              </div>
              <div style={{ padding: "10px 18px", borderTop: "1px solid #111" }}>
                <p style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.5rem",
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#2A2A2A", margin: 0,
                }}>
                  Built with SLC · WeWise Labs
                </p>
              </div>
            </>
          )}
        </div>

        {/* Backdrop — click outside panel to close */}
        {selectedId && (
          <div
            onClick={() => setSelectedId(null)}
            style={{ position: "absolute", inset: 0, zIndex: 19 }}
          />
        )}
      </div>
    </div>
  );
}
