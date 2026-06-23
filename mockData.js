// ============================================================
// AegisBrain — Mock Data & Industrial Knowledge Base
// Track 8: AI for Industrial Knowledge Intelligence
// ============================================================

window.AegisData = {

    // ---------- KNOWLEDGE GRAPH ----------
    graph: {
        nodes: [
            // --- Equipment (group 1) ---
            { id: "COB-01", label: "Coke Oven Battery 1", group: 1, type: "Equipment", status: "Operational", desc: "Primary coke oven battery producing metallurgical coke. 67 ovens, capacity 0.8 MTPA." },
            { id: "COB-02", label: "Coke Oven Battery 2", group: 1, type: "Equipment", status: "Maintenance", desc: "Secondary battery currently undergoing scheduled refractory maintenance." },
            { id: "BF-01", label: "Blast Furnace 1", group: 1, type: "Equipment", status: "Operational", desc: "Ironmaking blast furnace, 4060 m³ working volume, 2.5 MTPA capacity." },

            // --- Sensors (group 2) ---
            { id: "GS-101", label: "Gas Sensor GS-101", group: 2, type: "Sensor", status: "Warning", desc: "Methane sensor on COB-01 oven top. Current reading: 1.2% CH₄ (threshold: 1.0%)." },
            { id: "TS-201", label: "Temp Sensor TS-201", group: 2, type: "Sensor", status: "Normal", desc: "Thermocouple on BF-01 stave cooling. Current: 78°C (normal range: 40–120°C)." },
            { id: "PS-301", label: "Pressure Sensor PS-301", group: 2, type: "Sensor", status: "Normal", desc: "Coke oven gas main pressure. Current: 8.2 mmWC." },

            // --- Valves / Sub-equipment (group 3) ---
            { id: "V-202", label: "Valve V-202", group: 3, type: "Valve", status: "Operational", desc: "Blast furnace gas isolation valve. Last maintained: 12-May-2026." },
            { id: "V-105", label: "Valve V-105", group: 3, type: "Valve", status: "Operational", desc: "Coke oven gas bypass valve. Installed: Jan 2024." },

            // --- Regulations (group 4) ---
            { id: "OISD-150", label: "OISD-150", group: 4, type: "Regulation", desc: "Design & Safety Requirements for Operating Petroleum Product Installations. Covers hot work permits, gas-free certification." },
            { id: "FACTORY-ACT", label: "Factory Act 1948", group: 4, type: "Regulation", desc: "Indian Factory Act governing worker safety, working hours, hazardous processes." },
            { id: "PESO-REG", label: "PESO Guidelines", group: 4, type: "Regulation", desc: "Petroleum and Explosives Safety Organisation rules for gas storage and handling." },
            { id: "IS-2062", label: "IS 2062:2011", group: 4, type: "Standard", desc: "BIS standard for hot rolled low, medium & high tensile structural steel." },

            // --- Procedures (group 5) ---
            { id: "SOP-COB-01", label: "SOP: Coke Oven Startup", group: 5, type: "Procedure", desc: "Standard operating procedure for coke oven battery cold start. 42 steps, last revised Mar 2026." },
            { id: "SOP-BF-BLOWDOWN", label: "SOP: BF Blow-Down", group: 5, type: "Procedure", desc: "Emergency blast furnace blow-down procedure. Critical safety document." },

            // --- Maintenance Records (group 6) ---
            { id: "WO-4021", label: "Work Order #4021", group: 6, type: "WorkOrder", desc: "Replace primary seal on V-202. Completed 12-May-2026. Technician: A. Sharma." },
            { id: "WO-4035", label: "Work Order #4035", group: 6, type: "WorkOrder", desc: "Calibrate GS-101 methane sensor. Due: 28-Jun-2026. Status: Pending." },
            { id: "IR-2026-07", label: "Inspection Report #07", group: 6, type: "Inspection", desc: "Annual safety inspection of COB-01. 3 minor NCRs identified, 1 major NCR on gas ducting." },

            // --- Permits (group 7) ---
            { id: "WP-988", label: "Permit: Hot Work WP-988", group: 7, type: "Permit", status: "Active", desc: "Welding permit for structural repair near COB-01 oven top platform. Valid 23-Jun to 25-Jun-2026." },
            { id: "CP-112", label: "Permit: Confined Space CP-112", group: 7, type: "Permit", status: "Active", desc: "Confined space entry for BF-01 stave inspection. Valid 23-Jun-2026." }
        ],
        links: [
            // Equipment → Sensors
            { source: "GS-101", target: "COB-01", relation: "Monitors" },
            { source: "TS-201", target: "BF-01", relation: "Monitors" },
            { source: "PS-301", target: "COB-01", relation: "Monitors" },

            // Equipment → Valves
            { source: "V-202", target: "BF-01", relation: "Component Of" },
            { source: "V-105", target: "COB-01", relation: "Component Of" },

            // Equipment → Regulations
            { source: "OISD-150", target: "COB-01", relation: "Governs Safety" },
            { source: "OISD-150", target: "BF-01", relation: "Governs Safety" },
            { source: "FACTORY-ACT", target: "COB-01", relation: "Governs Labour" },
            { source: "FACTORY-ACT", target: "BF-01", relation: "Governs Labour" },
            { source: "PESO-REG", target: "COB-01", relation: "Governs Gas Handling" },
            { source: "IS-2062", target: "BF-01", relation: "Material Spec" },

            // SOPs → Equipment
            { source: "SOP-COB-01", target: "COB-01", relation: "Applies To" },
            { source: "SOP-BF-BLOWDOWN", target: "BF-01", relation: "Applies To" },

            // Work Orders → Equipment/Valves
            { source: "WO-4021", target: "V-202", relation: "Repair Record" },
            { source: "WO-4035", target: "GS-101", relation: "Calibration Due" },

            // Inspection → Equipment
            { source: "IR-2026-07", target: "COB-01", relation: "Inspected" },

            // Permits → Equipment
            { source: "WP-988", target: "COB-01", relation: "Active On" },
            { source: "CP-112", target: "BF-01", relation: "Active On" }
        ]
    },

    // ---------- RAG INDEX (Pre-loaded knowledge base) ----------
    ragIndex: [
        {
            id: "oisd150",
            title: "OISD-150: Safety Standard for Hot Work",
            pages: "Section 4.2, Page 18-19",
            content: "Section 4.2: Hot Work Permits. No hot work (including welding, cutting, or grinding) shall be permitted within 15 metres of any location where flammable gas concentration exceeds 1% of LEL. A valid gas-free certificate must be obtained from the safety department before commencing hot work. The certificate is valid for a maximum of 8 hours, after which re-testing is mandatory. All hot work permits must be counter-signed by the area shift-in-charge and the safety officer. Fire extinguishers (minimum 2 × 9kg DCP) must be stationed within 5 metres of the hot work location. A fire watch must be maintained during and for 30 minutes after completion of hot work."
        },
        {
            id: "sop-cob",
            title: "SOP-COB-01: Coke Oven Battery Startup Procedure",
            pages: "Steps 1-42, All Pages",
            content: "Step 1: Confirm all gas isolation valves (V-105, V-106, V-107) are in CLOSED position. Step 2: Verify gas-free certificate from safety dept for oven battery area. Step 3: Ensure all bypass dampers are in OPEN position. Step 4: Check coke oven gas (COG) main pressure via PS-301 (must read < 2 mmWC before startup). Step 8: Open pilot gas supply valve V-105 slowly (quarter-turn increments). Step 12: Monitor GS-101 for methane concentration — abort startup if reading exceeds 0.5% during ignition phase. Step 20: Confirm oven crown temperature reaches 1050°C within 4 hours. Step 35: Transfer heating from pilot gas to mixed gas when oven temp stabilises above 1100°C. Step 42: Log battery operational status in DCS and notify control room."
        },
        {
            id: "wo-4021",
            title: "Work Order #4021: V-202 Seal Replacement",
            pages: "1 page",
            content: "Work Order #4021. Asset: Valve V-202 (BF Gas Isolation). Problem: Primary graphite seal degradation causing minor gas seepage detected during routine patrol on 10-May-2026. Action Taken: Replaced primary seal with Klinger graphite gasket (Part# KLG-450-SS). Pressure tested to 15 bar — no leaks detected. Secondary seal inspected — satisfactory condition, estimated remaining life 18 months. Completed: 12-May-2026. Technician: A. Sharma, Maintenance Fitter Grade-1. Supervisor: R. Patel. Total downtime: 6 hours."
        },
        {
            id: "factory-act",
            title: "Factory Act 1948 — Key Safety Provisions",
            pages: "Sections 21-41",
            content: "Section 21: Fencing of machinery — all moving parts must be securely fenced. Section 22: Work on near machinery in motion — only specially trained adult male workers. Section 36: Maximum daily working hours — 9 hours per day, 48 hours per week. Section 38: Weekly holidays mandatory. Section 41A: Hazardous processes — mandatory medical examinations, safety training, and PPE. Penalties for non-compliance: imprisonment up to 2 years and/or fine up to ₹2,00,000."
        },
        {
            id: "ir-2026-07",
            title: "Inspection Report #IR-2026-07: COB-01 Annual Safety Audit",
            pages: "12 pages",
            content: "Annual safety inspection of Coke Oven Battery 1 conducted on 15-Mar-2026. Inspector: M.K. Reddy (DISH). Findings: NCR-01 (Minor): 3 fire extinguishers in oven top area past service date. NCR-02 (Minor): Safety signage faded on gas ducting walkway. NCR-03 (Minor): PPE compliance 87% (target 95%). NCR-04 (MAJOR): Gas ducting flanges on collector main showing corrosion — thickness reduced to 4.2mm (minimum required: 5.0mm per IS 2062). Recommendation: Immediate thickness survey of all collector main flanges; replace sections below minimum wall thickness within 60 days. Overall Rating: CONDITIONAL PASS."
        },
        {
            id: "peso-guidelines",
            title: "PESO Guidelines for Gas Storage & Handling",
            pages: "Chapter 7",
            content: "Chapter 7: Coke Oven Gas (COG) Storage and Distribution. 7.1: All COG pipelines must be equipped with flame arrestors at intervals not exceeding 100 metres. 7.2: Gas holder seal pots must be inspected weekly. 7.3: Emergency gas venting systems must activate automatically when COG pressure exceeds 300 mmWC. 7.4: Personnel entering gas danger zones must carry portable gas detectors (calibrated within 30 days). 7.5: Gas leak detection patrols — minimum twice per shift. 7.6: All flanged joints on COG lines must use spiral-wound gaskets rated for H₂S service."
        }
    ],

    // ---------- COMPLIANCE RULES ----------
    rules: [
        {
            ruleId: "CR-01",
            source: "OISD-150 §4.2",
            severity: "critical",
            alertTitle: "CRITICAL: Hot Work Near Elevated Methane",
            alertMessage: "Permit WP-988 (Hot Work/Welding) is ACTIVE on Coke Oven Battery 1, but Gas Sensor GS-101 reads 1.2% CH₄ — exceeding the 1.0% LEL limit set by OISD-150 §4.2. All hot work must be SUSPENDED IMMEDIATELY and a fresh gas-free certificate obtained.",
            condition: (state) => {
                const hotWork = state.activePermits.some(p => p.type === "Hot Work" && p.location === "COB-01");
                const highGas = state.sensors.some(s => s.id === "GS-101" && s.value > 1.0);
                return hotWork && highGas;
            }
        },
        {
            ruleId: "CR-02",
            source: "IR-2026-07 / IS 2062",
            severity: "warning",
            alertTitle: "WARNING: Gas Ducting Below Minimum Wall Thickness",
            alertMessage: "Inspection Report #IR-2026-07 flagged collector main flanges on COB-01 at 4.2mm wall thickness (minimum: 5.0mm per IS 2062:2011). Replacement was due within 60 days of 15-Mar-2026. Deadline: 14-May-2026 — OVERDUE by 40 days.",
            condition: () => true
        },
        {
            ruleId: "CR-03",
            source: "PESO §7.4",
            severity: "warning",
            alertTitle: "WARNING: Gas Sensor Calibration Overdue",
            alertMessage: "Work Order #4035 (calibrate GS-101) is PENDING. PESO Guidelines §7.4 require gas detectors to be calibrated within 30 days. Last calibration: 22-May-2026. Due by: 21-Jun-2026 — OVERDUE by 2 days.",
            condition: () => true
        },
        {
            ruleId: "CR-04",
            source: "Factory Act §41A",
            severity: "info",
            alertTitle: "NOTICE: PPE Compliance Below Target",
            alertMessage: "Inspection Report #IR-2026-07 recorded PPE compliance at 87% (target: 95%) in coke oven area. Factory Act §41A mandates full PPE for hazardous processes. Recommend safety stand-down and PPE re-training.",
            condition: () => true
        }
    ],

    // ---------- CURRENT PLANT STATE (simulated real-time) ----------
    plantState: {
        activePermits: [
            { id: "WP-988", type: "Hot Work", location: "COB-01", validUntil: "25-Jun-2026" },
            { id: "CP-112", type: "Confined Space", location: "BF-01", validUntil: "23-Jun-2026" }
        ],
        sensors: [
            { id: "GS-101", type: "Gas", value: 1.2, unit: "% CH₄", location: "COB-01" },
            { id: "TS-201", type: "Temperature", value: 78, unit: "°C", location: "BF-01" },
            { id: "PS-301", type: "Pressure", value: 8.2, unit: "mmWC", location: "COB-01" }
        ],
        recentEvents: [
            { time: "18:45", type: "alert", msg: "GS-101 reading crossed 1.0% threshold" },
            { time: "17:30", type: "info", msg: "Shift handover completed — C shift on duty" },
            { time: "16:10", type: "info", msg: "WO-4021 closed — V-202 seal replaced" },
            { time: "14:22", type: "alert", msg: "WP-988 hot work permit issued for COB-01" },
            { time: "09:00", type: "info", msg: "CP-112 confined space entry authorised for BF-01 stave inspection" }
        ]
    },

    // ---------- SIMULATED RAG RESPONSES ----------
    simulatedResponses: {
        "hot work": {
            answer: "According to <b>OISD-150 §4.2</b>, no hot work (welding, cutting, grinding) is permitted within <b>15 metres</b> of any location where flammable gas exceeds <b>1% of LEL</b>. A gas-free certificate is mandatory and valid for <b>8 hours max</b>. Fire extinguishers (2 × 9kg DCP) must be within 5m. A fire watch must continue for 30 minutes after work completion.",
            sources: ["OISD-150 §4.2, Pages 18-19"]
        },
        "valve v-202": {
            answer: "Valve V-202 is a <b>BF Gas Isolation Valve</b> on Blast Furnace 1. Its primary graphite seal was replaced on <b>12-May-2026</b> (Work Order #4021) with a Klinger gasket (Part# KLG-450-SS). Pressure tested to 15 bar — no leaks. Secondary seal has ~18 months remaining life. Technician: A. Sharma.",
            sources: ["Work Order #4021"]
        },
        "startup": {
            answer: "The <b>SOP-COB-01</b> covers coke oven battery cold startup in 42 steps. Key steps: (1) Confirm gas valves V-105/106/107 CLOSED, (2) Obtain gas-free certificate, (4) Check COG pressure via PS-301 (must be < 2 mmWC), (8) Open V-105 slowly in quarter-turns, (12) Abort if GS-101 > 0.5% during ignition, (20) Crown temp must reach 1050°C in 4 hours, (42) Log to DCS.",
            sources: ["SOP-COB-01, Steps 1-42"]
        },
        "inspection": {
            answer: "The latest inspection (IR-2026-07, 15-Mar-2026) gave COB-01 a <b>CONDITIONAL PASS</b>. Findings: 3 fire extinguishers expired, safety signage faded, PPE compliance at 87%. <b>MAJOR NCR:</b> Gas ducting flanges corroded to 4.2mm (minimum 5.0mm per IS 2062). Flanges must be replaced within 60 days — deadline was 14-May-2026.",
            sources: ["Inspection Report #IR-2026-07"]
        },
        "pressure": {
            answer: "Coke Oven Gas (COG) main pressure is monitored by sensor <b>PS-301</b>. Current reading: <b>8.2 mmWC</b> (normal operating range). Per SOP-COB-01, COG pressure must be below 2 mmWC before battery startup. Per PESO Guidelines §7.3, emergency venting activates automatically above 300 mmWC.",
            sources: ["SOP-COB-01 Step 4", "PESO Guidelines §7.3"]
        },
        "factory act": {
            answer: "Key Factory Act 1948 provisions: §21 — all moving machinery must be fenced. §36 — max 9 hrs/day, 48 hrs/week. §38 — mandatory weekly holidays. §41A — hazardous processes require medical exams, safety training, and PPE. Non-compliance penalty: up to 2 years imprisonment and/or ₹2,00,000 fine.",
            sources: ["Factory Act 1948, Sections 21-41A"]
        },
        "default": {
            answer: "I found relevant information in the knowledge base. Based on the indexed documents covering OISD standards, plant SOPs, maintenance records, and regulatory guidelines, I can help answer specific questions about equipment operations, safety procedures, and compliance requirements. Please try asking about specific equipment (e.g., COB-01, V-202), regulations (OISD-150, Factory Act), or procedures (startup, inspection).",
            sources: ["AegisBrain Knowledge Index"]
        }
    }
};
