import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Globe, TrendingUp, Clock, ChevronRight, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { lovableSupabase } from "@/integrations/supabase/lovable-client";
import { supabase } from "@/integrations/supabase/client";

type NewsItem = {
  title: string;
  summary: string;
  category: string;
  timeAgo: string;
  timestamp?: string;
  source: string;
};

const fallbackIndian: NewsItem[] = [
  { title: "Sensex rallies 400 pts as IT stocks surge on strong Q4 results", summary: "Benchmark indices rose sharply led by gains in IT heavyweights after better-than-expected quarterly earnings.", category: "Markets", timeAgo: "2h ago", source: "Economic Times" },
  { title: "RBI keeps repo rate unchanged at 6.5% for eighth consecutive time", summary: "The central bank maintained its accommodative stance citing inflation concerns and global uncertainty.", category: "Policy", timeAgo: "4h ago", source: "LiveMint" },
  { title: "Reliance Industries crosses ₹20 lakh crore market cap milestone", summary: "The conglomerate became the first Indian company to achieve this historic valuation.", category: "Business", timeAgo: "5h ago", source: "Moneycontrol" },
  { title: "FIIs turn net buyers, pump ₹3,500 crore into Indian equities", summary: "Foreign institutional investors reversed their selling trend amid improved global risk appetite.", category: "Markets", timeAgo: "6h ago", source: "NDTV Profit" },
  { title: "India's GDP growth projected at 7.2% for FY26 by IMF", summary: "The International Monetary Fund raised India's growth forecast citing strong domestic demand.", category: "Economy", timeAgo: "8h ago", source: "Business Standard" },
  { title: "HDFC Bank reports 20% jump in net profit for Q4 FY25", summary: "The private lender posted strong results with improved asset quality and loan growth.", category: "Banking", timeAgo: "10h ago", source: "Financial Express" },
];

const fallbackWorld: NewsItem[] = [
  { title: "Fed signals potential rate cut in September amid cooling inflation", summary: "Federal Reserve Chair hinted at easing monetary policy as US inflation shows signs of moderating.", category: "Global", timeAgo: "1h ago", source: "Reuters" },
  { title: "Wall Street hits record high as tech stocks lead broad rally", summary: "S&P 500 and Nasdaq reached new all-time highs driven by AI-related tech gains.", category: "Markets", timeAgo: "3h ago", source: "Bloomberg" },
  { title: "Crude oil prices drop 3% on rising US inventory data", summary: "Brent crude fell below $80/barrel as unexpected build in US crude stockpiles weighed on prices.", category: "Commodities", timeAgo: "4h ago", source: "CNBC" },
  { title: "European markets close higher on positive economic data", summary: "Major European indices rallied after strong PMI data suggested economic recovery.", category: "Global", timeAgo: "6h ago", source: "Financial Times" },
  { title: "Bitcoin surges past $70,000 as institutional adoption grows", summary: "The largest cryptocurrency hit new highs amid increasing ETF inflows and institutional interest.", category: "Tech", timeAgo: "7h ago", source: "CoinDesk" },
  { title: "Bank of Japan maintains ultra-loose monetary policy stance", summary: "BOJ kept interest rates negative despite growing pressure to normalize monetary policy.", category: "Policy", timeAgo: "9h ago", source: "Nikkei Asia" },
];

const categoryColors: Record<string, string> = {
  Markets: "bg-secondary/20 text-secondary",
  Economy: "bg-brand-gold/20 text-brand-gold",
  Business: "bg-primary/10 text-primary",
  Policy: "bg-destructive/10 text-destructive",
  Banking: "bg-brand-lightBlue/20 text-brand-lightBlue",
  Tech: "bg-accent/60 text-accent-foreground",
  Global: "bg-brand-navy/20 text-brand-navy",
  Commodities: "bg-brand-green/20 text-brand-green",
};

const NewsCard = ({ item, index }: { item: NewsItem; index: number }) => {
  const [displayTime, setDisplayTime] = useState(item.timeAgo);

  useEffect(() => {
    if (!item.timestamp) return;
    
    const updateTime = () => {
      const diffMs = new Date().getTime() - new Date(item.timestamp!).getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      if (diffHrs < 1) {
        setDisplayTime(`${Math.floor(diffHrs * 60)}m ago`);
      } else if (diffHrs < 24) {
        setDisplayTime(`${Math.floor(diffHrs)}h ago`);
      } else {
        setDisplayTime(`${Math.floor(diffHrs / 24)}d ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, [item.timestamp, item.timeAgo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card className="bg-card hover:shadow-lg hover:border-secondary/30 transition-all duration-300 group cursor-pointer border-border/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {displayTime}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-sm text-foreground leading-snug group-hover:text-secondary transition-colors line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{item.summary}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium">{item.source}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-secondary transition-colors flex-shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MarketNews = () => {
  const [activeTab, setActiveTab] = useState<"indian" | "world">("indian");
  const [indianNews, setIndianNews] = useState<NewsItem[]>(fallbackIndian);
  const [worldNews, setWorldNews] = useState<NewsItem[]>(fallbackWorld);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news'); // Changed lovableSupabase to supabase
      if (!error && data?.success) {
        if (data.indian?.length > 0) setIndianNews(data.indian);
        if (data.world?.length > 0) setWorldNews(data.world);
      }
    } catch {
      console.log('Using fallback news data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    let interval: ReturnType<typeof setInterval> | null = setInterval(() => {
      if (!document.hidden) fetchNews();
    }, 5 * 60 * 1000);

    const handleVisibility = () => {
      if (!document.hidden) fetchNews();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const news = activeTab === "indian" ? indianNews : worldNews;

  return (
    <section id="news" className="py-10 md:py-20 bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Stay Informed
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Market News & Updates
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Latest financial news from India and around the world
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex bg-muted rounded-xl p-1 border border-border/50">
            <button
              onClick={() => setActiveTab("indian")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "indian"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              India
            </button>
            <button
              onClick={() => setActiveTab("world")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "world"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="w-4 h-4" />
              World
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchNews}
            disabled={loading}
            className="ml-2"
            aria-label="Refresh news"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </motion.div>

        {/* News grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {news.map((item, i) => (
              <NewsCard key={`${activeTab}-${i}`} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Powered by line */}
        <motion.p
          className="text-center text-xs text-muted-foreground/50 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Newspaper className="w-3 h-3 inline mr-1" />
          News auto-refreshes every 5 minutes • Sources: ET, Moneycontrol, Reuters, Bloomberg
        </motion.p>
      </div>
    </section>
  );
};

export default MarketNews;
