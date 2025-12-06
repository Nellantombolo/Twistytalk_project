// =======================================================
// JEST SETUP: Mock the global fetch function
// =======================================================
global.fetch = jest.fn();

// We must mock the environment variables Jest can't access directly
const GEMINI_KEY = 'MOCK_KEY_FOR_TESTING'; 
const FLASH_MODEL = "gemini-2.5-flash"; 


// =======================================================
// SERVICE LAYER FUNCTIONS (Copied from App.jsx for Isolation)
// =======================================================

const generateTwister = async (difficulty) => {
    const systemInstruction = `
        You are an expert language pattern generator.
        Return ONLY a JSON object with:
        - "twisterText": the tongue twister (8–12 words)
        - "difficulty": the same difficulty the user selected
        Do not include any other text or markdown formatting (e.g., no \`\`\`json).
    `;

    const combinedQuery = `${systemInstruction} Now, based on this instruction, here is the request: Generate a tongue twister suitable for an English learner at the ${difficulty} difficulty level. It must be short, fun, and alliterative.`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: combinedQuery }] }],
        generationConfig: {} 
    };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${FLASH_MODEL}:generateContent?key=${GEMINI_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!response.ok) {
        const errorResult = await response.json(); 
        console.error("Twister API Failed. Full response:", errorResult);
        throw new Error("API error " + response.status + ": Check console for details.");
    }
    const result = await response.json();
    const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonString) { console.error("No text output from Gemini:", result); return null; }
    try {
        const cleanedJson = jsonString.replace(/```json\s*|```/g, '').trim();
        return JSON.parse(cleanedJson);
    } catch (e) {
        console.error("Failed to parse JSON string:", jsonString, e);
        return null;
    }
};

const ratePronunciation = async (targetText, base64Audio, mimeType) => {
    const systemPrompt = `
        You are an extremely strict English pronunciation validator.
        Your task is to compare the user's spoken audio with the target text.
        **CRITICAL RULE: If the audio is silent, garbled, or contains speech that is NOT the target text, you MUST return this exact JSON:**
        {"score": 0, "feedback": "ERROR: No valid or relevant speech was detected in the recording. Please ensure you are speaking the target text clearly.", "mispronouncedWords": []}
        If the audio is valid and relevant, then return ONLY a JSON object formatted as follows, with a score from 1 to 10:
        {"score": [integer 1-10], "feedback": "[short paragraph of helpful feedback]", "mispronouncedWords": [array of words the user mispronounced]}
        Do not include any other text or markdown formatting (e.g., no \`\`\`json).
    `;

    const combinedTextPrompt = `${systemPrompt} Now, analyze the following audio. The target tongue twister text is: "${targetText}". The audio file to be analyzed is attached below.`;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: combinedTextPrompt }, 
                    { inlineData: { mimeType: mimeType, data: base64Audio } }
                ]
            }
        ],
        generationConfig: {}
    };

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${FLASH_MODEL}:generateContent?key=${GEMINI_KEY}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!response.ok) {
        const errorResult = await response.json(); 
        console.error("Rating API Failed. Full response:", errorResult);
        throw new Error("API error " + response.status + ": Check console for details.");
    }

    const result = await response.json();
    const jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonString) {
        return { score: 0, feedback: "Error processing audio. Model returned no response.", mispronouncedWords: [] };
    }

    try {
        const cleanedJson = jsonString.replace(/```json\s*|```/g, '').trim();
        return JSON.parse(cleanedJson);
    } catch (e) {
        console.error("Failed to parse JSON string:", jsonString, e);
        return { score: 0, feedback: "Error: Model returned an unparseable response.", mispronouncedWords: [] };
    }
};


// =======================================================
// JEST UNIT TESTS
// =======================================================

describe('Twister Generation Service', () => {

    // Test Case 1: Successful twister generation and JSON parsing
    test('should return a parsed twister object on success', async () => {
        const mockResponse = {
            candidates: [{
                content: {
                    parts: [{
                        text: '{"twisterText": "Fiona found forty funny frogs.", "difficulty": "easy"}'
                    }]
                }
            }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await generateTwister('easy');
        
        expect(result.twisterText).toContain('Fiona found');
        expect(result.difficulty).toBe('easy');
    });
    
    // Test Case 2: API returns an error status (e.g., 400)
    test('should throw an error on API failure (response.ok is false)', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ error: 'BAD_REQUEST' })
        });

        await expect(generateTwister('easy')).rejects.toThrow('API error 400');
    });
});

describe('Pronunciation Rating Service', () => {

    // Test Case 3: Successful rating (valid audio input)
    test('should return a valid rating and feedback on good input', async () => {
        const mockResponse = {
            candidates: [{
                content: {
                    parts: [{
                        text: '{"score": 8, "feedback": "Great job!", "mispronouncedWords": ["none"]}'
                    }]
                }
            }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });
        
        const result = await ratePronunciation('She sells seashells', 'mockBase64', 'audio/webm');

        expect(result.score).toBe(8);
        expect(result.mispronouncedWords).toHaveLength(1);
    });

    // Test Case 4: Invalid input (The STRICT error response due to garbled audio)
    test('should return score 0 and error feedback for invalid/silent audio', async () => {
        const mockErrorResponse = {
            candidates: [{
                content: {
                    parts: [{
                        text: '{"score": 0, "feedback": "ERROR: No valid or relevant speech was detected in the recording. Please ensure you are speaking the target text clearly.", "mispronouncedWords": []}'
                    }]
                }
            }]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockErrorResponse)
        });
        
        const result = await ratePronunciation('Target text', 'silentBase64', 'audio/webm');

        expect(result.score).toBe(0);
        expect(result.feedback).toContain('ERROR');
        expect(result.mispronouncedWords).toHaveLength(0);
    });
});