/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

type ChatHistoryMessage = {
  role: string;
  text: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function askGroq(prompt: string, isChat: boolean = false) {
  if (!GROQ_API_KEY) throw new Error("Groq API key not configured");

  const systemMsg = isChat
    ? "You are 'Parasram Intelligence', a seasoned human stock market expert. Your tone should be friendly, confident, and professional—like a veteran analyst talking to a client. Use conversational markers like 'I see...', 'Looking at the charts...', or 'In my view...'. AVOID robotic 'As an AI' boilerplate. Be direct and helpful, using markdown for clarity."
    : `You are an elite AI stock market analyst for 'Parasram Intelligence'. 
Write a deep, professional analysis. 
STRICT REQUIREMENT: The 'markdown_report' must use Markdown TABLES for financial metrics and BULLET POINTS for pros/cons. AVOID paragraphs longer than 2 sentences. Include a '### Financial Overview' table.
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
        { role: "user", content: prompt }
      ],
      response_format: { type: isChat ? "text" : "json_object" },
      temperature: 0.1,
      max_tokens: 4000
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
STRICT REQUIREMENT: The 'markdown_report' must use Markdown TABLES for financial metrics and BULLET POINTS for pros/cons. AVOID paragraphs longer than 2 sentences. Include a '### Financial Overview' table.
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
        maxOutputTokens: 8000,
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
  if (!text) throw new Error("Empty response from Gemini");

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
    const safeChatHistory: ChatHistoryMessage[] = Array.isArray(chat_history)
      ? chat_history.filter((message): message is ChatHistoryMessage => (
          typeof message === "object" &&
          message !== null &&
          typeof (message as Record<string, unknown>).role === "string" &&
          typeof (message as Record<string, unknown>).text === "string"
        ))
      : [];
    let finalPrompt = "";

    if (is_chat) {
      console.log(`[AI Chat] Request for ${stockData.symbol || "unknown"}`);
      finalPrompt = `Context about the stock:\n${context}\n\n`;
      if (safeChatHistory.length > 0) {
        finalPrompt += `Recent Conversation History:\n${safeChatHistory.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n")}\n\n`;
      }
      finalPrompt += `USER QUESTION: ${chat_message}`;
    } else {
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
        Momentum: stockData.isBullish ? "Bullish" : "Bearish"
      }, null, 2);
    }

    let result;
    try {
      console.log("Attempting Groq analysis...");
      result = await askGroq(finalPrompt, !!is_chat);
    } catch (groqErr) {
      const groqMessage = getErrorMessage(groqErr);
      console.error("Groq failed, falling back to Gemini:", groqMessage);
      try {
        console.log("Attempting Gemini analysis...");
        result = await askGemini(finalPrompt, !!is_chat);
      } catch (geminiErr) {
        const geminiMessage = getErrorMessage(geminiErr);
        console.error("Gemini fallback also failed:", geminiMessage);
        throw new Error(`AI Services Unavailable. Groq: ${groqMessage} | Gemini: ${geminiMessage}`);
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
        error: getErrorMessage(error)
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
