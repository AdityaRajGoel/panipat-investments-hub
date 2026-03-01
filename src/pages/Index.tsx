import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import MarketOverview from "@/components/MarketOverview";
import MarketNews from "@/components/MarketNews";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <StockTicker />
      <Hero />
      <TrustBadges />
      <MarketOverview />
      <MarketNews />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
