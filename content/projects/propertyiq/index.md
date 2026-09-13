---
title: PropertyIQ — Self-Healing, AI-Scored Real Estate Data Intelligence Pipeline
date: 2025-06-01
summary: A self-healing scraping pipeline that detects broken selectors, has an LLM rewrite them on the fly, and runs a second LLM pass to score and explain every real-estate listing it collects — with full audit logging in PostgreSQL.
tech: [Python, LangChain, LangGraph, Scrapy, Playwright, PostgreSQL, Pydantic, Groq (Llama 3.3)]
github: https://github.com/Ariful-tushar/propertyIQ
demo: ""
featured: true
cover: propertyiq_architecture.png
gallery: [architecture_diagram.png, workflow_diagram.png]
---

**Repo:** github.com/Ariful-tushar/propertyIQ
**Role:** Designer & Developer (architecture, scraping engine, AI agents, data layer)
**Type:** Autonomous real estate data acquisition & analysis agent (personal portfolio project)

---

## Overview

PropertyIQ is a scraping pipeline that fixes itself when a website changes. Instead of a fixed set of XPath/CSS selectors that break the moment a listing site redesigns its HTML, the pipeline detects the failure, hands a trimmed-down version of the page to an LLM, and lets the model write fresh selectors on the fly — then retries automatically. On top of that, every property that makes it through is passed to a second LLM step that scores the listing as a deal, writes a pros/cons summary, and stores both the raw data and the AI's reasoning in PostgreSQL, so nothing about how a decision was reached gets thrown away.

---

## Key Features

- **Automated source discovery** — A dedicated discovery module locates property listing sources and URLs to feed into the scraping pipeline, rather than relying on a hardcoded list of sites.
- **Resilient scraping engine** — Built on Scrapy with Playwright integration (`scrapy-playwright`) for full browser rendering, so JavaScript-heavy listing pages are handled the same as static ones.
- **Self-healing selector generation** — A custom `HtmlReducerForSelectors` engine compresses raw page HTML for LLM consumption: it strips scripts, styles, and tracking noise, keeps only the attributes that matter for writing a selector (`id`, `class`, `data-*`, `aria-*`, `href`), and collapses long runs of repeated sibling elements down to a representative sample — so the model sees the page's real structure without burning tokens on 50 near-identical product rows. When extraction fails, a `SelectorAgent` (LangChain + Groq's Llama 3.3 70B) reads that reduced HTML and returns fresh XPath selectors as validated, structured output — no manual fix required.
- **Schema-validated extraction** — Every scraped record is parsed into a strict Pydantic model (`PropertyItem`) before it's allowed anywhere near the database, catching malformed prices, URLs, or missing fields immediately.
- **AI-driven deal analysis** — A separate LLM pass scores each property (0–100 deal score), assigns a recommendation label, and writes a plain-language summary with structured pros/cons — logged alongside the model name and prompt version used, so results stay reproducible and auditable as prompts evolve.
- **Full pipeline observability** — A dedicated `scrape_logs` table records every run: the URL, extraction method used, whether the LLM was invoked, retry count, and any error type/message — turning "did the scraper work last night" into a one-query answer instead of a guess.
- **Structured, queryable storage** — PostgreSQL schema separates raw listing data (`properties`), AI-derived signals (`property_metadata`), and deal analysis (`property_analysis`) into distinct tables linked by foreign key, keeping scraped facts and AI opinions cleanly separated.
- **Containerized data layer** — Ships with a `docker-compose.yml` that spins up PostgreSQL and auto-applies the schema on first run, so the whole data layer is reproducible with one command.

---

## How It Works

1. **Discover** — identify property listing sources and candidate URLs.
2. **Scrape** — fetch listing pages with Scrapy + Playwright.
3. **Extract** — pull fields out using the current XPath selectors.
4. **Validate** — parse the result into the `PropertyItem` Pydantic schema.
5. **Self-heal (only on failure)** — reduce the page HTML, ask the LLM to regenerate the broken selectors, and retry extraction.
6. **Analyze** — an LLM scores the property, explains the reasoning, and produces a recommendation.
7. **Store & log** — persist the property, its AI signals, and its analysis to PostgreSQL, and write a full record of the run to `scrape_logs`.

See the architecture and workflow diagrams above — the first shows the component view (including the self-healing feedback loop), the second the linear step-by-step flow.

---

## Tech Stack & Skills Demonstrated

**Core language & data layer**
Python · PostgreSQL (`psycopg2`) · Pydantic / `pydantic-settings` · Docker Compose

**Scraping & browser automation**
Scrapy · Playwright (`scrapy-playwright`) · `lxml` / XPath · `parsel` · `cssselect` · BeautifulSoup (for the HTML-reduction step)

**AI / agentic engineering**
LangChain · LangGraph (+ checkpointing) · LangSmith · Groq (Llama 3.3 70B via `langchain-groq`) · `litellm` · OpenAI SDK · `instructor` for structured LLM output · Model Context Protocol tooling (`fastmcp`, `mcp`) · prompt-versioned, structured LLM output for reproducible AI decisions

**Engineering practices**
Self-healing failure recovery instead of hard-coded selectors that silently break · strict schema validation at the data boundary · full run-level observability and audit logging · clean separation of raw data, AI-derived signals, and AI analysis in the schema · modular architecture split across discovery, scraping, selector generation, LLM analysis, and storage layers

---

## Project Structure

```
propertyIQ/
├── discovery/            # Finds property listing sources & URLs
├── scrapy_app/           # Scrapy + Playwright scraping spiders
├── selector_generator/   # HTML reduction for LLM-based selector writing
├── llm/                  # LLM agents — selector self-healing, deal analysis
├── schemas/              # Pydantic models (PropertyItem, SelectorResult, ...)
├── db/                   # PostgreSQL schema (properties, analysis, scrape_logs)
├── config/ / configs/    # Pipeline & environment configuration
├── scripts/              # Pipeline entry points / orchestration
├── tests/                # Test suite
└── docker-compose.yml    # One-command PostgreSQL data layer
```

---

## Impact

- Removes the single biggest maintenance cost of any scraping project — manually rewriting selectors every time a target site changes its markup — by having the pipeline repair itself.
- Turns raw listing data into a scored, explained recommendation automatically, rather than leaving deal evaluation as a manual step.
- Gives full audit visibility into every scrape run (method used, retries, LLM involvement, errors), making the pipeline debuggable in production instead of a black box.
