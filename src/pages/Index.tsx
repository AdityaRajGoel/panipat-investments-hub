import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import LiveChart from "@/components/LiveChart";
import MarketDashboard from "@/components/MarketDashboard";
import TrustBadges from "@/components/TrustBadges";
import MarketOverview from "@/components/MarketOverview";
import MarketNews from "@/components/MarketNews";
import ClientMarquee from "@/components/ClientMarquee";
import AnnouncementBar from "@/components/AnnouncementBar";
import IPOTracker from "@/components/IPOTracker";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Best Stock Broker in Panipat | Parasram India - Since 1970"
        description="Parasram India Panipat - SEBI registered stock broker since 1970. Open free Demat account. Stocks, mutual funds, IPO, unlisted shares, F&O, commodities trading."
        keywords="best stock broker Panipat, demat account Panipat, stock trading Panipat, mutual funds Panipat, IPO Panipat, Parasram India, SEBI registered broker Haryana"
      />
      <ScrollProgress />
      <Header />
      <AnnouncementBar />
      <StockTicker />
      <Hero />
      <LiveChart />
      <MarketDashboard />
      <TrustBadges />
      <MarketOverview />
      <IPOTracker />
      <ClientMarquee />
      <MarketNews />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
