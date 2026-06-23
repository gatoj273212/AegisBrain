<div align="center">

# 🧠 AegisBrain

### AI-Powered Industrial Knowledge Intelligence Platform

*Unified Asset & Operations Brain for Heavy Industry*

[![Hackathon](https://img.shields.io/badge/ET%20AI%20Hackathon-2026-blue?style=for-the-badge)](https://hackathon.example.com)
[![Track](https://img.shields.io/badge/Track%208-Industrial%20Knowledge%20Intelligence-blueviolet?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20Vanilla%20JS-orange?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**[Live Demo](#quick-start) · [Architecture](#architecture) · [Features](#core-modules) · [Track Mapping](#track-8-requirement-mapping)**

</div>

---

## 📌 The Problem

In asset-intensive industries, knowledge is everywhere — and nowhere.

A 2024 McKinsey survey found that professionals in heavy industry spend **35% of their working hours** searching for information, clarifying instructions, or recreating documents that already exist somewhere. In India, the average large plant operates across **7 to 12 disconnected document systems** — P&IDs in one place, maintenance work orders in another, operating procedures in a third.

This fragmentation has a direct cost:

- **18–22% of unplanned downtime** in Indian heavy industry is linked to knowledge gaps
- **25% of experienced engineers** will retire within the decade, taking decades of undocumented operational knowledge with them
- Compliance failures go undetected because no single system cross-references live sensor data against safety regulations

**AegisBrain** is built to fix this.

---

## 🚀 Solution Overview

AegisBrain is a premium, browser-based intelligence platform that unifies fragmented industrial documents, live sensor data, and safety compliance rules into a single queryable operations layer — with zero installation overhead.

It turns siloed knowledge into a connected, AI-powered brain for your plant.

### Core Modules

| Module | Description |
|--------|-------------|
| 📊 **Operations Dashboard** | Real-time KPIs, live sensor readings (Methane, Temperature, Pressure), and a plant-wide event timeline |
| 📄 **Universal Document Ingestion** | Drag-and-drop PDF upload with real-time OCR via PDF.js, entity extraction, and a 4-step AI processing pipeline |
| 🕸️ **Interactive Knowledge Graph** | D3.js force-directed graph mapping equipment → sensors → regulations → SOPs → maintenance records → permits |
| 💬 **Expert QA Copilot (RAG)** | Conversational AI that answers domain queries with inline source citations — works offline or with a live Gemini API key |
| 🛡️ **Compliance & Safety Auditor** | Automated cross-referencing of active permits and sensor readings against OISD, Factory Act, PESO, and BIS standards |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      AegisBrain UI                       │
│          (HTML5 + Vanilla CSS + Vanilla JS)              │
├───────────────┬────────────────┬─────────────────────────┤
│  Doc Ingest   │  Knowledge     │  Expert Copilot         │
│  (PDF.js)     │  Graph (D3.js) │  (RAG Engine)           │
├───────────────┴────────────────┴─────────────────────────┤
│                  Compliance Auditor                      │
│        (Rule engine: OISD / Factory Act / PESO)         │
├──────────────────────────────────────────────────────────┤
│          Mock Data Layer / Simulated Telemetry           │
│       (or Live Gemini API via optional API key)          │
└──────────────────────────────────────────────────────────┘
```

**Design philosophy:** Zero framework, zero build step. The entire platform runs from static files served by any HTTP server. Every module is independently replaceable.

---

## ⚡ Quick Start

### Prerequisites

- Any modern browser (Chrome, Edge, Firefox)
- Python 3.x for the local server

### Run Locally

```bash
git clone https://github.com/gatoj/AegisBrain.git
cd AegisBrain
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

> No npm. No build step. No dependencies to install. Open and run.

### Enable Live RAG (Optional)

By default, AegisBrain runs in **Offline Simulator** mode using a pre-loaded knowledge base. To switch to live AI generation:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Paste it in the sidebar under **AI Engine Mode**
3. The Expert Copilot will immediately switch to **Live Gemini API** mode

---

## 📁 Project Structure

```
AegisBrain/
├── index.html          # Main layout — 5-tab semantic HTML5 shell
├── styles.css          # Dark theme with glassmorphism effects and animations
├── app.js              # Application controller (tabs, ingestion, chat, audit)
├── knowledgeGraph.js   # D3.js force-directed graph engine
├── ragEngine.js        # RAG logic — PDF parsing, retrieval, Gemini API calls
├── mockData.js         # Pre-loaded knowledge base (20 entities, 6 docs, 4 rules)
├── generate_pdf.py     # Utility to generate project proposal PDF
└── README.md
```

---

## 🎯 Track 8 Requirement Mapping

| Hackathon Requirement | AegisBrain Implementation | Status |
|---|---|---|
| Universal Document Ingestion & Knowledge Graph Agent | Doc Ingestion tab with PDF.js OCR + Knowledge Graph tab with D3 force layout | ✅ |
| Expert Knowledge Copilot (RAG with citations) | Expert Copilot tab — RAG pipeline with inline source attribution | ✅ |
| Maintenance Intelligence & RCA Agent | Work orders and inspection records modelled as graph nodes; queryable via Copilot | ✅ |
| Quality & Regulatory Compliance Intelligence | Safety Auditor tab with OISD, Factory Act, and PESO automated checks | ✅ |
| Lessons Learned & Failure Intelligence | Inspection NCRs and overdue calibration alerts surfaced in Auditor and graph | ✅ |

---

## 📊 Key Metrics

| Metric | Value |
|---|---|
| Pre-loaded entities | 20 across 7 categories |
| Pre-loaded documents | 6 (+ unlimited user uploads) |
| Automated compliance rules | 4 (OISD, IS 2062, PESO, Factory Act) |
| Time to answer (offline) | < 1 second |
| Time to answer (live API) | < 5 seconds |
| Supported upload formats | PDF (with OCR) |

---

## 🧰 Tech Stack

| Technology | Role |
|---|---|
| HTML5 / CSS3 / Vanilla JS | Core application — no framework dependency |
| D3.js v7 | Force-directed Knowledge Graph |
| PDF.js | Client-side PDF text extraction and OCR |
| Google Gemini API | Optional live RAG generation (free tier) |
| Inter (Google Fonts) | Typography |

---

## 👥 Team

| Name | Role |
|---|---|
| **Gatoj** | Solo Developer |

---

## 📜 License

Released under the [MIT License](LICENSE).  
Built for **ET AI Hackathon 2026** — Track 8: AI for Industrial Knowledge Intelligence.

---

<div align="center">

*Built with ❤️ by Gatoj for ET AI Hackathon 2026*

</div>
