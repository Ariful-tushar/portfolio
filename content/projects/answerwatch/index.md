---
title: AnswerWatch — Agentic GEO Monitoring Platform
date: 2026-10-26
summary: A multi-agent system that monitors what AI assistants (ChatGPT-class models, Gemini) actually say about a company every day, scores every answer against a human-verified truth, root-causes every wrong answer back to a source, and tracks competitive positioning — fully multi-tenant, running on free-tier infrastructure end to end.
tech: [Python, FastAPI, LangChain, LangGraph, Pydantic v2, PostgreSQL + pgvector, React, TypeScript, GitHub Actions]
github: https://github.com/Ariful-tushar/agentic_geo
demo: https://answerwatch-jade.vercel.app/
featured: true
cover: cover.png
gallery: [accuracy-details.png, competitors.png, ai-readiness.png, faq.png]
---

**Repo:** github.com/Ariful-tushar/agentic_geo
**Role:** Solo developer (multi-agent backend, RAG pipeline, dashboard, deployment)
**Type:** Personal project — Generative Engine Optimization (GEO) monitoring platform

---

## Overview

Millions of people now ask AI assistants factual questions about companies — "Who is the CEO?", "How big is this company?", "Who are the leading suppliers in this industry?" Those answers are frequently wrong, outdated, or simply absent, and no company today has an automated way to know what AI is telling the public about them, let alone why an answer is wrong or how to fix it at the source.

AnswerWatch is a multi-agent system that closes that loop: it asks real AI engines a company's own fixed set of questions every morning, scores every answer against a human-verified correct answer, investigates *why* any wrong answer is wrong by checking the sources the AI actually cited, and turns that into one concrete, actionable fix. It's built multi-tenant from day one — a company profile is fully data-driven (its questions, competitors, knowledge sources), so a second company (Valtra) was onboarded after the system was built around the first (Kemira) with zero code changes.

---

## The Four Agents

Each agent does one job well, reading and writing a shared database rather than calling each other directly:

- **Ax (main agent) — daily monitoring and scoring.** Asks the company's fixed questions to a live-web-search model (via Groq), a memory-only model (Gemini), and the system's own RAG answer built from the company's public pages. Scores every answer with an AI judge that must quote the exact sentence its verdict is based on — so every score is human-checkable, not a black box — while numeric facts (revenue, headcount, founding year) are validated by code against a tolerance, overriding the AI judge. For every wrong or partial answer, it runs an automated investigation: checks the AI's cited sources, then Wikipedia, then the company's own site, and gives one concrete fix (e.g. "update this Wikipedia page").
- **Competitor agent — competitive positioning.** Watches open-ended questions with no single correct answer (e.g. "who are the leading suppliers in this market?"), flags when a competitor is named ahead of the company or the company is missing entirely, and investigates using only the sources the AI itself cited — never scraping competitor sites directly. Fully idempotent: a retried run never duplicates analysis, and temporary fetch failures are retried while permanent ones (404, robots.txt block) resolve as "no evidence" instead of retrying forever.
- **FAQ agent — content gap filling.** Reads real public questions about the company's industry, filters out irrelevant ones with an AI relevance check, and drafts a grounded answer using only the company's own verified knowledge base — never inventing content. Nothing is auto-published; drafts sit in the dashboard for a human to review and copy.
- **Support agent — AI-readiness check.** Takes any URL from a company's site and checks exactly how many of the company's standard questions an AI could answer using only that page's text, returning a concrete score plus specific missing facts and actionable suggestions — GEO guidance, not generic SEO advice.

Plus: automated change-detection alerts (accuracy dropped/improved, company dropped from an answer, a competitor overtook it), a daily summary email, and a real-time alert email when something changes unexpectedly.

---

## Technical Architecture

