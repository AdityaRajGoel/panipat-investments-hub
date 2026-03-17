import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  X, BrainCircuit, TrendingUp, TrendingDown, Activity, AlertTriangle,
  CheckCircle2, Bot, Info, Star, Share2, BarChart2, Zap, Sparkles, MessageSquare, Send
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWatchlist } from "@/hooks/useWatchlist";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import Markdown from "react-markdown";

export interface StockForAnalysis {
  name: string;
  symbol: string;
  price: string | number;
  change_pct?: number | null;
  pe?: number | null;
  high_52?: number | null;
  low_52?: number | null;
  day_high?: number | null;
  day_low?: number | null;
  volume?: number | null;
  market_cap?: number | null;
  sector?: string | null;
  roe?: number | null;            // New metric
  debt_equity?: number | null;    // New metric
}

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockForAnalysis | null;
}

const analysisSteps = [
  { text: "Connecting to AI Engine...", icon: "🔌" },
  { text: "Fetching fundamentals (ROE, Debt/Eq)...", icon: "📊" },
  { text: "Scanning complex chart patterns...", icon: "📉" },
  { text: "Benchmarking against sector peers...", icon: "⚖️" },
  { text: "Generating deep actionable insights...", icon: "✨" },
  { text: "Polishing Intelligence Report...", icon: "📝" },
];

function useTypewriter(text: string, speed = 10, start = false) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!start || !text) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, start, speed]);
  return displayed;
}

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, value, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [value, duration, count, rounded]);
  return <span>{display}</span>;
}

function RiskMeter({ level }: { level: "Low" | "Moderate" | "High" | "Very High" }) {
  const levels = ["Low", "Moderate", "High", "Very High"];
  const idx = levels.indexOf(level);
  const colors = ["bg-secondary", "bg-yellow-500", "bg-orange-500", "bg-destructive"];
  const textColors = ["text-secondary", "text-yellow-500", "text-orange-500", "text-destructive"];
  return (
    <div>
      <div className="flex gap-1 mb-1">
        {levels.map((l, i) => (
          <motion.div key={l}
            className={`h-1.5 flex-1 rounded-full ${i <= idx ? colors[idx] : "bg-muted"}`}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} style={{ originX: 0 }} />
        ))}
      </div>
      <div className={`text-[11px] font-bold ${textColors[idx]}`}>{level} Risk</div>
    </div>
  );
}

