import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import MarketOverview from "@/components/MarketOverview";
import MarketNews from "@/components/MarketNews";
import ClientMarquee from "@/components/ClientMarquee";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <AnnouncementBar />
      <StockTicker />
      <Hero />
      <TrustBadges />
      <MarketOverview />
      <ClientMarquee />
      <MarketNews />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
