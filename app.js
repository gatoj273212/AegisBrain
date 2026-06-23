// ============================================================
// AegisBrain — Main Application Controller
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- TAB NAVIGATION ----
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    let graphInitialized = false;

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            navBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const panel = document.getElementById('tab-' + target);
            if (panel) panel.classList.add('active');

            // Lazy-init graph
            if (target === 'graph' && !graphInitialized) {
                const kg = new KnowledgeGraph('graph-container');
                kg.init(JSON.parse(JSON.stringify(window.AegisData.graph)));
                graphInitialized = true;
            }
        });
    });

    // ---- EVENT TIMELINE (Overview) ----
    const timelineList = document.getElementById('timeline-list');
    if (timelineList && window.AegisData) {
        window.AegisData.plantState.recentEvents.forEach(evt => {
            const div = document.createElement('div');
            div.className = 'timeline-item';
            div.innerHTML = `
                <span class="tl-time">${evt.time}</span>
                <span class="tl-dot ${evt.type}"></span>
                <span class="tl-msg">${evt.msg}</span>
            `;
            timelineList.appendChild(div);
        });
    }

    // ---- API KEY SETTINGS ----
    const apiInput = document.getElementById('api-key-input');
    const saveApiBtn = document.getElementById('save-api-btn');
    const modeIndicator = document.getElementById('mode-indicator');
    const copilotModeTag = document.getElementById('copilot-mode-tag');

    if (window.aegisRag && window.aegisRag.hasApiKey()) {
        apiInput.value = window.aegisRag.apiKey;
        setLiveMode(true);
    }

    saveApiBtn.addEventListener('click', () => {
        const key = apiInput.value.trim();
        if (key && window.aegisRag) {
            window.aegisRag.setApiKey(key);
            setLiveMode(true);
        }
    });

    function setLiveMode(isLive) {
        if (isLive) {
            modeIndicator.innerHTML = '<span class="mode-dot live"></span><span>Live Gemini API</span>';
            copilotModeTag.textContent = 'Live RAG Mode';
            copilotModeTag.style.background = 'var(--green-dim)';
            copilotModeTag.style.color = 'var(--green)';
        } else {
            modeIndicator.innerHTML = '<span class="mode-dot offline"></span><span>Offline Simulator</span>';
            copilotModeTag.textContent = 'Simulator Mode';
            copilotModeTag.style.background = 'var(--amber-dim)';
            copilotModeTag.style.color = 'var(--amber)';
        }
    }

    // ---- DOCUMENT INGESTION ----
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const pipelineCard = document.getElementById('pipeline-card');
    const extractedPreview = document.getElementById('extracted-preview');
    const entityTags = document.getElementById('entity-tags');
    const textPreview = document.getElementById('text-preview');
    const docTableBody = document.getElementById('doc-table-body');

    const steps = ['step-upload', 'step-ocr', 'step-ner', 'step-graph'];

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) await processFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) await processFile(e.target.files[0]);
    });

    async function processFile(file) {
        // Show pipeline
        dropZone.style.display = 'none';
        pipelineCard.style.display = 'block';
        extractedPreview.style.display = 'none';

        // Reset steps
        steps.forEach(s => {
            const el = document.getElementById(s);
            el.classList.remove('active', 'done');
        });

        // Step 1: Upload
        await animateStep(0, 400);

        // Step 2: OCR / Text Extract
        await animateStep(1, 300);

        let extractedText = '';
        let entities = [];

        if (file.type === 'application/pdf' && window.aegisRag) {
            try {
                const result = await window.aegisRag.parsePdf(file, (progress) => {
                    // Could update progress here
                });
                extractedText = result.text;
                entities = window.aegisRag.extractEntities(extractedText);
                completeStep(1);
            } catch (err) {
                extractedText = `Error parsing PDF: ${err.message}`;
                completeStep(1);
            }
        } else {
            // Simulate for non-PDF
            extractedText = `[Simulated extraction] File: ${file.name}, Size: ${(file.size / 1024).toFixed(1)} KB`;
            entities = [
                { value: file.name.split('.')[0], type: 'equipment' }
            ];
            await delay(800);
            completeStep(1);
        }

        // Step 3: Entity Recognition
        await animateStep(2, 600);
        completeStep(2);

        // Step 4: Graph Update
        await animateStep(3, 500);
        completeStep(3);

        // Show extracted results
        extractedPreview.style.display = 'block';

        entityTags.innerHTML = '';
        entities.forEach(e => {
            const tag = document.createElement('span');
            tag.className = `entity-tag ${e.type}`;
            tag.textContent = e.value;
            entityTags.appendChild(tag);
        });

        textPreview.textContent = extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : '');

        // Add to indexed docs table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.name}</td>
            <td>Uploaded</td>
            <td>${entities.length}</td>
            <td><span class="status-pill blue">New</span></td>
        `;
        docTableBody.prepend(row);

        // Update KPI
        const kpiDocs = document.getElementById('kpi-docs');
        if (kpiDocs) {
            const current = parseInt(kpiDocs.textContent.replace(/,/g, ''));
            kpiDocs.textContent = (current + 1).toLocaleString();
        }

        // Show drop zone again after delay
        setTimeout(() => {
            dropZone.style.display = 'block';
        }, 2000);
    }

    function animateStep(index, delayMs) {
        return new Promise(resolve => {
            setTimeout(() => {
                const el = document.getElementById(steps[index]);
                el.classList.add('active');
                resolve();
            }, delayMs);
        });
    }

    function completeStep(index) {
        const el = document.getElementById(steps[index]);
        el.classList.remove('active');
        el.classList.add('done');
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ---- EXPERT COPILOT ----
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');

    async function handleChatSend() {
        const query = chatInput.value.trim();
        if (!query) return;

        appendMessage(query, 'user');
        chatInput.value = '';

        // Typing indicator
        const typingId = 'typing-' + Date.now();
        appendTypingIndicator(typingId);

        // Get answer
        const response = await window.aegisRag.askQuestion(query);

        // Remove typing
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        // Show answer
        appendSystemMessage(response.answer, response.sources, response.mode);
    }

    chatSendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSend();
    });

    function appendMessage(text, type) {
        const div = document.createElement('div');
        div.className = `msg msg-${type}`;

        const avatarClass = type === 'user' ? 'user-avatar' : 'system-avatar';
        const avatarContent = type === 'user' ? '👤' : '';

        div.innerHTML = `
            <div class="msg-avatar ${avatarClass}">${avatarContent}</div>
            <div class="msg-bubble">${escapeHtml(text)}</div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendSystemMessage(answerHtml, sources, mode) {
        const div = document.createElement('div');
        div.className = 'msg msg-system';

        let sourceTags = '';
        if (sources && sources.length > 0) {
            sourceTags = '<div class="msg-sources">' +
                sources.map(s => `<span class="source-tag">📄 ${s}</span>`).join('') +
                `<span class="source-tag" style="background:var(--purple-dim);color:var(--purple);">⚡ ${mode}</span>` +
                '</div>';
        }

        div.innerHTML = `
            <div class="msg-avatar system-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="msg-bubble">
                <p>${answerHtml}</p>
                ${sourceTags}
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function appendTypingIndicator(id) {
        const div = document.createElement('div');
        div.className = 'msg msg-system msg-typing';
        div.id = id;
        div.innerHTML = `
            <div class="msg-avatar system-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="msg-bubble">Searching knowledge base</div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ---- COMPLIANCE AUDITOR ----
    const runAuditBtn = document.getElementById('run-audit-btn');
    const auditResults = document.getElementById('audit-results');
    const auditEmpty = document.getElementById('audit-empty');

    runAuditBtn.addEventListener('click', async () => {
        runAuditBtn.disabled = true;
        runAuditBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Scanning...
        `;

        // Clear previous
        auditResults.innerHTML = '';

        const rules = window.AegisData.rules;
        const state = window.AegisData.plantState;

        // Animate alerts appearing one-by-one
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.condition(state)) {
                await delay(600);

                const card = document.createElement('div');
                card.className = `alert-card ${rule.severity}`;

                const iconSvg = rule.severity === 'critical'
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                    : rule.severity === 'warning'
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

                card.innerHTML = `
                    <div class="alert-icon">${iconSvg}</div>
                    <div class="alert-body">
                        <h4>${rule.alertTitle}</h4>
                        <p>${rule.alertMessage}</p>
                        <div class="alert-meta">
                            <span class="alert-source">Rule: ${rule.ruleId}</span>
                            <span class="alert-source">Source: ${rule.source}</span>
                        </div>
                    </div>
                `;

                auditResults.appendChild(card);
            }
        }

        // Update badge count
        const badge = document.getElementById('alert-badge');
        if (badge) badge.textContent = rules.length;

        runAuditBtn.disabled = false;
        runAuditBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Run Full Plant Audit
        `;
    });
});
