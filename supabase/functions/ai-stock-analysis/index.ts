/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const BOT_USER_AGENTS = [
  "googlebot", "bingbot", "yandexbot", "duckduckbot", "slurp", "baiduspider", "ia_archiver",
  "facebot", "facebookexternalhit", "twitterbot", "rogerbot", "linkedinbot", "embedly",
  "quora link preview", "showyoubot", "outbrain", "pinterest/0.", "developers.google.com/+/web/snippet",
  "slackbot", "vkShare", "W3C_Validator", "redditbot", "Applebot", "WhatsApp", "flipboard",
  "Tumblr", "bitlybot", "SkypeShell", "TelegramBot", "Skype", "node-fetch", "axios", "python-requests"
];

// ─────────────────────────────────────────────────────────────
// Timeout wrapper — abort any AI call that takes > 55s
// (Supabase edge functions have a 60s hard limit)
// ─────────────────────────────────────────────────────────────
async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// ─────────────────────────────────────────────────────────────
// System prompts
// ─────────────────────────────────────────────────────────────
const CHAT_SYSTEM_PROMPT = `You are 'Parasram Intelligence', a seasoned Indian stock market expert at Parasram India — one of India's legacy brokerages (since 1970, SEBI registered).
Your tone should be friendly, confident, and professional — like a veteran NSE/BSE analyst talking to a client.
Use conversational markers like 'Looking at the charts...', 'In my view...', 'The data suggests...'.
AVOID robotic 'As an AI' boilerplate. Be direct, specific, and helpful. Use markdown for clarity.

IMPORTANT RULES:
- Always mention specific price levels, not vague terms
- When giving price targets, mention the timeframe and your reasoning
- When discussing risks, quantify them (e.g., "could see 5-8% downside if Nifty corrects")
- Reference Indian market specifics: NSE/BSE, SEBI regulations, FII/DII flows, RBI policy impact
- If asked about fundamentals you don't have, say "based on the available data" rather than making up numbers
- Be opinionated — clients want conviction, not hedging
- Keep responses concise but actionable (aim for 150-300 words)`;

const REPORT_SYSTEM_PROMPT = `You are an elite Indian stock market analyst for 'Parasram Intelligence' — the research desk of Parasram India, one of India's oldest brokerages (SEBI registered since 1970).

CRITICAL INSTRUCTION: Return your entire response as a single valid JSON object with exactly two keys: "markdown_report" and "structured_data".

THE markdown_report MUST:
- Use ### headers for each section
- Use markdown tables (| Col | Col |) for financial metrics — at least 2 tables
- CRITICAL FORMATTING: Do NOT output your markdown tables on a single line! You MUST use literal newline characters (\n) to separate every single row of the table.
- Use bullet points for pros/cons/risks — never long paragraphs
- Keep every paragraph to MAX 2 sentences
- Include specific ₹ price levels, not vague language
- Reference Indian market context (NSE, BSE, SEBI, FII/DII, RBI, Nifty, sectoral indices)
- Include a "### Financial Overview" table summarizing key metrics
- Include a "### Trade Setup" section with Entry, Stop-Loss, Target 1, Target 2, Risk-Reward ratio
- End with a "### Verdict" section with a clear BUY/SELL/HOLD/WATCH recommendation

JSON STRUCTURE:
{
  "markdown_report": "<rich markdown analysis as described above>",
  "structured_data": {
    "sentiment_score": <number 0-100>,
    "technical_signals": ["<4-6 specific signals like 'RSI at 62 — neutral zone' or 'Price above 200-DMA'>"],
    "bullish_signals": ["<3-5 specific positive factors with numbers>"],
    "bearish_signals": ["<3-5 specific risk factors with numbers>"],
    "action_verdict": "<exactly one of: BUY | SELL | HOLD | WATCH>",
    "insights": { "quality": <0-100>, "valuation": <0-100>, "growth": <0-100> },
    "key_indicators": {
      "RSI": "<value and interpretation, e.g. '58.3 — Neutral'>",
      "MACD": "<signal, e.g. 'Bullish crossover'>",
      "SMA_50": "<above/below CMP with distance>",
      "SMA_200": "<above/below CMP with distance>",
      "Beta": "<estimated value>",
      "ADX": "<value and trend strength>"
    },
    "sector_comparison": {
      "pe_avg": <sector avg PE number>,
      "roe_avg": <sector avg ROE number>,
      "valuation_status": "<e.g. '12% Premium to sector' or '8% Discount to peers'>"
    },
    "price_targets": {
      "support": <nearest strong support price>,
      "resistance": <nearest resistance price>,
      "target_1m": <1-month price target>,
      "target_3m": <3-month price target>
    },
    "momentum_score": <0-100>,
    "volume_signal": "<High | Normal | Low>"
  }
}

QUALITY RULES:
- Every number in structured_data must be a real number, not a string (except where strings are specified)
- price_targets must be realistic — derived from 52W range, not arbitrary percentages
- support should be BELOW current price, resistance ABOVE
- target_1m and target_3m should account for the current trend direction
- sentiment_score must align with action_verdict (BUY=60-90, HOLD=40-60, SELL=10-40)
- Provide at least 4 technical_signals, 3 bullish_signals, and 3 bearish_signals`;

