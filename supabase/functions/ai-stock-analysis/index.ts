/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface GroqResponse {
  choices: Array<{
    message: {
      content: any;
    };
  }>;
}


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const BOT_USER_AGENTS = [
  "googlebot", "bingbot", "yandexbot", "duckduckbot", "slurp", "baiduspider", "ia_archiver",
  "facebot", "facebookexternalhit", "twitterbot", "rogerbot", "linkedinbot", "embedly", 
  "quora link preview", "showyoubot", "outbrain", "pinterest/0.", "developers.google.com/+/web/snippet",
  "slackbot", "vkShare", "W3C_Validator", "redditbot", "Applebot", "WhatsApp", "flipboard", 
  "Tumblr", "bitlybot", "SkypeShell", "TelegramBot", "Skype", "node-fetch", "axios", "python-requests"
];

async function askGroq(prompt: string, isChat: boolean = false) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");

  const systemMsg = isChat
    ? "You are 'Parasram Intelligence', a seasoned human stock market expert. Your tone should be friendly, confident, and professional—like a veteran analyst talking to a client. Use conversational markers like 'I see...', 'Looking at the charts...', or 'In my view...'. AVOID robotic 'As an AI' boilerplate. Be direct and helpful, using markdown for clarity."
    : `You are an elite AI stock market analyst for 'Parasram Intelligence'. 
Write a deep, professional analysis. 
STRICT REQUIREMENT: Return the result as a JSON object.
The 'markdown_report' field must use Markdown TABLES for financial metrics and BULLET POINTS for pros/cons. AVOID paragraphs longer than 2 sentences. Include a '### Financial Overview' table. 
Ensure the markdown is rich and avoids raw JSON characters inside the strings.
Structure:
{
  "markdown_report": "Valid Markdown with Tables and Lists",
  "structured_data": {
    "sentiment_score": 0-100,
    "technical_signals": ["Signal 1", "Signal 2"],
    "bullish_signals": ["Factor 1", "Factor 2"],
    "bearish_signals": ["Risk 1", "Risk 2"],
    "action_verdict": "BUY" | "SELL" | "HOLD" | "WATCH",
    "insights": { "quality": 0-100, "valuation": 0-100, "growth": 0-100 },
    "key_indicators": { "RSI": "Value", "MACD": "Signal", "SMA": "Signal" },
    "sector_comparison": { "pe_avg": 0, "roe_avg": 0, "valuation_status": "Premium/Discount" }
  }
}`;

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
        { role: "user", content: prompt + (isChat ? "" : "\n\nResponse must be a JSON object.") }
      ],
      response_format: { type: isChat ? "text" : "json_object" },
      temperature: 0.1,
      max_tokens: 8000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq Error:", err);
    throw new Error(`Groq API Error (${response.status}): ${err.slice(0, 100)}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content;
  
  if (!isChat) {
    try {
      // Clean up markdown code blocks if present
      const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
      content = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse JSON from Groq:", e);
      // If it's not valid JSON, we return it as is but wrap it to match our internal structure if needed
      if (typeof content === 'string') {
        content = { markdown_report: content };
      }
    }
  }

  return { result: content, model: "llama-3.3-70b-versatile (Groq)" };
}

async function askGemini(prompt: string, isChat: boolean = false) {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  const systemMsg = isChat
    ? "You are 'Parasram Intelligence', a seasoned human stock market expert. Your tone should be friendly, confident, and professional—like a veteran analyst talking to a client. Use conversational markers like 'I see...', 'Looking at the charts...', or 'In my view...'. AVOID robotic 'As an AI' boilerplate. Be direct and helpful, using markdown for clarity."
    : `You are an elite AI stock market analyst for 'Parasram Intelligence'. 
Write a deep, professional analysis. 
STRICT REQUIREMENT: Return the result as a JSON object.
The 'markdown_report' field must use Markdown TABLES for financial metrics and BULLET POINTS for pros/cons. AVOID paragraphs longer than 2 sentences. Include a '### Financial Overview' table.
Ensure the markdown is rich and avoids raw JSON characters inside the strings.
Structure:
{
  "markdown_report": "Valid Markdown with Tables and Lists",
  "structured_data": {
    "sentiment_score": 0-100,
    "technical_signals": ["Signal 1", "Signal 2"],
    "bullish_signals": ["Factor 1", "Factor 2"],
    "bearish_signals": ["Risk 1", "Risk 2"],
    "action_verdict": "BUY" | "SELL" | "HOLD" | "WATCH",
    "insights": { "quality": 0-100, "valuation": 0-100, "growth": 0-100 },
    "key_indicators": { "RSI": "Value", "MACD": "Signal", "SMA": "Signal" },
    "sector_comparison": { "pe_avg": 0, "roe_avg": 0, "valuation_status": "Premium/Discount" }
  }
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
  
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
        maxOutputTokens: 16000,
        responseMimeType: isChat ? "text/plain" : "application/json"
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Gemini Error:", err);
    throw new Error(`Gemini API Error (${response.status}): ${err.slice(0, 100)}`);
  }

  const data = await response.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error("Gemini Empty Response:", JSON.stringify(data));
    throw new Error("Empty response from Gemini");
  }

  if (!isChat) {
    try {
      // Clean up markdown code blocks if present
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      text = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Failed to parse JSON from Gemini:", e);
      if (typeof text === 'string') {
        text = { markdown_report: text };
      }
    }
  }

  return { result: text, model: "gemini-flash-latest" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
  if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    console.warn(`[Blocked] Bot detected: ${userAgent}`);
    return new Response(JSON.stringify({ success: false, error: "Bot access denied. Data scraping is prohibited." }), {
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
    let finalPrompt = "";

    if (is_chat) {
      // Chat mode
      console.log(`[AI Chat] Request for ${stockData.symbol || 'unknown'}`);
      finalPrompt = `Context about the stock:\n${context}\n\n`;
      if (chat_history && chat_history.length > 0) {
         finalPrompt += `Recent Conversation History:\n${chat_history.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}\n\n`;
      }
      finalPrompt += `USER QUESTION: ${chat_message}`;
    } else {
      // Deep Report mode
      console.log(`[AI Report] Detailed analysis request for ${stockData.symbol}`);
      finalPrompt = `Analyze this live market data:\n` + JSON.stringify({
        Symbol: stockData.symbol,
        Name: stockData.name,
        CMP: stockData.price,
        Change: `${stockData.change_pct}%`,
        PE: stockData.pe || "N/A",
        "52W High": stockData.high_52,
        "52W Low": stockData.low_52,
        "ROE Profile": stockData.roe,
        "Debt/Equity Profile": stockData.debt_equity,
        "Detected Chart Patterns": stockData.patterns,
        "Technical Score": `${stockData.score}/100`,
        "Momentum": stockData.isBullish ? "Bullish" : "Bearish"
      }, null, 2);
    }

    let result;
    try {
      // Try Groq first for blazing speed
      console.log("Attempting Groq analysis...");
      result = await askGroq(finalPrompt, !!is_chat);
    } catch (groqErr) {
      console.error("Groq failed, falling back to Gemini:", groqErr.message);
      try {
        console.log("Attempting Gemini analysis...");
        result = await askGemini(finalPrompt, !!is_chat);
      } catch (geminiErr) {
        console.error("Gemini fallback also failed:", geminiErr.message);
        throw new Error(`AI Services Unavailable. Groq: ${groqErr.message} | Gemini: ${geminiErr.message}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        verdict: result.result, 
        model: result.model
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function top-level error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
