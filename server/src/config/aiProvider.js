const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');

// ─── Gemini ───────────────────────────────────────────────────────────────────

let genAI, geminiModel;
const getGeminiModel = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY);
    geminiModel = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
    });
  }
  return geminiModel;
};

// ─── Ollama ───────────────────────────────────────────────────────────────────

/**
 * Call Ollama via the /api/chat endpoint.
 *
 * Why /api/chat instead of /api/generate?
 *   - /api/chat supports the `think: false` parameter (Qwen3 specific) which
 *     suppresses the model's internal reasoning block at the engine level,
 *     instead of relying on /no_think prompts that don't work reliably in Ollama.
 *   - Without `think: false`, Qwen3 models dump thousands of tokens of <think>
 *     content, which can exhaust num_predict before the actual JSON is output.
 *
 * Returns { text: string, tokensUsed: number }
 */
async function callOllama(userContent) {
  const url = `${env.OLLAMA_URL}/api/chat`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:  env.OLLAMA_MODEL,
        stream: false,
        think:  false,           // Qwen3: disable reasoning/thinking mode
        messages: [
          {
            role:    'system',
            content: 'You are an expert software architect. Always respond with raw, valid JSON only. Never include markdown, code fences, explanations, or any text outside the JSON structure.',
          },
          {
            role:    'user',
            content: userContent,
          },
        ],
        options: {
          temperature: 0.3,
          num_predict: 8192,     // Enough for design generation
        },
      }),
    });
  } catch (networkErr) {
    throw new Error(`Cannot reach Ollama at ${env.OLLAMA_URL}. Is "ollama serve" running? (${networkErr.message})`);
  }

  if (!response.ok) {
    let errBody = '';
    try { errBody = await response.text(); } catch (_) {}
    throw new Error(`Ollama returned HTTP ${response.status}: ${errBody}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonErr) {
    throw new Error(`Ollama response was not valid JSON: ${jsonErr.message}`);
  }

  // /api/chat response shape: { message: { content: "..." }, eval_count: N }
  const text = data?.message?.content ?? '';
  console.log(`[Ollama] ✅ Response (first 400 chars): ${text.slice(0, 400)}`);

  return {
    text,
    tokensUsed: data.eval_count || 0,
  };
}

// ─── Unified provider ─────────────────────────────────────────────────────────

exports.generateContent = async (prompt) => {
  if (env.AI_PROVIDER === 'ollama') {
    return await callOllama(prompt);
  }

  const model  = getGeminiModel();
  const result = await model.generateContent(prompt);
  const res    = result.response;
  return {
    text:       res.text(),
    tokensUsed: res.usageMetadata?.totalTokenCount || 0,
  };
};

exports.AI_PROVIDER = env.AI_PROVIDER;