// ─────────────────────────────────────────────────────────────
// Response validator — ensures structured_data has valid types
// ─────────────────────────────────────────────────────────────
function validateAndFixStructuredData(data: any): any {
  if (!data || typeof data !== 'object') return null;

  // Ensure numeric fields are actually numbers
  const numericFields = ['sentiment_score', 'momentum_score'];
  for (const field of numericFields) {
    if (typeof data[field] === 'string') data[field] = parseFloat(data[field]) || 50;
    if (typeof data[field] !== 'number') data[field] = 50;
  }

  // Validate insights
  if (data.insights) {
    for (const key of ['quality', 'valuation', 'growth']) {
      if (typeof data.insights[key] === 'string') data.insights[key] = parseFloat(data.insights[key]) || 50;
      if (typeof data.insights[key] !== 'number') data.insights[key] = 50;
    }
  }

  // Validate price_targets
  if (data.price_targets) {
    for (const key of ['support', 'resistance', 'target_1m', 'target_3m']) {
      if (typeof data.price_targets[key] === 'string') {
        data.price_targets[key] = parseFloat(data.price_targets[key].replace(/[₹,]/g, '')) || 0;
      }
      if (typeof data.price_targets[key] !== 'number') data.price_targets[key] = 0;
    }
  }

  // Validate sector_comparison
  if (data.sector_comparison) {
    for (const key of ['pe_avg', 'roe_avg']) {
      if (typeof data.sector_comparison[key] === 'string') {
        data.sector_comparison[key] = parseFloat(data.sector_comparison[key]) || 0;
      }
    }
  }

  // Ensure arrays exist
  if (!Array.isArray(data.technical_signals)) data.technical_signals = [];
  if (!Array.isArray(data.bullish_signals)) data.bullish_signals = [];
  if (!Array.isArray(data.bearish_signals)) data.bearish_signals = [];

  // Validate action_verdict
  const validVerdicts = ['BUY', 'SELL', 'HOLD', 'WATCH'];
  if (!validVerdicts.includes(data.action_verdict)) {
    data.action_verdict = data.sentiment_score > 60 ? 'BUY' : data.sentiment_score > 40 ? 'HOLD' : 'SELL';
  }

  // Validate volume_signal
  const validVolume = ['High', 'Normal', 'Low'];
  if (!validVolume.includes(data.volume_signal)) data.volume_signal = 'Normal';

  return data;
}