- **Backend:** Python 3.12 (uv-managed) · FastAPI · every request/response and LLM structured output validated through Pydantic v2 before it's trusted or stored, so malformed AI output can't silently corrupt the database.
- **Agent orchestration:** LangChain + LangGraph — each agent is a graph of small, single-purpose, idempotent nodes (ask → judge → score → investigate → alert), so a daily run interrupted mid-way (e.g. by a rate limit) resumes from where it left off on retry instead of duplicating work.
- **Database:** PostgreSQL 16 with pgvector for embeddings, via SQLAlchemy 2 (async) + Alembic migrations, psycopg 3.
- **RAG:** a company's public pages are fetched, chunked (~1,600 chars, paragraph-aware, with overlap), embedded with Gemini's embedding model at 768 dimensions, and stored in a per-company pgvector collection via langchain-postgres.
- **AI models:** a Groq-hosted model with live web search and Gemini (memory-only) as the two "tested engines," plus Gemini (Groq as fallback) for every internal AI role — judging, summarizing, drafting, relevance-checking. All free-tier for this demo.
- **Fetching:** a polite, rate-limited (1 req/sec/domain) fetcher on httpx + selectolax that respects robots.txt, caches pages, and stores only extracted text, never raw HTML.
- **Frontend:** React 19 + Vite + TypeScript, Tailwind + shadcn/ui, Recharts, TanStack Query, React Router — fully responsive to phone width.
- **Email:** Gmail SMTP with an app password, HTML + plain-text templates, full send logging.
- **Scheduler:** GitHub Actions, cron daily (~07:15 Europe/Helsinki) plus manual dispatch per agent or company — GitHub Actions is also what actually executes the fetch/embed/agent code, writing straight to the database; the API only dispatches the job.

**Deployment — entirely on free tiers, no card required:** database on Neon (Postgres + pgvector, Frankfurt), API on Render (Docker), dashboard on Vercel, scheduling/compute on GitHub Actions. All secrets live as GitHub Actions secrets / Render environment variables, never in the repo.

---

## Dashboard

Overview (combined accuracy trend across engines + RAG, today vs. yesterday, latest alerts) · Accuracy details (a question × day grid where any cell opens the AI's exact answer, the judge's quote and reasoning, citations, and the "why" finding side by side with the previous day) · Competitors (mention-rate chart + event history) · Alerts · FAQ (drafted answers with copy buttons) · AI-readiness (run a live check, see score + suggestions) · Settings and Setup (onboard a new company via form or a single YAML import).

---

## Known Limitations (stated transparently on the product's own About page)

- Built on free-tier AI models only (Groq, Gemini) for cost reasons — a production deployment would use stronger, paid models for daily monitoring accuracy.
- The AI judge is itself an AI, which is exactly why every verdict shows its quote and reasoning rather than asking for blind trust.
- "Why" findings are the most likely cause, not formal proof.
- The FAQ agent's source of "new public questions" is currently a single demo page rather than a live internet source — a deliberate zero-budget MVP simplification.
- Questions and competitors are fixed once a company profile is created, by design, to keep day-over-day accuracy history comparable; adding to them is supported, editing existing ones isn't, in this version.

---

## Future Improvements

Swap in paid, higher-accuracy engines (ChatGPT with browsing, Perplexity, Gemini with search grounding) for production monitoring; replace the static FAQ demo page with a real live source of public questions; add a safe, versioned way to edit or retire questions without breaking historical comparisons; real per-company authentication instead of the current admin-token model; Slack/Teams alert channels; a "fix tracker" that re-verifies a suggested fix automatically; keyless cloud secrets (Azure Key Vault + GitHub OIDC); and sentiment detection in the competitor agent, not just ranking position.

---

## Impact

- Turns "I have no idea what AI is telling people about my company" into a daily, scored, explainable answer — with every AI judge verdict backed by a quoted sentence so a human can verify it rather than trust it blindly.
- Automates root-cause investigation for wrong answers down to one concrete fix, instead of leaving "why is the AI wrong about us" as a manual, ad-hoc question.
- Proven multi-tenant in practice, not just in design: a second, unrelated company was onboarded after the system was built, with zero code changes.
