<div align="center">

# 🧠 AegisBrain

### AI-Powered Industrial Knowledge Intelligence Platform

**Unified Asset & Operations Brain for Heavy Industry**

[![Track](https://img.shields.io/badge/Hackathon-ET%20AI%202026-blue?style=for-the-badge)](https://hackathon.example.com)
[![Track](https://img.shields.io/badge/Track%208-Industrial%20Knowledge-blueviolet?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-orange?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

<br/>

*Solving knowledge fragmentation in asset-intensive industries — where engineers spend 35% of their time just searching for information.*

</div>

---

## 📌 Problem Statement

> **Track 8 — AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain**
>
> A 2024 McKinsey survey found that professionals in asset-intensive industries spend **35% of their working hours** searching for information, clarifying instructions, or recreating documents. In India, the average large plant operates across **7 to 12 disconnected document systems** — P&IDs in one place, maintenance work orders in another, operating procedures in a third. This fragmentation contributes to **18–22% of unplanned downtime** in Indian heavy industry. Additionally, **25% of experienced industrial engineers** will retire within the next decade, taking decades of undocumented operational knowledge with them.

**Challenge:** Build an AI-powered platform that ingests heterogeneous documents (engineering drawings, maintenance records, safety procedures, inspection reports) across structured and unstructured formats, and makes their collective intelligence **queryable, actionable, and continuously updated**.

---

## 🚀 Our Solution

**AegisBrain** is a premium web-based dashboard that unifies fragmented industrial documents, active sensor data, and safety compliance rules into a single intelligent operations layer.

### Core Modules

| Module | What It Does |
|--------|-------------|
| 📊 **Operations Dashboard** | Real-time KPIs, live sensor readings (Methane, Temperature, Pressure), and event timeline |
| 📄 **Universal Document Ingestion** | Drag-and-drop PDF upload with real-time OCR (via PDF.js), entity extraction, and 4-step AI processing pipeline |
| 🕸️ **Interactive Knowledge Graph** | D3.js force-directed graph mapping equipment → sensors → regulations → SOPs → maintenance records → permits |
| 💬 **Expert QA Copilot (RAG)** | Conversational AI answering domain queries with source citations — supports both offline simulation and live Gemini API |
| 🛡️ **Compliance & Safety Auditor** | Automated cross-referencing of active permits and sensor readings against OISD, Factory Act, PESO, and BIS standards |

---

## 🖥️ Screenshots

### Operations Dashboard
> Live sensor bars, KPI cards, and event timeline for plant-wide monitoring.

### Knowledge Graph
> Interactive node-link visualization connecting 20+ entities across 7 categories.

### Expert Copilot
> RAG-powered chat with source citations from indexed industrial documents.

### Safety Auditor
> Automated compliance alerts with severity-coded cards (Critical / Warning / Info).

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────┐
│                   AegisBrain UI                  │
│         (HTML5 + Vanilla CSS + Vanilla JS)       │
├──────────────┬───────────────┬───────────────────┤
│  Doc Ingest  │  Knowledge    │  Expert Copilot   │
│  (PDF.js)    │  Graph (D3)   │  (RAG Engine)     │
├──────────────┴───────────────┴───────────────────┤
│              Compliance Auditor                  │
│     (Rule Engine against OISD/Factory Act)       │
├──────────────────────────────────────────────────┤
│          Mock Data / Simulated Telemetry         │
│     (or Live Gemini API via optional API key)    │
└──────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox)
- Python 3.x (only for local server)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/gatoj/AegisBrain.git
cd AegisBrain

# Start a local server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

> **No npm, no build step, no dependencies to install.** Just open and run.

### Enable Live RAG (Optional)
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Paste the key in the sidebar under **"AI Engine Mode"**
3. The Copilot will switch from Offline Simulator to **Live Gemini API** mode

---

## 📁 Project Structure

```
AegisBrain/
├── index.html          # Main UI layout (5 tabs, semantic HTML5)
├── styles.css          # Premium dark theme with glassmorphism & animations
├── app.js              # Application controller (tabs, ingestion, chat, audit)
├── knowledgeGraph.js   # D3.js force-directed graph engine
├── ragEngine.js        # RAG logic — PDF parsing, retrieval, Gemini API
├── mockData.js         # Industrial knowledge base (20 entities, 6 docs, 4 rules)
├── generate_pdf.py     # Script to generate project proposal PDF
├── .gitignore          # Standard ignores for Node, IDE, OS files
└── README.md           # This file
```

---

## 🎯 Track 8 Requirement Mapping

| Hackathon Requirement | AegisBrain Feature | Status |
|---|---|---|
| Universal Document Ingestion & Knowledge Graph Agent | Doc Ingestion + Knowledge Graph tabs | ✅ |
| Expert Knowledge Copilot (RAG with citations) | Expert Copilot tab with source tags | ✅ |
| Maintenance Intelligence & RCA Agent | Work orders, inspection records in graph + copilot | ✅ |
| Quality & Regulatory Compliance Intelligence | Safety Auditor with OISD/Factory Act/PESO rules | ✅ |
| Lessons Learned & Failure Intelligence | Inspection NCRs and overdue calibration alerts | ✅ |

---

## 🧰 Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5 / CSS3 / Vanilla JS** | Core application (zero framework dependency) |
| **D3.js v7** | Interactive force-directed Knowledge Graph |
| **PDF.js** | Client-side PDF text extraction |
| **Google Gemini API** | Optional live RAG generation (free tier) |
| **Inter (Google Fonts)** | Modern typography |

---

## 📊 Key Metrics (Evaluation Focus)

| Metric | Value |
|---|---|
| Entity Extraction | Equipment tags, parameters, regulations, personnel |
| Knowledge Graph Nodes | 20 entities across 7 categories |
| Compliance Rules | 4 automated checks (OISD, IS 2062, PESO, Factory Act) |
| Time-to-Answer | < 1 second (simulator) / < 5 seconds (live API) |
| Documents Indexed | 6 pre-loaded + unlimited user uploads |

---

## 👥 Team

| Name | Role |
|---|---|
| **Gatoj** | Developer |

---

## 📜 License

This project is built for the **ET AI Hackathon 2026** and is released under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ for ET AI Hackathon 2026**

</div>