// ─────────────────────────────────────────────────────────────
// Provider 1: OpenRouter (Primary)
// ─────────────────────────────────────────────────────────────
async function askOpenRouter(prompt: string, isChat: boolean = false) {
  if (!OPENROUTER_API_KEY) throw new Error("OpenRouter API key not configured");

  const systemMsg = isChat ? CHAT_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT;
  const model = isChat
    ? "google/gemini-2.5-flash"
    : "google/gemini-2.5-flash";

  const messages = [
    { role: "system", content: systemMsg },
    { role: "user", content: prompt + (isChat ? "" : "\n\nRespond with ONLY valid JSON. No text before or after the JSON object.") }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://parasramindiapanipat.com",
      "X-Title": "Parasram Intelligence"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: isChat ? 0.35 : 0.1,
      max_tokens: isChat ? 1024 : 2500,
      ...(isChat ? {} : { response_format: { type: "json_object" } })
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenRouter Error:", err);
    throw new Error(`OpenRouter API Error (${response.status}): ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  let content = data.choices?.[0]?.message?.content;
  const usedModel = data.model || model;

  if (!content) throw new Error("Empty response from OpenRouter");

  if (!isChat) {
    try {
      const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      // Validate structured data
      if (parsed.structured_data) {
        parsed.structured_data = validateAndFixStructuredData(parsed.structured_data);
      }
      content = parsed;
    } catch (e) {
      console.warn("OpenRouter JSON parse failed, wrapping:", e);
      content = { markdown_report: typeof content === 'string' ? content : "Report parsing error." };
    }
  }

  return { result: content, model: `${usedModel} (OpenRouter)` };
}

// ─────────────────────────────────────────────────────────────
// Provider 2: Groq (Fallback 1)
// ─────────────────────────────────────────────────────────────
async function askGroq(prompt: string, isChat: boolean = false) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");

  const systemMsg = isChat ? CHAT_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT;

  // Groq has a strict token limit — aggressively truncate
  const maxPromptLen = isChat ? 2000 : 4000;
  const truncatedPrompt = prompt.length > maxPromptLen 
    ? prompt.slice(0, maxPromptLen) + "\n[Data truncated]"
    : prompt;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: truncatedPrompt + (isChat ? "" : "\n\nRespond with ONLY valid JSON.") }
      ],
      response_format: { type: isChat ? "text" : "json_object" },
      temperature: 0.1,
      max_tokens: isChat ? 2000 : 4000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${err.slice(0, 100)}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;

  if (!isChat) {
    try {
      const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.structured_data) {
        parsed.structured_data = validateAndFixStructuredData(parsed.structured_data);
      }
      content = parsed;
    } catch (e) {
      content = { markdown_report: typeof content === 'string' ? content : "Report parsing error." };
    }
  }

  return { result: content, model: "llama-3.3-70b-versatile (Groq)" };
}

// ─────────────────────────────────────────────────────────────
// Provider 3: Gemini Direct (Fallback 2)
// ─────────────────────────────────────────────────────────────
async function askGemini(prompt: string, isChat: boolean = false) {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  const systemMsg = isChat ? CHAT_SYSTEM_PROMPT : REPORT_SYSTEM_PROMPT;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": GEMINI_API_KEY
    },
    body: JSON.stringify({
      system_instruction: { parts: { text: systemMsg } },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 20000,
        responseMimeType: isChat ? "text/plain" : "application/json"
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${err.slice(0, 100)}`);
  }

  const data = await response.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");

  if (!isChat) {
    try {
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.structured_data) {
        parsed.structured_data = validateAndFixStructuredData(parsed.structured_data);
      }
      text = parsed;
    } catch (e) {
      text = { markdown_report: typeof text === 'string' ? text : "Report parsing error." };
    }
  }

  return { result: text, model: "gemini-2.0-flash" };
}

// ─────────────────────────────────────────────────────────────
// Pre-compute derived metrics on the server for richer prompts
// ─────────────────────────────────────────────────────────────
function enrichStockData(raw: any) {
  const price = parseFloat(String(raw.price).replace(/[₹,]/g, '')) || 0;
  const high52 = raw.high_52 || price * 1.15;
  const low52 = raw.low_52 || price * 0.85;
  const range52 = high52 - low52;
  const pos52w = range52 > 0 ? Math.round(((price - low52) / range52) * 100) : 50;

  const dayHigh = raw.day_high || price;
  const dayLow = raw.day_low || price;
  const dayRange = dayHigh - dayLow;
  const dayPos = dayRange > 0 ? Math.round(((price - dayLow) / dayRange) * 100) : 50;

  const changePct = parseFloat(raw.change_pct) || 0;
  const prevClose = raw.prev_close || (price / (1 + changePct / 100));
  const openPrice = raw.open_price || prevClose;

  const gapVsPrevClose = prevClose > 0 ? ((price - prevClose) / prevClose * 100).toFixed(2) : "0";
  const gapVsOpen = openPrice > 0 ? ((price - openPrice) / openPrice * 100).toFixed(2) : "0";

  const vol = raw.volume || 0;
  const volInMillions = vol > 0 ? (vol / 1_000_000).toFixed(2) : "N/A";

  const mcap = raw.market_cap || 0;
  const mcapTier = mcap > 100000 ? "Large Cap" : mcap > 20000 ? "Mid Cap" : mcap > 5000 ? "Small Cap" : "Micro Cap";

  // Approximate RSI from 52W position
  const rsiApprox = pos52w;
  const rsiSignal = rsiApprox > 70 ? "Overbought" : rsiApprox < 30 ? "Oversold" : "Neutral";

  // Approximate MACD & Moving Averages for AI context
  const macdSignal = (pos52w > 60 && changePct > 0) ? "Bullish Crossover" : (pos52w < 40 && changePct < 0) ? "Bearish Divergence" : "Neutral Trend";
  const sma50Approx = Math.round(price * (pos52w > 50 ? 0.96 : 1.04));
  const sma200Approx = Math.round(low52 + range52 * 0.45);

  // Approximate Sector Averages
  const isFin = String(raw.sector).includes("Finance") || String(raw.sector).includes("Bank") || String(raw.symbol).includes("BANK");
  const isTech = String(raw.sector).includes("IT") || String(raw.sector).includes("Tech");
  const isEnergy = String(raw.sector).includes("Energy") || String(raw.symbol).includes("RELIANCE");
  const secPE = isFin ? 16 : isTech ? 28 : isEnergy ? 20 : 22;
  const secROE = isFin ? 14 : isTech ? 22 : isEnergy ? 12 : 15;
  const secDE = isFin ? 4.0 : 0.4;

  // Support & resistance estimates from 52W
  const fib382 = high52 - range52 * 0.382;
  const fib618 = high52 - range52 * 0.618;
  const nearestSupport = price > fib382 ? Math.round(fib382) : Math.round(fib618);
  const nearestResistance = price < fib382 ? Math.round(fib382) : Math.round(high52 * 0.95);

  return {
    ...raw,
    price,
    high52, low52, pos52w,
    dayHigh, dayLow, dayPos,
    prevClose, openPrice,
    gapVsPrevClose, gapVsOpen,
    vol, volInMillions,
    mcap, mcapTier,
    changePct,
    rsiApprox, rsiSignal,
    macdSignal, sma50Approx, sma200Approx,
    secPE, secROE, secDE,
    nearestSupport, nearestResistance,
    fib382: Math.round(fib382),
    fib618: Math.round(fib618),
  };
}

