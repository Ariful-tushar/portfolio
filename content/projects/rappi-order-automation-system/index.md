---
title: Business Operations Automation Pipeline
date: 2023-06-01
summary: A Python service that automates order processing for a live multi-store delivery operation — syncing live status to Google Sheets, routing multi-warehouse fulfillment, and auto-generating customer invoices.
tech: [Python, REST APIs, Google Sheets API, JSON, XPath / lxml]
github: https://github.com/Ariful-tushar/rappi_order_automation_system
demo: ""
featured: true
cover: architecture_diagram.png
gallery: [architecture_diagram.png, workflow_diagram.png]
---

**Repo:** github.com/Ariful-tushar/rappi_order_automation_system
**Role:** Python Developer (design, build, and deployment)
**Type:** Production automation service for a live e-commerce delivery operation

---

## Overview

A Python service that removes manual order handling from a multi-store delivery operation. It continuously watches a delivery-partner API for new orders, pulls customer and product details, keeps a live operational record in Google Sheets, routes each order to the correct warehouse for fulfillment, and generates and emails the customer invoice once the order is complete — all without a human touching the order in between. It runs as a persistent background service with automatic retry and error recovery, and coordinates fulfillment across 9 retail locations mapped to 6 separate warehouses.

---

## Key Features

- **Automated order monitoring** — Polls the delivery-partner API on a continuous cycle, paginates through active orders, and detects new orders automatically by comparing against what's already tracked.
- **Structured data extraction** — Pulls customer info, delivery address, product line items, pricing, and SKUs out of nested JSON API responses and HTML page content (XPath), with safe fallback handling when fields are missing.
- **Live operational tracking in Google Sheets** — Every order, product line, status change, and invoice number is written to and read back from Google Sheets in real time, giving non-technical staff a live dashboard with zero manual entry.
- **Multi-warehouse fulfillment routing** — Automatically maps each order to the correct warehouse based on store location (8 distinct routing rules across locations) and submits a structured fulfillment payload to the warehouse management API.
- **Automated invoicing and delivery** — Looks up each product by SKU in the accounting platform's inventory, generates a compliant invoice, and emails it to the customer automatically once an order is marked complete.
- **Full order lifecycle tracking** — Tracks orders from intake through completion or cancellation, updating status, fulfillment confirmation, and invoice number back into the shared sheet as each stage finishes.
- **Resilient long-running service** — Runs in an infinite polling loop with a 60-second cycle, wrapped in exception handling and automatic restart logic so a single failed API call or network hiccup never stops the pipeline.

---

## How It Works

1. Authenticate with the delivery-partner API and the invoicing platform.
2. Fetch all currently active orders across every tracked store.
3. Extract customer, delivery, and product details for any order not yet on record.
4. Write the new order and product data into Google Sheets.
5. On each cycle, check for orders that have moved to a new status.
6. When an order is marked complete: generate the invoice, place the warehouse fulfillment order, and email the customer.
7. Write the resulting status, invoice number, and fulfillment confirmation back to the sheet.

See the architecture and workflow diagrams above for the system view and step-by-step flow.

---

## Tech Stack & Skills Demonstrated

**Core language & libraries**
Python · `requests` · `gspread` (Google Sheets API) · `lxml` / XPath

**Integration engineering**
REST API integration (GET/POST) across four independent third-party systems · JSON parsing of deeply nested, inconsistent API responses · session/token-based authentication · environment-variable-based credential management

**Data & business logic**
Data normalization and validation across sources · SKU lookup and mapping logic with multi-level fallback · warehouse/location routing rules · order lifecycle and state management

**Engineering practices**
Exception handling and automatic retry at every external call · a persistent, self-recovering service loop suitable for unattended production use · modular design split across ingestion (`main_file.py`), fulfillment (`order_place.py`), and invoicing (`invoice_creator.py`)

---

## Project Structure

```
project/
├── main_file.py          # Order monitoring, data extraction, Google Sheets sync, orchestration
├── order_place.py        # Warehouse routing logic and fulfillment API integration
├── invoice_creator.py    # SKU lookup, invoice generation, and customer email delivery
└── readme.md
```

---

## Impact

- Eliminated manual order entry and status tracking across 9 active retail locations.
- Replaced manual invoice creation with a fully automated, error-checked generation-and-delivery step.
- Gave operations staff a real-time, no-code view of the entire order lifecycle through a live Google Sheet.