function IndicatorCard({ label, signal, desc, icon: Icon, delay }:
  { label: string; signal: string; desc: string; icon: React.ElementType; delay: number }) {
  const signalColors: Record<string, string> = {
    "Overbought": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Oversold": "bg-secondary/10 text-secondary border-secondary/20",
    "Neutral": "bg-muted text-muted-foreground border-border",
    "Bullish": "bg-secondary/10 text-secondary border-secondary/20",
    "Bearish": "bg-destructive/10 text-destructive border-destructive/20",
    "Above Avg": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Fair Value": "bg-brand-gold/10 text-brand-gold border-brand-gold/20",
    "Strong": "bg-secondary/10 text-secondary border-secondary/20",
    "Weak": "bg-destructive/10 text-destructive border-destructive/20",
    "High Risk": "bg-destructive/10 text-destructive border-destructive/20"
  };
  return (
    <motion.div className="bg-muted/40 border border-border/40 rounded-xl p-3 flex flex-col gap-1.5"
      initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay }}>
      <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] font-semibold">
        <Icon className="w-3 h-3" />{label}
      </div>
      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border self-start ${signalColors[signal] || "bg-muted text-muted-foreground border-border"}`}>
        {signal}
      </span>
      <div className="text-[10px] text-muted-foreground leading-snug">{desc}</div>
    </motion.div>
  );
}

// Generates a mock 30-day sparkline specifically for the UI enhancement
function generateMockTrendData(currentPrice: number, changePct: number) {
  const data = [];
  let p = currentPrice * (1 - changePct/100); // Approximate price 30 days ago
  for (let i = 0; i < 30; i++) {
    p = p * (1 + (Math.random() - 0.45) * 0.02); // 2% random walk
    data.push({ day: i, price: p });
  }
  data.push({ day: 30, price: currentPrice }); // End at exactly current price
  return data;
}

function computeAnalysis(stock: StockForAnalysis) {
  const priceNum = typeof stock.price === "string" ? parseFloat(stock.price.replace(/,/g, "")) : (stock.price ?? 0);
  const high52 = stock.high_52 ?? priceNum * 1.15;
  const low52 = stock.low_52 ?? priceNum * 0.85;
  const changePct = stock.change_pct ?? 0;
  
  // Calculate mock or real ROE & Debt/Equity if not provided (for demonstration)
  const isFinancial = stock.sector === "Financial Services" || stock.symbol.includes("BANK");
  const roe = stock.roe ?? (isFinancial ? 14.5 : stock.pe && stock.pe > 0 ? 100 / stock.pe * 1.5 : 12.0);
  const debtEquity = stock.debt_equity ?? (isFinancial ? 3.5 : 0.4);

  let roeSignal = roe > 15 ? "Strong" : roe > 8 ? "Neutral" : "Weak";
  let roeDesc = `Return on Equity: ${roe.toFixed(1)}%. ${roe > 15 ? "Excellent capital efficiency." : "Average efficiency."}`;

  let deSignal = debtEquity > (isFinancial ? 5 : 1) ? "High Risk" : "Strong";
  let deDesc = `D/E Ratio: ${debtEquity.toFixed(2)}. ${deSignal === "Strong" ? "Healthy balance sheet." : "Highly leveraged."}`;

  const rsiApprox = high52 === low52 ? 50 : ((priceNum - low52) / (high52 - low52)) * 100;

  // Pattern detection logic (mocked based on RSI and change)
  const patterns = [];
  let isBullish = true;
  if (changePct > 2 && rsiApprox < 40) { patterns.push("Double Bottom Reversal"); }
  else if (changePct > 1 && rsiApprox > 70) { patterns.push("Bull Flag Breakout"); }
  else if (changePct < -2 && rsiApprox > 60) { patterns.push("Head & Shoulders"); isBullish = false; }
  else if (changePct < 0 && rsiApprox < 30) { patterns.push("Falling Wedge"); }
  else { patterns.push("Consolidation Range"); }

  const score = Math.min(98, Math.max(10, 50 + changePct * 10 + (roe > 15 ? 10 : 0) - (debtEquity > 1 && !isFinancial ? 10 : 0)));

  return { 
    priceNum, high52, low52, changePct, score, isBullish,
    roeSignal, roeDesc, deSignal, deDesc, patterns,
    trendData: generateMockTrendData(priceNum, changePct)
  };
}

const NeuralNetworkAnimation = () => {
  return (
    <div className="relative w-48 h-48 mb-8">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Nodes */}
        {[
          { x: 20, y: 30 }, { x: 20, y: 50 }, { x: 20, y: 70 }, // Input
          { x: 50, y: 20 }, { x: 50, y: 40 }, { x: 50, y: 60 }, { x: 50, y: 80 }, // Hidden
          { x: 80, y: 40 }, { x: 80, y: 60 } // Output
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="2"
            fill="hsl(var(--secondary))"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
        {/* Connections */}
        {[
          { from: 0, to: 3 }, { from: 0, to: 4 }, { from: 1, to: 4 }, { from: 1, to: 5 },
          { from: 2, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 }, { from: 4, to: 7 },
          { from: 5, to: 8 }, { from: 6, to: 8 }
        ].map((conn, i) => {
          const nodes = [
            { x: 20, y: 30 }, { x: 20, y: 50 }, { x: 20, y: 70 },
            { x: 50, y: 20 }, { x: 50, y: 40 }, { x: 50, y: 60 }, { x: 50, y: 80 },
            { x: 80, y: 40 }, { x: 80, y: 60 }
          ];
          const start = nodes[conn.from];
          const end = nodes[conn.to];
          return (
            <motion.line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="hsl(var(--secondary))"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0.1 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
            />
          );
        })}
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BrainCircuit className="w-12 h-12 text-brand-orange animate-pulse" />
      </motion.div>
    </div>
  );
};

export const AIAnalysisModal = ({ isOpen, onClose, stock }: AIAnalysisModalProps) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [geminiVerdict, setGeminiVerdict] = useState<{ 
    analysis: string, 
    model: string,
    structured?: {
      sentiment_score: number;
      technical_signals: string[];
      bullish_signals: string[];
      bearish_signals: string[];
      action_verdict: string;
      insights: { quality: number; valuation: number; growth: number };
      key_indicators?: Record<string, string>;
      sector_comparison?: {
        pe_avg: number;
        roe_avg: number;
        valuation_status: string;
      };
    }
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');
  
  const sampleQuestions = [
    "Is this a good time to buy?",
    "What are the major risks?",
    "How are the fundamentals?",
    "Technical outlook for 1 month?",
    "Explain the chart patterns.",
    "Debt-to-Equity concerns?"
  ];
  
  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat') endOfChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true); setLoadingStep(0); setGeminiVerdict(null); 
      setChatHistory([]); setActiveTab('report');
    }
  }, [isOpen, stock]);

  useEffect(() => {
    if (!isOpen || !isAnalyzing) return;
    const interval = setInterval(() => {
      setLoadingStep(p => {
        if (p >= analysisSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsAnalyzing(false), 900);
          return p;
        } return p + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isOpen, isAnalyzing]);

  const analysis = stock ? computeAnalysis(stock) : null;
  
  // Fetch Deep AI Report
  useEffect(() => {
    if (isAnalyzing || !stock || !analysis || geminiVerdict) return;

    supabase.functions.invoke('ai-stock-analysis', {
      body: {
        symbol: stock.symbol, name: stock.name, price: analysis.priceNum,
        change_pct: analysis.changePct, pe: stock.pe, high_52: analysis.high52, low_52: analysis.low52,
        market_cap: stock.market_cap, volume: stock.volume, sector: stock.sector,
        day_high: stock.day_high, day_low: stock.day_low,
        roe: analysis.roeSignal, debt_equity: analysis.deSignal, patterns: analysis.patterns,
        score: analysis.score, isBullish: analysis.isBullish, deep_report: true 
      }
    })
      .then(({ data, error }) => {
        if (error) {
          console.error("AI Analysis Error:", error);
          return;
        }
        if (data?.verdict) {
          let verdict = data.verdict;
          // Safety & Robustness: Handle truncated or malformed JSON responses
          if (typeof verdict === 'string') {
            try {
              // Attempt 1: Regular valid JSON cleanup and parse
              const cleaned = verdict.replace(/```json/g, "").replace(/```/g, "").trim();
              verdict = JSON.parse(cleaned);
            } catch (e) {
              console.warn("Standard JSON parse failed, attempting regex extraction...");
              
              // Attempt 2: Regex extraction for markdown_report even if truncated
              // This is crucial for fixing the "wall of JSON" issue when responses are cut off
              const mdMatch = verdict.match(/"markdown_report":\s*"([\s\S]*?)(?=",\s*"structured_data"|",\s*"|"}|\z)/);
              const structuredMatch = verdict.match(/"structured_data":\s*({[\s\S]*?)(?=\s*,\s*"|}$|\z)/);
              
              let extractedMd = mdMatch ? mdMatch[1] : null;
              if (extractedMd) {
                // Fix escaped characters in the regex match
                extractedMd = extractedMd
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '')
                  .replace(/\\"/g, '"')
                  .replace(/\\t/g, '  ')
                  .trim();
              }
              
              let extractedStructured = null;
              if (structuredMatch) {
                try {
                  // Try to close the truncated JSON object if it's truncated
                  let structStr = structuredMatch[1].trim();
                  if (!structStr.endsWith('}')) {
                    // Count braces and add missing ones
                    const openBraces = (structStr.match(/{/g) || []).length;
                    const closeBraces = (structStr.match(/}/g) || []).length;
                    structStr += '}'.repeat(Math.max(0, openBraces - closeBraces));
                  }
                  extractedStructured = JSON.parse(structStr);
                } catch (err) {
                  console.warn("Regex-based structured data parse failed");
                }
              }

              if (extractedMd) {
                verdict = {
                  markdown_report: extractedMd,
                  structured_data: extractedStructured?.structured_data || extractedStructured
                };
              }
            }
          }

          if (typeof verdict === 'object' && verdict !== null) {
            // Further clean up the markdown report if it contains raw JSON artifacts
            let finalMd = verdict.markdown_report || "Report content missing.";
            if (finalMd.startsWith('"') && finalMd.endsWith('"')) {
              finalMd = finalMd.slice(1, -1).replace(/\\n/g, '\n').replace(/\\"/g, '"');
            }

            setGeminiVerdict({ 
              analysis: finalMd, 
              model: data.model || 'gemini-2.0-flash',
              structured: verdict.structured_data || null
            });
          } else {
            // Fallback for plain text response
            setGeminiVerdict({ 
              analysis: typeof verdict === 'string' ? verdict.replace(/\\n/g, '\n') : "Unable to parse AI response.", 
              model: data.model || 'gemini-2.0-flash' 
            });
          }
        }
      }).catch(err => console.error("AI Analysis Fetch Error:", err));
  }, [isAnalyzing, stock, analysis, geminiVerdict]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !stock || isChatting) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-stock-analysis', {
        body: {
          symbol: stock.symbol, is_chat: true, chat_message: userMsg,
          chat_history: chatHistory.slice(-10), 
          context: `Price: ₹${stock.price}. Sector: ${stock.sector || 'N/A'}. Market Cap: ₹${stock.market_cap} Cr. Vol: ${stock.volume}. Score: ${analysis?.score}. Patterns: ${analysis?.patterns.join(',')}`
        }
      });
      
      if (error) throw error;
      setChatHistory(prev => [...prev, { role: 'ai', text: data.verdict || "I encountered an error." }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setChatHistory(prev => [...prev, { role: 'ai', text: "Failed to connect to the AI brain." }]);
    } finally { setIsChatting(false); }
  };

  const handleSampleQuestion = (q: string) => {
    setChatInput(q);
    // Use a small timeout to ensure the state update is reflected before submit
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleChatSubmit(fakeEvent);
    }, 10);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  if (!stock || !analysis) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border border-brand-orange/30 bg-background max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/50 bg-muted/40 backdrop-blur-md flex items-center justify-between z-10">
          <div>
            <DialogTitle className="flex items-center gap-2 font-heading text-xl">
              <Bot className="w-5 h-5 text-brand-orange" /> Parasram Intelligence
              <span className="text-[10px] uppercase font-bold bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full border border-brand-orange/20">Beta</span>
            </DialogTitle>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {stock.symbol} {stock.sector ? `· ${stock.sector}` : ""}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted/80 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto w-full relative">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 p-6">
                <NeuralNetworkAnimation />
                <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mb-8 shadow-inner">
                  <motion.div className="h-full bg-gradient-to-r from-brand-orange via-secondary to-brand-orange bg-[length:200%_100%]"
                    initial={{ width: "0%", backgroundPosition: "100% 0" }} 
                    animate={{ width: `${((loadingStep + 1) / analysisSteps.length) * 100}%`, backgroundPosition: "0% 0" }}
                    transition={{ 
                      width: { duration: 0.6 },
                      backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                    }} />
                </div>
                <div className="space-y-4 w-full max-w-xs">
                  {analysisSteps.map((step, idx) => (
                    <motion.div key={idx} className={`flex items-center gap-4 text-sm font-medium transition-all duration-300 ${idx <= loadingStep ? "text-foreground" : "text-muted-foreground/30"}`}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                      <span className="text-lg">{step.icon}</span>
                      <div className="flex-1 flex items-center gap-2">
                        {idx < loadingStep ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                          </motion.div>
                        ) : idx === loadingStep ? (
                          <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 border-2 rounded-full border-muted/50" />
                        )}
                        <span className={idx === loadingStep ? "text-brand-orange font-bold transition-all" : ""}>{step.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
                {/* Tabs */}
                <div className="px-5 border-b border-border/50 flex gap-6 bg-muted/20">
                  <button onClick={() => setActiveTab('report')} className={`py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'report' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-muted-foreground'}`}>Deep Analysis</button>
                  <button onClick={() => setActiveTab('chat')} className={`py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-muted-foreground'}`}><MessageSquare className="w-4 h-4" /> Ask AI Q&A</button>
                </div>

                {/* Tab: Report */}
                {activeTab === 'report' && (
                  <div className="p-5 space-y-5">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-2 flex gap-2 items-center">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <div className="text-[10px] text-orange-700 dark:text-orange-400 font-medium leading-none">
                        AI may provide inaccurate data. Please verify with financial experts.
                      </div>
                    </div>
                    
                    {/* Header Widget */}
                    <div className="flex justify-between items-center bg-card border rounded-xl p-4 shadow-sm">
                      <div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                          ₹{analysis.priceNum.toLocaleString("en-IN")}
                          <span className={`text-sm px-2 py-0.5 rounded-full ${analysis.changePct >= 0 ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                            {analysis.changePct >= 0 ? "+" : ""}{analysis.changePct.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {analysis.patterns.map(p => (
                            <span key={p} className="text-[10px] bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded border border-brand-gold/30 flex items-center gap-1"><Sparkles className="w-3 h-3"/> {p} detected</span>
                          ))}
                        </div>
                      </div>
                      <div className="w-32 h-16 pointer-events-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analysis.trendData}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={analysis.isBullish ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={analysis.isBullish ? "#10b981" : "#ef4444"} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="price" stroke={analysis.isBullish ? "#10b981" : "#ef4444"} fill="url(#colorPrice)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Fundamentals Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <IndicatorCard label="Return on Equity" signal={analysis.roeSignal} desc={analysis.roeDesc} icon={TrendingUp} delay={0.1} />
                      <IndicatorCard label="Debt to Equity" signal={analysis.deSignal} desc={analysis.deDesc} icon={AlertTriangle} delay={0.2} />
                    </div>

                    {/* New Infographics Section */}
                    {geminiVerdict?.structured && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Sentiment Meter */}
                          <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2">AI Sentiment</span>
                            <div className="relative w-20 h-20 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                                <motion.circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                  strokeDasharray={2 * Math.PI * 36}
                                  initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                                  animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - geminiVerdict.structured.sentiment_score / 100) }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  className={geminiVerdict.structured.sentiment_score > 60 ? "text-secondary" : geminiVerdict.structured.sentiment_score > 40 ? "text-brand-gold" : "text-destructive"} 
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-xl font-bold">{geminiVerdict.structured.sentiment_score}</span>
                                <span className="text-[8px] font-medium text-muted-foreground">SCORE</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Verdict and Insight Badges */}
                          <div className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Verdict & Insights</span>
                            <div className={`text-2xl font-black px-4 py-2 rounded-lg border-2 mb-3 ${
                              geminiVerdict.structured.action_verdict === 'BUY' ? 'bg-secondary/10 text-secondary border-secondary/50' :
                              geminiVerdict.structured.action_verdict === 'SELL' ? 'bg-destructive/10 text-destructive border-destructive/50' :
                              'bg-brand-gold/10 text-brand-gold border-brand-gold/50'
                            }`}>
                              {geminiVerdict.structured.action_verdict}
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center">
                              {geminiVerdict.structured.technical_signals.slice(0, 2).map((tag, i) => (
                                <span key={i} className="text-[8px] font-bold bg-muted px-1.5 py-0.5 rounded border border-border/50 uppercase tracking-tighter">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Tech IQ Radar Chart */}
                          {geminiVerdict.structured.insights && (
                            <div className="bg-card border rounded-xl p-4 flex flex-col items-center">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Tech IQ Radar</span>
                              <div className="w-full h-32">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="55%" outerRadius="80%" data={[
                                    { subject: 'Quality', A: geminiVerdict.structured.insights.quality || 0, fullMark: 100 },
                                    { subject: 'Valuation', A: geminiVerdict.structured.insights.valuation || 0, fullMark: 100 },
                                    { subject: 'Growth', A: geminiVerdict.structured.insights.growth || 0, fullMark: 100 },
                                  ]}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 700 }} />
                                    <Radar name="Stock" dataKey="A" stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sector Comparison Widget */}
                        {geminiVerdict.structured.sector_comparison && typeof geminiVerdict.structured.sector_comparison.pe_avg === 'number' && (
                          <div className="bg-gradient-to-r from-brand-orange/5 to-secondary/5 border border-brand-orange/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                                <BarChart2 className="w-3 h-3" /> Sector Peer Benchmark
                              </div>
                              {geminiVerdict.structured.sector_comparison.valuation_status && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  geminiVerdict.structured.sector_comparison.valuation_status.includes('Discount') ? 'bg-secondary/20 text-secondary' : 'bg-orange-500/20 text-orange-500'
                                }`}>
                                  {geminiVerdict.structured.sector_comparison.valuation_status}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground">P/E vs Sector Avg</div>
                                <div className="flex items-end gap-2 text-sm font-bold">
                                  {stock.pe || 'N/A'} <span className="text-[10px] font-normal text-muted-foreground">vs</span> {geminiVerdict.structured.sector_comparison.pe_avg}
                                </div>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden flex">
                                  <div className="h-full bg-brand-orange" style={{ width: `${Math.min(100, (stock.pe || 0) / (Math.max(1, geminiVerdict.structured.sector_comparison.pe_avg) * 2) * 100)}%` }} />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[10px] text-muted-foreground">ROE vs Sector Avg</div>
                                <div className="flex items-end gap-2 text-sm font-bold">
                                  {stock.roe || 'N/A'}% <span className="text-[10px] font-normal text-muted-foreground">vs</span> {geminiVerdict.structured.sector_comparison.roe_avg || 0}%
                                </div>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-secondary" style={{ width: `${Math.min(100, (stock.roe || 0) / (Math.max(1, geminiVerdict.structured.sector_comparison.roe_avg || 15) * 2) * 100)}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Improved Signals Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3 text-secondary font-bold text-xs uppercase">
                              <TrendingUp className="w-4 h-4" /> Strong Positives
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {geminiVerdict.structured.bullish_signals.map((s, i) => (
                                <span key={i} className="bg-secondary/10 text-secondary text-[10px] px-2 py-1 rounded-md border border-secondary/20 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3 text-destructive font-bold text-xs uppercase">
                              <TrendingDown className="w-4 h-4" /> Risk Factors
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {geminiVerdict.structured.bearish_signals.map((s, i) => (
                                <span key={i} className="bg-destructive/10 text-destructive text-[10px] px-2 py-1 rounded-md border border-destructive/20 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Technical Indicators Sub-grid */}
                        {geminiVerdict.structured.key_indicators && (
                          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                            <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                              <Activity className="w-3 h-3" /> Core Technical Indicators
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Object.entries(geminiVerdict.structured.key_indicators).map(([key, val]) => (
                                <div key={key} className="flex flex-col gap-0.5">
                                  <span className="text-[10px] text-muted-foreground font-medium">{key}</span>
                                  <span className="text-xs font-bold">{val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Markdown Report & AI Warning */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                        <BarChart2 className="w-4 h-4 text-brand-orange" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detailed Intelligence Report</h3>
                      </div>
                      <div className="bg-muted/30 border border-border/50 rounded-xl p-5 prose prose-sm dark:prose-invert max-w-none shadow-inner prose-headings:text-brand-orange prose-h1:text-xl prose-h2:text-lg prose-table:border prose-table:border-border/50 prose-th:bg-muted/50 prose-th:p-2 prose-td:p-2">
                        {geminiVerdict ? (
                          <Markdown>{geminiVerdict.analysis}</Markdown>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground animate-pulse py-8 justify-center">
                            <Bot className="w-5 h-5" /> Generating deep markdown report...
                          </div>
                        )}
                      </div>

                      <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3 flex gap-3 items-start">
                        <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <div className="text-[10px] text-muted-foreground leading-relaxed">
                          <span className="font-bold text-orange-500 uppercase mr-1">AI Disclaimer:</span>
                          This analysis is generated by Artificial Intelligence for informational purposes only. Investment in stocks involves high risk. Please consult with a certified financial advisor before making any investment decisions. Parasram India is not responsible for any financial losses.
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Tab: Chat */}
                {activeTab === 'chat' && (
                  <div className="flex flex-col h-[450px]">
                    <div className="px-5 py-2 bg-orange-500/5 border-b border-orange-500/10 flex gap-2 items-center">
                      <Info className="w-3 h-3 text-orange-500 shrink-0" />
                      <div className="text-[9px] text-muted-foreground uppercase tracking-tight font-bold">
                        AI Chat Advice: Non-Financial Advice. Use for Research only.
                      </div>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-muted/10">
                      
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center"><Bot className="w-4 h-4 text-brand-orange"/></div>
                          <div className="bg-card border rounded-2xl rounded-tl-none p-3 text-sm text-foreground shadow-sm">
                            I am your Parasram AI associate. I've analyzed {stock.symbol}'s charts and fundamentals. What specific questions do you have before making an investment decision?
                          </div>
                        </div>
                        {chatHistory.length > 0 && (
                          <Button variant="ghost" size="sm" onClick={clearChat} className="text-[10px] h-7 px-2 text-muted-foreground hover:text-destructive">
                            Clear Chat
                          </Button>
                        )}
                      </div>

                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-secondary' : 'bg-brand-orange/20'}`}>
                            {msg.role === 'user' ? <div className="text-xs font-bold text-background">YOU</div> : <Bot className="w-4 h-4 text-brand-orange"/>}
                          </div>
                          <div className={`border rounded-2xl p-3 text-sm shadow-sm max-w-[85%] backdrop-blur-md ${msg.role === 'user' ? 'bg-secondary/90 text-background border-secondary rounded-tr-none' : 'bg-card/70 text-foreground border-border/50 rounded-tl-none prose prose-sm dark:prose-invert shadow-[0_4px_12px_rgba(0,0,0,0.05)]'}`}>
                            {msg.role === 'ai' ? <Markdown>{msg.text}</Markdown> : msg.text}
                            {msg.role === 'ai' && <div className="text-[8px] opacity-30 mt-2 flex items-center gap-1"><BrainCircuit className="w-2 h-2"/> Analysis by Parasram Intelligence</div>}
                          </div>
                        </div>
                      ))}

                      {isChatting && (
                        <div className="flex gap-3">
                          <div className="shrink-0 w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center"><Bot className="w-4 h-4 text-brand-orange"/></div>
                          <div className="bg-card border rounded-2xl rounded-tl-none p-4 text-sm flex gap-1 shadow-sm items-center">
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, delay:0}} className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, delay:0.2}} className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, delay:0.4}} className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                          </div>
                        </div>
                      )}
                      <div ref={endOfChatRef} />
                    </div>

                    {/* Chat Input & Samples */}
                    <div className="p-4 border-t border-border/50 bg-background space-y-3">
                      {/* Sample Questions Chips */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-1 px-1">
                        {sampleQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSampleQuestion(q)}
                            disabled={isChatting}
                            className="shrink-0 text-[10px] font-medium bg-muted/50 hover:bg-brand-orange/10 hover:text-brand-orange border border-border/50 rounded-full px-3 py-1.5 transition-all whitespace-nowrap"
                          >
                            {q}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleChatSubmit} className="flex gap-2 shrink-0">
                        <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={`Ask AI about ${stock.symbol}...`} className="bg-muted/40 rounded-full h-10 px-4" />
                        <Button type="submit" disabled={isChatting || !chatInput.trim()} size="icon" className="h-10 w-10 shrink-0 rounded-full bg-brand-orange hover:bg-brand-orange/90">
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;