// ─────────────────────────────────────────────────────────────
// Build the analysis prompt
// ─────────────────────────────────────────────────────────────
function buildAnalysisPrompt(s: any): string {
  return `Analyze this LIVE NSE/BSE stock for an Indian retail investor:

## Stock Data
| Metric | Value |
|--------|-------|
| **Name** | ${s.name} (${s.symbol}) |
| **Sector** | ${s.sector || "N/A"} |
| **Market Cap** | ₹${s.mcap ? s.mcap.toLocaleString('en-IN') + ' Cr' : 'N/A'} (${s.mcapTier}) |
| **CMP** | ₹${s.price.toLocaleString('en-IN')} |
| **Day Change** | ${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}% |
| **Open** | ₹${s.openPrice} |
| **Prev Close** | ₹${s.prevClose} |
| **Gap vs Prev Close** | ${s.gapVsPrevClose}% |
| **Gap vs Open** | ${s.gapVsOpen}% |
| **Day Range** | ₹${s.dayLow} – ₹${s.dayHigh} (Currently at ${s.dayPos}% of range) |
| **52W High** | ₹${s.high52} |
| **52W Low** | ₹${s.low52} |
| **52W Position** | ${s.pos52w}% (0%=at Low, 100%=at High) |
| **P/E Ratio** | ${s.pe || "N/A"} |
| **Volume** | ${s.volInMillions}M shares |
| **ROE** | ${s.roe || "N/A"} |
| **Debt/Equity** | ${s.debt_equity || "N/A"} |

## Real-Time Fundamental Approximations
| Metric | Stock Value | Sector/Peer Avg |
|--------|-------------|-----------------|
| **P/E Ratio** | ${s.pe || "N/A"} | ${s.secPE} |
| **ROE** | ${s.roe ? s.roe + "%" : "N/A"} | ${s.secROE}% |
| **Debt/Equity** | ${s.debt_equity || "N/A"} | ${s.secDE} |

## Pre-Computed Technical Hints
| Indicator | Value |
|-----------|-------|
| **RSI (14)** | ${s.rsiApprox} (${s.rsiSignal}) |
| **MACD Bias** | ${s.macdSignal} |
| **SMA 50** | ₹${s.sma50Approx} (Price is ${s.price > s.sma50Approx ? 'Above' : 'Below'}) |
| **SMA 200** | ₹${s.sma200Approx} (Price is ${s.price > s.sma200Approx ? 'Above' : 'Below'}) |
| **Fibonacci 38.2% Retracement** | ₹${s.fib382} |
| **Fibonacci 61.8% Retracement** | ₹${s.fib618} |
| **Estimated Support** | ₹${s.nearestSupport} |
| **Estimated Resistance** | ₹${s.nearestResistance} |
| **Detected Pattern** | ${s.patterns?.join(', ') || "N/A"} |
| **Momentum** | ${s.isBullish ? "Bullish" : "Bearish"} |

Provide a comprehensive professional analysis. The markdown_report must include:
1. **Executive Summary** — 2-line verdict with conviction level
2. **Financial Overview** — table of key metrics with sector comparison
3. **Price Action & Volume** — gap analysis, intraday positioning (${s.dayPos}% of day range), volume assessment
4. **Technical Analysis** — RSI (${s.rsiApprox}), MACD (${s.macdSignal}), key moving averages (SMA 50: ₹${s.sma50Approx}, SMA 200: ₹${s.sma200Approx}), support ₹${s.nearestSupport} / resistance ₹${s.nearestResistance}, chart pattern implications
5. **Fundamental Assessment** — P/E vs Sector Avg (${s.secPE}), ROE quality vs peers (${s.secROE}%), debt health vs peers (${s.secDE}), ${s.mcapTier} considerations
6. **Risk Factors** — 3 specific risks with estimated % impact
7. **Trade Setup** — table with Entry Zone, Stop-Loss, Target 1, Target 2, Risk-Reward Ratio
8. **Verdict** — final BUY/SELL/HOLD/WATCH call with timeframe

For structured_data price_targets: support ≈ ₹${s.nearestSupport}, resistance ≈ ₹${s.nearestResistance}. Calculate realistic target_1m and target_3m from these levels.`;
}

