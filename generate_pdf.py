import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Custom canvas to handle two-pass page numbering (Page X of Y) and running headers/footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Don't draw headers/footers on the title page (Page 1)
        if self._pageNumber == 1:
            self.restoreState()
            return

        # Header
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1A365D")) # Deep Navy
        self.drawString(54, 750, "AEGISBRAIN: HACKATHON PROJECT PROPOSAL")
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#718096")) # Muted Grey
        self.drawRightString(612 - 54, 750, "Track 8: Industrial Knowledge Intelligence")
        
        # Header line
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 742, 612 - 54, 742)

        # Footer line
        self.line(54, 60, 612 - 54, 60)

        # Footer
        self.drawString(54, 45, "Confidential - ET AI Hackathon 2026 Submission")
        
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 45, page_text)
        
        self.restoreState()


def create_proposal_pdf(filename):
    # Setup document geometry: 0.75 in (54 pt) margins. Page height 792 pt, width 612 pt.
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    styles = getSampleStyleSheet()

    # Modify/Define custom styles with a premium palette
    primary_color = colors.HexColor("#1A365D")  # Deep Navy
    secondary_color = colors.HexColor("#2B6CB0")  # Slate Blue
    body_color = colors.HexColor("#2D3748")  # Charcoal
    accent_color = colors.HexColor("#C53030")  # Soft Crimson

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=primary_color,
        spaceAfter=15
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=secondary_color,
        spaceAfter=30
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#4A5568")
    )

    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=primary_color,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=secondary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=body_color,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=body_color,
        leftIndent=20,
        firstLineIndent=-10,
        spaceAfter=4
    )

    highlight_style = ParagraphStyle(
        'HighlightStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        leading=14,
        textColor=accent_color,
        leftIndent=15,
        spaceAfter=8
    )

    story = []

    # ================= PAGE 1: TITLE PAGE =================
    story.append(Spacer(1, 100))
    story.append(Paragraph("AEGISBRAIN", title_style))
    story.append(Paragraph("Unified Industrial Knowledge Intelligence & Operations Brain", subtitle_style))
    
    story.append(Spacer(1, 30))
    
    # Decorative line
    line_data = [['']]
    line_table = Table(line_data, colWidths=[504])
    line_table.setStyle(TableStyle([
        ('LINEBELOW', (0,0), (-1,-1), 3, primary_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(line_table)
    
    story.append(Spacer(1, 150))
    
    meta_text = """
    <b>Hackathon:</b> ET AI Hackathon 2026<br/>
    <b>Track:</b> Track 8 — AI for Industrial Knowledge Intelligence: Unified Asset & Operations Brain<br/>
    <b>Status:</b> Project Specification & Proposal<br/>
    <b>Date:</b> June 2026<br/>
    """
    story.append(Paragraph(meta_text, meta_style))
    story.append(PageBreak())

    # ================= PAGE 2: EXECUTIVE SUMMARY & PROBLEM STATEMENT =================
    story.append(Paragraph("1. Executive Summary & Problem Context", h1_style))
    
    summary_text = (
        "In modern heavy industry, engineers and operators are drowning in fragmented data. "
        "According to studies by McKinsey and NASSCOM-EY, plant professionals spend an average "
        "of <b>35% of their working hours</b> searching for information, clarifying instructions, "
        "or recreating documentation. A typical industrial site hosts data across <b>7 to 12 "
        "disconnected repositories</b>—P&IDs, scanned checklists, maintenance work orders, "
        "OEM manuals, and regulatory records. This fragmentation is directly responsible for "
        "<b>18% to 22% of unplanned downtime</b> in Indian heavy industry due to misinformed "
        "maintenance decisions."
    )
    story.append(Paragraph(summary_text, body_style))
    
    context_text = (
        "Furthermore, heavy industry is facing a massive 'knowledge cliff.' Within the next decade, "
        "an estimated <b>25% of India's highly experienced industrial engineers</b> will retire, "
        "taking decades of undocumented tribal operational knowledge with them. Once gone, this operational "
        "expertise is lost forever. AegisBrain resolves this crisis by unifying all engineering "
        "drawings, regulations, operating procedures, and incident histories into a single intelligent "
        "operations layer."
    )
    story.append(Paragraph(context_text, body_style))

    story.append(Spacer(1, 10))

    story.append(Paragraph("2. The Challenge Statement (Track 8)", h1_style))
    challenge_text = (
        "Build an AI-powered Industrial Knowledge Intelligence platform that ingests heterogeneous "
        "documents (engineering drawings, maintenance records, safety procedures, inspection reports, "
        "operating instructions) across structured and unstructured formats, and makes their collective "
        "intelligence queryable, actionable, and continuously updated at the point of need, across "
        "any device or function."
    )
    story.append(Paragraph(challenge_text, highlight_style))

    story.append(Spacer(1, 10))

    story.append(Paragraph("3. Our Proposed Solution: AegisBrain", h1_style))
    sol_intro = (
        "<b>AegisBrain</b> is designed as a high-fidelity web dashboard tailored for plant managers, "
        "safety inspectors, and field technicians. It represents a unified 'Asset & Operations Brain' "
        "built around the following core pillars:"
    )
    story.append(Paragraph(sol_intro, body_style))

    pillars = [
        "<b>Universal Document Ingestion & OCR:</b> Translates paper manuals, scanned inspection reports, and CAD drawings into structured digital texts and maps layout boundaries.",
        "<b>Industrial Knowledge Graph:</b> Automatically extracts entities (e.g., equipment tag 'Coke Oven Battery-01', valve 'V-102') and maps their relationships to safety rules (e.g., 'OISD-150') and maintenance schedules.",
        "<b>Conversational Co-Pilot (RAG):</b> A secure chat interface providing instant answers to complex maintenance queries with clear citations and direct links to the relevant PDF pages.",
        "<b>Regulatory & Compliance Auditor:</b> Continuously audits active permits and logs against Factory Acts and environmental guidelines, automatically highlighting non-compliance risks."
    ]
    for p in pillars:
        story.append(Paragraph(f"• {p}", bullet_style))

    story.append(PageBreak())

    # ================= PAGE 3: TECHNICAL ARCHITECTURE & DEMO PLAN =================
    story.append(Paragraph("4. Technical Architecture", h1_style))
    arch_intro = (
        "AegisBrain is designed as a lightweight, lightning-fast application focusing on maximum "
        "visual impact and stable operation under hackathon conditions:"
    )
    story.append(Paragraph(arch_intro, body_style))

    tech_points = [
        "<b>Frontend Interface:</b> Built with semantic HTML5, Vanilla JavaScript, and styled with premium Vanilla CSS featuring a state-of-the-art glassmorphic dark interface, smooth micro-animations, and full responsiveness.",
        "<b>Visual Graph Engine:</b> D3.js force-directed canvas displaying interactive, clickable nodes connecting documents, equipment, and compliance rules.",
        "<b>Dual-Mode Intelligence Engine:</b><br/>"
        "  - <i>Offline Simulator (Default):</i> A bulletproof, zero-latency mockup database loaded with detailed plant schemas, ensuring perfect performance on stage regardless of network quality.<br/>"
        "  - <i>Gemini Live Connector:</i> A built-in toggle allowing users to input a Google Gemini API key to run real-time file processing and RAG answering on active models (like <i>gemini-1.5-flash</i>)."
    ]
    for tp in tech_points:
        story.append(Paragraph(f"• {tp}", bullet_style))

    story.append(Spacer(1, 10))

    story.append(Paragraph("5. Hackathon Presentation Scenario (Steel Plant)", h1_style))
    scenario_text = (
        "To ground the demo in a realistic high-stakes scenario, we base our prototype on a heavy "
        "industrial <b>Steel Plant</b> (focusing on a Coke Oven Battery unit, drawing inspiration from Track 1 safety contexts):"
    )
    story.append(Paragraph(scenario_text, body_style))

    steps_data = [
        ["Step", "Presenter Action", "Screen / Visualization Shown"],
        ["1", "Upload new safety inspection logs", "Ingestion Hub shows OCR progress & extracted safety alerts."],
        ["2", "Search for pressure limits", "Copilot answers instantly referencing OISD-150 standard with document links."],
        ["3", "Open the Operations Graph", "Interactive graph reveals nodes linking 'Battery-01' to gas sensors & active permits."],
        ["4", "Run compliance audit", "System raises a critical alert: hot work is scheduled too close to a gas sensor reading."]
    ]
    
    t = Table(steps_data, colWidths=[40, 220, 244])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1A365D")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('TOPPADDING', (0,0), (-1,0), 6),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#F7FAFC")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 5),
        ('TOPPADDING', (0,1), (-1,-1), 5),
    ]))
    
    story.append(t)
    
    story.append(Spacer(1, 20))
    story.append(Paragraph("6. Project Deliverables Checklist", h1_style))
    
    delivs = [
        "<b>Working Dashboard Prototype:</b> Single page HTML/CSS/JS with full interactive views.",
        "<b>Architecture Diagram:</b> Included inside the project repository and deck.",
        "<b>Pitch Presentation Deck Outline:</b> Accompanying slides covering context, business impact, and architecture.",
        "<b>Walkthrough Video Screen Recording:</b> Demonstration of the core user flows."
    ]
    for d in delivs:
        story.append(Paragraph(f"✓ {d}", bullet_style))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated proposal PDF: {filename}")

if __name__ == "__main__":
    pdf_name = "AegisBrain_Hackathon_Proposal.pdf"
    if len(sys.argv) > 1:
        pdf_name = sys.argv[1]
    create_proposal_pdf(pdf_name)
