const aiProvider = require('../config/aiProvider');

// ─── JSON Parser ─────────────────────────────────────────────────────────────

/**
 * Calls the AI and robustly parses the JSON response.
 * Handles: markdown fences, <think> blocks, preamble text, trailing text.
 */
async function callAIJSON(prompt) {
  let text, tokensUsed;

  try {
    ({ text, tokensUsed } = await aiProvider.generateContent(prompt));
  } catch (err) {
    console.error('[AI Provider Error]:', err.message);
    const error = new Error(`AI service unavailable: ${err.message}`);
    error.statusCode = 503;
    throw error;
  }

  try {
    // 1. Strip <think>...</think> blocks (Qwen3 safety net)
    let clean = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

    // 2. Strip markdown fences
    clean = clean.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // 3. Extract from first { or [
    const start = clean.search(/[{[]/);
    if (start > 0) clean = clean.slice(start);

    // 4. Trim trailing text after last } or ]
    if (clean.length > 0) {
      const closer = clean[0] === '{' ? '}' : ']';
      const end    = clean.lastIndexOf(closer);
      if (end !== -1 && end < clean.length - 1) clean = clean.slice(0, end + 1);
    }

    return { data: JSON.parse(clean), tokensUsed };
  } catch (parseErr) {
    console.error('[AI Parse Error] Raw (first 600 chars):\n', text?.slice(0, 600));
    const error = new Error('AI returned an invalid response format. Please try again.');
    error.statusCode = 502;
    throw error;
  }
}

// ─── Stage 1: Questions ───────────────────────────────────────────────────────

exports.generateQuestions = async (rawInput) => {
  const prompt = `A developer wants to build: "${rawInput}"

Generate exactly 6 clarifying architecture questions. Each must have 3-4 short suggestion answers.

Return this JSON (fill in real questions relevant to the idea):
{
  "questions": [
    {"id":"q1","question":"Who are the primary users?","suggestions":["Consumers","Businesses","Internal team","Mixed"]},
    {"id":"q2","question":"Expected user scale at launch?","suggestions":["<1k","1k-10k","10k-100k","100k+"]},
    {"id":"q3","question":"Real-time features needed?","suggestions":["Yes, critical","Nice to have","No"]},
    {"id":"q4","question":"Authentication approach?","suggestions":["Email/password","OAuth","Magic link","No auth"]},
    {"id":"q5","question":"Monetization model?","suggestions":["Subscriptions","One-time","Freemium","Free"]},
    {"id":"q6","question":"Most critical feature?","suggestions":["Data management","Communication","Analytics","Marketplace"]}
  ]
}`;

  const { data, tokensUsed } = await callAIJSON(prompt);
  return { questions: data.questions, tokensUsed };
};

// ─── Stage 2: Refine ─────────────────────────────────────────────────────────

exports.refineInput = async (rawInput, answers) => {
  const answersText = Object.entries(answers)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n');

  const prompt = `Convert this app idea and user answers into a structured spec JSON.

App idea: "${rawInput}"
User answers:
${answersText}

Return this JSON with real values:
{
  "appName": "product name",
  "summary": "one-sentence description",
  "targetAudience": "who uses it",
  "coreFeatures": ["feature 1", "feature 2", "feature 3"],
  "outOfScope": ["what is excluded from v1"],
  "constraints": ["technical or business constraints"],
  "scaleExpectations": "expected load",
  "monetisation": "revenue model"
}`;

  const { data, tokensUsed } = await callAIJSON(prompt);
  return { refinedInput: data, tokensUsed };
};

// ─── Stage 3: Design ─────────────────────────────────────────────────────────

exports.generateDesign = async (structuredInput) => {
  const prompt = `Generate a complete system design for this product spec:
${JSON.stringify(structuredInput, null, 2)}

Return this JSON:
{
  "requirements": {
    "functional": ["req1", "req2", "req3", "req4", "req5"],
    "nonFunctional": ["perf1", "perf2", "perf3"]
  },
  "architecture": {
    "pattern": "Monolith or Microservices",
    "rationale": "explanation",
    "components": ["comp1", "comp2", "comp3"],
    "techStack": {"frontend": "...", "backend": "...", "database": "...", "other": "..."}
  },
  "apis": [
    {"method": "POST", "path": "/api/v1/auth/register", "description": "Register user", "requestBody": {"email":"string","password":"string"}, "response": {"token":"string"}},
    {"method": "GET",  "path": "/api/v1/users/me",     "description": "Get profile",  "requestBody": {}, "response": {"user":"object"}}
  ],
  "dbSchema": [
    {"name": "users", "fields": [{"name":"_id","type":"ObjectId","required":true,"notes":"PK"},{"name":"email","type":"String","required":true,"notes":"unique"}]},
    {"name": "sessions","fields":[{"name":"_id","type":"ObjectId","required":true,"notes":"PK"},{"name":"userId","type":"ObjectId","required":true,"notes":"FK"}]}
  ]
}

Include at least 10 APIs and 4 DB collections relevant to the product.`;

  const { data: designData, tokensUsed } = await callAIJSON(prompt);
  return { designData, tokensUsed };
};

// ─── Stage 4: Diagram ────────────────────────────────────────────────────────

exports.generateDiagram = async (design) => {
  const arch = design.architecture || design;

  const prompt = `Generate a Mermaid.js diagram for this architecture:
Pattern: ${arch.pattern}
Components: ${(arch.components || []).join(', ')}
Tech: ${JSON.stringify(arch.techStack || {})}

Output ONLY raw Mermaid code starting with "graph TD". No explanation. No fences.
Example:
graph TD
    A[Client] --> B[API Server]
    B --> C[(Database)]`;

  const { text, tokensUsed } = await aiProvider.generateContent(prompt);

  let diagram = text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/```mermaid\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  const graphIdx = diagram.indexOf('graph ');
  if (graphIdx > 0) diagram = diagram.slice(graphIdx);

  return { diagram, tokensUsed };
};

// ─── Stage 5: Update Design ──────────────────────────────────────────────────

exports.updateDesign = async (existingDesign, instruction) => {
  const current = {
    requirements: existingDesign.requirements,
    architecture: existingDesign.architecture,
    apis:         existingDesign.apis,
    dbSchema:     existingDesign.dbSchema,
  };

  const prompt = `Update this system design based on the change request.
Change request: "${instruction}"

Current design:
${JSON.stringify(current, null, 2)}

Return the COMPLETE updated design JSON with the same structure plus a "changesSummary" field:
{
  "requirements": {"functional":[...],"nonFunctional":[...]},
  "architecture": {"pattern":"...","rationale":"...","components":[...],"techStack":{...}},
  "apis": [...],
  "dbSchema": [...],
  "changesSummary": "Summary of what changed"
}`;

  const { data, tokensUsed } = await callAIJSON(prompt);
  return { designData: data, tokensUsed };
};
