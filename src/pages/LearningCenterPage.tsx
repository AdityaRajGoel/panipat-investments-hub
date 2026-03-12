import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock, ChevronRight, TrendingUp, GraduationCap, BarChart3, Shield, ExternalLink, Newspaper, Radio, RefreshCw, Globe, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string | null;
  read_time: number;
  published: boolean;
  created_at: string;
  source?: string;
  source_url?: string;
};

type NewsItem = {
  title: string;
  summary: string;
  category: string;
  timeAgo: string;
  source: string;
};

const CATEGORIES = [
  { key: "all", label: "All", icon: BookOpen },
  { key: "basics", label: "Basics", icon: GraduationCap },
  { key: "trading", label: "Trading", icon: TrendingUp },
  { key: "analysis", label: "Analysis", icon: BarChart3 },
  { key: "investing", label: "Investing", icon: Shield },
];

// Real articles from credible sources
const REAL_ARTICLES: Article[] = [
  {
    id: "r1", title: "What is a Demat Account?", slug: "demat-account",
    excerpt: "A demat account holds your shares and securities in electronic format, eliminating the need for physical certificates. Learn how it works and how to open one.",
    content: "", category: "basics", cover_image: null, read_time: 5, published: true, created_at: "2025-12-01",
    source: "NSE India", source_url: "https://www.nseindia.com/learn/what-is-demat-account"
  },
  {
    id: "r2", title: "Understanding P/E Ratio: How to Value Stocks", slug: "pe-ratio",
    excerpt: "The Price-to-Earnings ratio is one of the most widely used valuation metrics. Learn how to interpret P/E ratios and use them to evaluate stock valuations.",
    content: "", category: "analysis", cover_image: null, read_time: 7, published: true, created_at: "2025-11-28",
    source: "Investopedia", source_url: "https://www.investopedia.com/terms/p/price-earningsratio.asp"
  },
  {
    id: "r3", title: "SIP vs Lumpsum: Which Investment Strategy Wins?", slug: "sip-vs-lumpsum",
    excerpt: "Compare rupee cost averaging through SIPs with lumpsum investing. Data-backed analysis of which strategy delivers better returns across market cycles.",
    content: "", category: "investing", cover_image: null, read_time: 8, published: true, created_at: "2025-11-25",
    source: "AMFI India", source_url: "https://www.amfiindia.com/investor-corner/knowledge-center/sip.html"
  },
  {
    id: "r4", title: "Intraday Trading: Strategies and Risk Management", slug: "intraday-trading",
    excerpt: "Master the fundamentals of day trading including momentum, breakout, and scalping strategies. Includes position sizing and stop-loss techniques.",
    content: "", category: "trading", cover_image: null, read_time: 10, published: true, created_at: "2025-11-22",
    source: "Zerodha Varsity", source_url: "https://zerodha.com/varsity/module/trading-psychology-and-risk-management/"
  },
  {
    id: "r5", title: "How to Read Candlestick Chart Patterns", slug: "candlestick-patterns",
    excerpt: "Comprehensive guide to Japanese candlestick patterns — doji, hammer, engulfing, morning star. Learn to identify trend reversals and continuations.",
    content: "", category: "analysis", cover_image: null, read_time: 12, published: true, created_at: "2025-11-20",
    source: "Zerodha Varsity", source_url: "https://zerodha.com/varsity/module/technical-analysis/"
  },
  {
    id: "r6", title: "Mutual Funds: Types, Benefits & How to Invest", slug: "mutual-funds-guide",
    excerpt: "Everything you need to know about mutual funds in India — equity, debt, hybrid, index funds. Understand NAV, expense ratios, and CAGR returns.",
    content: "", category: "basics", cover_image: null, read_time: 8, published: true, created_at: "2025-11-18",
    source: "SEBI Investor Education", source_url: "https://investor.sebi.gov.in/mutual-funds.html"
  },
  {
    id: "r7", title: "Options Trading: Calls, Puts & Basic Strategies", slug: "options-trading-101",
    excerpt: "Introduction to F&O trading — how options contracts work, understanding premiums, Greeks (Delta, Theta, Gamma), and strategies like covered calls and straddles.",
    content: "", category: "trading", cover_image: null, read_time: 15, published: true, created_at: "2025-11-15",
    source: "NSE Academy", source_url: "https://www.nseindia.com/learn/what-is-derivatives"
  },
  {
    id: "r8", title: "The Power of Compounding: Why Start Early", slug: "power-of-compounding",
    excerpt: "Albert Einstein called it the 8th wonder. See how even small monthly investments can grow into crores over decades through the magic of compound interest.",
    content: "", category: "investing", cover_image: null, read_time: 5, published: true, created_at: "2025-11-12",
    source: "RBI Financial Literacy", source_url: "https://rbi.org.in/financialeducation/"
  },
  {
    id: "r9", title: "How to Analyse Financial Statements", slug: "financial-statements",
    excerpt: "Learn to read balance sheets, income statements, and cash flow statements. Key ratios like ROE, ROCE, Debt-to-Equity explained with real company examples.",
    content: "", category: "analysis", cover_image: null, read_time: 14, published: true, created_at: "2025-11-10",
    source: "Investopedia", source_url: "https://www.investopedia.com/terms/f/financial-statements.asp"
  },
  {
    id: "r10", title: "Index Funds vs Active Funds: Which is Better?", slug: "index-vs-active",
    excerpt: "Research shows most active funds underperform their benchmark over 10 years. Explore the data behind passive investing and when active management adds value.",
    content: "", category: "investing", cover_image: null, read_time: 7, published: true, created_at: "2025-11-08",
    source: "SPIVA India Report", source_url: "https://www.spglobal.com/spdji/en/research-insights/spiva/"
  },
  {
    id: "r11", title: "Understanding IPO: Process, Allotment & Listing", slug: "ipo-guide",
    excerpt: "Complete guide to Initial Public Offerings — DRHP, price bands, lot sizes, allotment process, listing day strategy, and how to apply via UPI/ASBA.",
    content: "", category: "basics", cover_image: null, read_time: 10, published: true, created_at: "2025-11-05",
    source: "BSE India", source_url: "https://www.bseindia.com/static/about/ipo.html"
  },
  {
    id: "r12", title: "Moving Averages: SMA, EMA & Trading Signals", slug: "moving-averages",
    excerpt: "How to use Simple and Exponential Moving Averages for trend identification, crossover signals, and support/resistance in stock trading.",
    content: "", category: "trading", cover_image: null, read_time: 9, published: true, created_at: "2025-11-02",
    source: "Zerodha Varsity", source_url: "https://zerodha.com/varsity/chapter/moving-averages/"
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  basics: "bg-primary/10 text-primary",
  trading: "bg-brand-orange/10 text-brand-orange",
  analysis: "bg-secondary/10 text-secondary",
  investing: "bg-brand-gold/10 text-brand-gold",
};

const NEWS_CATEGORY_COLORS: Record<string, string> = {
  Markets: "bg-secondary/10 text-secondary",
  Economy: "bg-brand-gold/10 text-brand-gold",
  Business: "bg-primary/10 text-primary",
  Policy: "bg-brand-orange/10 text-brand-orange",
  Banking: "bg-brand-copper/10 text-brand-copper",
  Tech: "bg-purple-500/10 text-purple-500",
  Global: "bg-blue-500/10 text-blue-500",
  Commodities: "bg-brand-gold/10 text-brand-gold",
};

// Live TV channels
const LIVE_CHANNELS = [
  { name: "Zee Business", embedId: "DnAaS0ONJSI", description: "India's leading Hindi business news channel covering markets, economy, and corporate news" },
  { name: "CNBC Awaaz", embedId: "enO-WVhQ1p0", description: "Hindi business news with live market analysis, stock recommendations, and expert opinions" },
];

const LearningCenterPage = () => {
  const [articles, setArticles] = useState<Article[]>(REAL_ARTICLES);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"articles" | "news" | "live">("articles");
  const [indianNews, setIndianNews] = useState<NewsItem[]>([]);
  const [worldNews, setWorldNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsTab, setNewsTab] = useState<"indian" | "world">("indian");

  // Load articles from DB
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setArticles(data as Article[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Load live news
  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news');
      if (!error && data?.success) {
        setIndianNews(data.indian || []);
        setWorldNews(data.world || []);
      }
    } catch (e) {
      console.error('News fetch error:', e);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "news" && indianNews.length === 0) {
      fetchNews();
    }
  }, [activeSection]);

  const filtered = useMemo(() => articles.filter(a => {
    const matchCat = category === "all" || a.category === category;
    const matchSearch = !search.trim() || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }), [articles, category, search]);

  const currentNews = newsTab === "indian" ? indianNews : worldNews;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Learning Center | Parasram India" description="Learn about stock market investing, trading strategies, technical analysis, and personal finance. Free educational resources, live market news, and business TV." keywords="stock market learning, trading guide, investing basics, technical analysis, mutual funds guide, live market news" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Learning Center</h1>
          </div>
          <p className="text-muted-foreground">Educational resources, live market news & business TV</p>
        </motion.div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {[
            { key: "articles" as const, label: "Articles & Guides", icon: BookOpen },
            { key: "news" as const, label: "Live Market News", icon: Newspaper },
            { key: "live" as const, label: "Live Business TV", icon: Radio },
          ].map((s) => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeSection === s.key
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ARTICLES SECTION */}
          {activeSection === "articles" && (
            <motion.div key="articles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Search & filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Tabs value={category} onValueChange={setCategory}>
                  <TabsList>
                    {CATEGORIES.map(c => (
                      <TabsTrigger key={c.key} value={c.key} className="text-xs sm:text-sm">{c.label}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="h-4 bg-muted rounded w-20 mb-4" />
                      <div className="h-6 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </Card>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <Card className="p-12 text-center text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">No articles found</p>
                  <p className="text-sm mt-1">Try adjusting your search or category filter</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((article, i) => (
                    <motion.div key={article.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <a
                        href={article.source_url || "#"}
                        target={article.source_url ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="block h-full"
                      >
                        <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`w-fit text-xs ${CATEGORY_COLORS[article.category] || ""}`} variant="outline">
                              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                            </Badge>
                            {article.source && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" />
                                {article.source}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">{article.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {article.read_time} min read
                            </span>
                            <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                              Read <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </Card>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* NEWS SECTION */}
          {activeSection === "news" && (
            <motion.div key="news" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <button onClick={() => setNewsTab("indian")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${newsTab === "indian" ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/30" : "text-muted-foreground hover:bg-muted"}`}>
                    <IndianRupee className="w-4 h-4" />
                    Indian Markets
                  </button>
                  <button onClick={() => setNewsTab("world")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${newsTab === "world" ? "bg-blue-500/10 text-blue-500 border border-blue-500/30" : "text-muted-foreground hover:bg-muted"}`}>
                    <Globe className="w-4 h-4" />
                    World Markets
                  </button>
                </div>
                <button onClick={fetchNews} disabled={newsLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {newsLoading && currentNews.length === 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="p-5 animate-pulse">
                      <div className="h-3 bg-muted rounded w-16 mb-3" />
                      <div className="h-5 bg-muted rounded w-full mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </Card>
                  ))}
                </div>
              ) : currentNews.length === 0 ? (
                <Card className="p-12 text-center text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Loading latest news...</p>
                  <p className="text-sm mt-1">Click Refresh to fetch the latest market headlines</p>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentNews.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="p-5 h-full flex flex-col hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className={`text-[10px] ${NEWS_CATEGORY_COLORS[item.category] || "bg-muted text-muted-foreground"}`} variant="outline">
                            {item.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">{item.timeAgo}</span>
                        </div>
                        <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-muted-foreground flex-1 line-clamp-2 mb-3">{item.summary}</p>
                        <div className="text-[10px] text-muted-foreground font-medium">{item.source}</div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* LIVE TV SECTION */}
          {activeSection === "live" && (
            <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid md:grid-cols-2 gap-6">
                {LIVE_CHANNELS.map((channel) => (
                  <Card key={channel.name} className="overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${channel.embedId}?autoplay=0&rel=0`}
                        title={channel.name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <span className="text-xs font-bold text-destructive">LIVE</span>
                        <h3 className="font-heading text-lg font-bold text-foreground">{channel.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 p-6 bg-muted/30 border-border/50">
                <div className="text-center">
                  <Radio className="w-8 h-8 text-brand-orange mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Live Business News Broadcast</h3>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    Watch live market analysis, stock recommendations, and financial news from India's top business channels. 
                    Available during broadcast hours (typically 6 AM - 11 PM IST).
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LearningCenterPage;
