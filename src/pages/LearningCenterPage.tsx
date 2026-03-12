import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock, ChevronRight, TrendingUp, GraduationCap, BarChart3, Shield } from "lucide-react";
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
};

const CATEGORIES = [
  { key: "all", label: "All", icon: BookOpen },
  { key: "basics", label: "Basics", icon: GraduationCap },
  { key: "trading", label: "Trading", icon: TrendingUp },
  { key: "analysis", label: "Analysis", icon: BarChart3 },
  { key: "investing", label: "Investing", icon: Shield },
];

// Seed articles for initial display (before DB has content)
const SEED_ARTICLES: Omit<Article, "id">[] = [
  {
    title: "What is a Demat Account and Why You Need One",
    slug: "what-is-demat-account",
    excerpt: "A beginner's guide to understanding Demat accounts — how they work, why they're essential for investing in stocks, and how to open one.",
    content: "",
    category: "basics",
    cover_image: null,
    read_time: 5,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "Understanding P/E Ratio: A Key Valuation Metric",
    slug: "understanding-pe-ratio",
    excerpt: "Learn how to use the Price-to-Earnings ratio to evaluate whether a stock is overvalued, undervalued, or fairly priced.",
    content: "",
    category: "analysis",
    cover_image: null,
    read_time: 7,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "SIP vs Lumpsum: Which Investment Strategy is Better?",
    slug: "sip-vs-lumpsum",
    excerpt: "Compare Systematic Investment Plans (SIP) with lumpsum investing to find which approach suits your financial goals and risk appetite.",
    content: "",
    category: "investing",
    cover_image: null,
    read_time: 6,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "Intraday Trading Strategies for Beginners",
    slug: "intraday-trading-strategies",
    excerpt: "Explore proven intraday trading strategies, risk management techniques, and tips to get started with day trading in Indian markets.",
    content: "",
    category: "trading",
    cover_image: null,
    read_time: 8,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "How to Read Candlestick Charts",
    slug: "candlestick-charts-guide",
    excerpt: "Master the art of reading candlestick patterns — understand bullish, bearish, and reversal patterns used by professional traders.",
    content: "",
    category: "analysis",
    cover_image: null,
    read_time: 10,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "What are Mutual Funds? Types and How to Invest",
    slug: "mutual-funds-guide",
    excerpt: "A comprehensive guide to mutual funds in India — types, advantages, risks, and step-by-step process to start investing.",
    content: "",
    category: "basics",
    cover_image: null,
    read_time: 8,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "Options Trading 101: Calls, Puts & Strategies",
    slug: "options-trading-101",
    excerpt: "An introductory guide to options trading — understand call options, put options, premiums, and basic strategies like covered calls.",
    content: "",
    category: "trading",
    cover_image: null,
    read_time: 12,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    title: "Power of Compounding: Why Start Investing Early",
    slug: "power-of-compounding",
    excerpt: "Discover how compounding can multiply your wealth over time and why starting early is the single best financial decision you can make.",
    content: "",
    category: "investing",
    cover_image: null,
    read_time: 5,
    published: true,
    created_at: new Date().toISOString(),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  basics: "bg-primary/10 text-primary",
  trading: "bg-brand-orange/10 text-brand-orange",
  analysis: "bg-secondary/10 text-secondary",
  investing: "bg-brand-gold/10 text-brand-gold",
};

const LearningCenterPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Try loading from DB first
      const { data } = await supabase
        .from("blog_articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setArticles(data as Article[]);
      } else {
        // Use seed articles
        setArticles(SEED_ARTICLES.map((a, i) => ({ ...a, id: `seed-${i}` })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = articles.filter(a => {
    const matchCat = category === "all" || a.category === category;
    const matchSearch = !search.trim() || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Learning Center | Parasram India" description="Learn about stock market investing, trading strategies, technical analysis, and personal finance. Free educational resources for beginners and experienced investors." keywords="stock market learning, trading guide, investing basics, technical analysis, mutual funds guide" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Learning Center</h1>
          </div>
          <p className="text-muted-foreground">Educational resources to help you become a smarter investor</p>
        </motion.div>

        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList>
              {CATEGORIES.map(c => (
                <TabsTrigger key={c.key} value={c.key} className="text-xs sm:text-sm">
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Articles grid */}
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
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer group">
                  <Badge className={`w-fit text-xs mb-3 ${CATEGORY_COLORS[article.category] || ""}`} variant="outline">
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                  <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
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
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LearningCenterPage;