function buildChatPrompt(s: any, context: string, chatHistory: any[], chatMessage: string): string {
  let prompt = `## Stock Context\n${context}\n\n`;

  // Include the AI report context if available
  if (s.ai_report_summary) {
    prompt += `## Previous AI Analysis Summary\n${s.ai_report_summary}\n\n`;
  }

  if (chatHistory && chatHistory.length > 0) {
    prompt += `## Conversation History\n${chatHistory.map((m: any) => `**${m.role === 'user' ? 'CLIENT' : 'ANALYST'}:** ${m.text}`).join('\n\n')}\n\n`;
  }

  prompt += `## Client's Question\n${chatMessage}\n\nProvide a direct, actionable answer. Reference specific price levels and data from the context above.`;
  return prompt;
}

// ─────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
  if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    return new Response(JSON.stringify({ success: false, error: "Bot access denied." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false, error: "Authentication required" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const payload = await req.json();
    const { is_chat, chat_message, chat_history, context, ...stockData } = payload;

    // Enrich stock data with derived metrics
    const enriched = enrichStockData(stockData);
    let finalPrompt = "";

    if (is_chat) {
      console.log(`[AI Chat] ${stockData.symbol || 'unknown'}: "${chat_message?.slice(0, 50)}..."`);
      finalPrompt = buildChatPrompt(enriched, context || "", chat_history, chat_message);
    } else {
      console.log(`[AI Report] ${stockData.symbol} @ ₹${enriched.price} (${enriched.changePct}%)`);
      finalPrompt = buildAnalysisPrompt(enriched);
    }

    // Cascading fallback with timeout: OpenRouter (25s) → Groq (20s) → Gemini (15s)
    let result;
    const errors: string[] = [];

    if (OPENROUTER_API_KEY) {
      try {
        console.log(`→ OpenRouter (gemini-2.5-flash)...`);
        result = await withTimeout(askOpenRouter(finalPrompt, !!is_chat), 45000, "OpenRouter");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("✗ OpenRouter:", msg);
        errors.push(`OpenRouter: ${msg}`);
      }
    }

    if (!result && GROQ_API_KEY) {
      try {
        console.log("→ Groq (llama-3.3-70b)...");
        result = await withTimeout(askGroq(finalPrompt, !!is_chat), 20000, "Groq");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("✗ Groq:", msg);
        errors.push(`Groq: ${msg}`);
      }
    }

    if (!result && GEMINI_API_KEY) {
      try {
        console.log("→ Gemini (gemini-2.0-flash)...");
        result = await withTimeout(askGemini(finalPrompt, !!is_chat), 15000, "Gemini");
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("✗ Gemini:", msg);
        errors.push(`Gemini: ${msg}`);
      }
    }

    if (!result) {
      throw new Error(`All AI providers failed. ${errors.join(' | ')}`);
    }

    console.log(`✓ Analysis served by ${result.model}`);

    return new Response(
      JSON.stringify({ success: true, verdict: result.result, model: result.model }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
