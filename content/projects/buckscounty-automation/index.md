---
title: AI-Powered Real Estate & Legal Data Automation Pipeline
date: 2024-09-01
summary: A Python pipeline that finds high-value real estate leads by cross-referencing public legal case records with MLS ownership data — using Playwright browser automation and LLM-assisted parsing to verify long-term property owners.
tech: [Python, Playwright, SeleniumBase, Groq API (LLM), Pandas, lxml, Requests]
github: https://github.com/Ariful-tushar/buckscounty_automation
demo: ""
featured: true
cover: architecture_diagram.png
gallery: [architecture_diagram.png]
---

## Overview

A Python-based automation pipeline that identifies high-value real estate leads by
combining public legal records, search engine data, and MLS property databases. It
automates the end-to-end workflow of discovering property owners involved in legal
cases and verifying their ownership duration through MLS records — integrating
browser automation, AI-assisted data parsing, and multi-source data collection to
generate structured datasets for lead generation and market analysis.

## Key Features

- **Playwright-powered browser automation** for authenticated data extraction from the BrightMLS platform
- **AI-assisted data parsing using LLMs** to extract structured address data from unstructured search engine results
- Automated scraping of legal case records from the Bucks County ProPublic portal
- Multi-source data integration combining legal records, search engines, and MLS property databases
- Fault-tolerant automation pipeline with exception handling and long-running monitoring

## How It Works

1. **Legal case scraping** — Extracts legal case records and involved parties from the Bucks County ProPublic portal.
2. **Address discovery** — Uses automated search engine queries and AI-assisted parsing to discover missing addresses for individuals listed in legal filings.
3. **Ownership verification** — Logs into the BrightMLS platform using Playwright automation to verify property ownership duration and ownership history.
4. **Data structuring** — Normalizes addresses and compiles verified datasets containing owner information, property details, and ownership timelines.

## Tech Stack

Python · Playwright · SeleniumBase (undetected Chrome) · Requests · lxml · Pandas · Groq API (LLM) · DuckDuckGo Search · Google Search · `usaddress`

## Project Structure

```
project/
├── main_scraper.py       # Pipeline orchestrator
├── bright_mls.py         # Playwright automation for BrightMLS ownership verification
├── search_address.py     # AI-assisted address discovery and parsing
├── filters.config        # Configuration for credentials and filters
├── zipcodes.csv          # Geographic filters for targeted ZIP codes
└── readme.md
```

## Output

Generates a structured dataset (`output.csv`) containing owner names, verified
property addresses, ownership duration, legal case references, and representative
contact information — used for real estate lead generation, market analysis, and
legal data insights.
