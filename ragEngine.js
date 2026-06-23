// ============================================================
// AegisBrain RAG Engine
// Handles PDF parsing (pdf.js), local retrieval, and Gemini API
// ============================================================

// Configure pdf.js worker
if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

class RagEngine {
    constructor() {
        this.apiKey = localStorage.getItem('aegis_api_key') || '';
        this.index = window.AegisData ? [...window.AegisData.ragIndex] : [];
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('aegis_api_key', key);
    }

    hasApiKey() {
        return this.apiKey && this.apiKey.trim().length > 0;
    }

    // ---- PDF Parsing with pdf.js ----
    async parsePdf(file, onProgress) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `\n[Page ${i}]: ${pageText}`;
            if (onProgress) onProgress(Math.round((i / totalPages) * 100));
        }

        // Add to index
        const chunk = {
            id: 'uploaded-' + Date.now(),
            title: file.name,
            pages: `${totalPages} pages`,
            content: fullText.substring(0, 3000)
        };
        this.index.push(chunk);

        return { text: fullText, pages: totalPages, chunk };
    }

    // ---- Entity Extraction (Simulated NER) ----
    extractEntities(text) {
        const entities = [];
        const patterns = [
            { regex: /(?:V-\d+|PS-\d+|GS-\d+|TS-\d+|COB-\d+|BF-\d+)/gi, type: 'equipment' },
            { regex: /(?:OISD-\d+|IS \d+|PESO|Factory Act)/gi, type: 'regulation' },
            { regex: /(?:\d+(?:\.\d+)?(?:\s*(?:bar|mmWC|°C|%|psi|kg|mm|metres|meters)))/gi, type: 'parameter' },
            { regex: /(?:(?:Dr|Mr|Ms|Technician|Supervisor|Inspector)[.\s]+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g, type: 'person' }
        ];

        patterns.forEach(({ regex, type }) => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                const val = match[0].trim();
                if (!entities.find(e => e.value === val)) {
                    entities.push({ value: val, type });
                }
            }
        });

        return entities;
    }

    // ---- Keyword-based Retrieval ----
    retrieveContext(query) {
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        let results = [];

        for (const doc of this.index) {
            let score = 0;
            const text = (doc.title + ' ' + doc.content).toLowerCase();
            keywords.forEach(kw => {
                const count = (text.match(new RegExp(kw, 'g')) || []).length;
                score += count;
            });
            if (score > 0) results.push({ doc, score });
        }

        results.sort((a, b) => b.score - a.score);
        return results.slice(0, 3).map(r => r.doc);
    }

    // ---- Answer Generation ----
    async askQuestion(query) {
        if (this.hasApiKey()) {
            return await this._callGeminiAPI(query);
        } else {
            return this._simulateAnswer(query);
        }
    }

    async _callGeminiAPI(query) {
        const contextDocs = this.retrieveContext(query);
        const contextText = contextDocs.map(d => `[${d.title}]: ${d.content}`).join('\n\n');

        const systemPrompt = `You are the AegisBrain Expert Copilot, an industrial AI assistant for a steel plant.
Answer the user's question using ONLY the provided context documents.
If the context does not contain the answer, say so clearly.
Always cite the specific document title and section.
Be precise and technical. Format your answer with clear structure.`;

        const userPrompt = `CONTEXT DOCUMENTS:\n${contextText}\n\nQUESTION: ${query}`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ parts: [{ text: userPrompt }] }],
                        generationConfig: { temperature: 0.2 }
                    })
                }
            );

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);

            const answer = data.candidates[0].content.parts[0].text;
            return {
                answer,
                sources: contextDocs.map(d => d.title),
                mode: 'Live Gemini API'
            };
        } catch (error) {
            return {
                answer: `API Error: ${error.message}. Falling back to simulator.`,
                sources: ['Error'],
                mode: 'Error'
            };
        }
    }

    _simulateAnswer(query) {
        const q = query.toLowerCase();
        const responses = window.AegisData.simulatedResponses;

        // Match query against response keys
        for (const [key, response] of Object.entries(responses)) {
            if (key === 'default') continue;
            const keywords = key.split(' ');
            if (keywords.some(kw => q.includes(kw))) {
                return {
                    answer: response.answer,
                    sources: response.sources,
                    mode: 'Offline Simulator'
                };
            }
        }

        return {
            answer: responses.default.answer,
            sources: responses.default.sources,
            mode: 'Offline Simulator'
        };
    }
}

window.aegisRag = new RagEngine();
