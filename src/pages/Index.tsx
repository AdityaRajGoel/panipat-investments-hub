import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import MarketOverview from "@/components/MarketOverview";
import About from "@/components/About";
import Services from "@/components/Services";
import UnlistedShares from "@/components/UnlistedShares";
import MarketNews from "@/components/MarketNews";
import Testimonials from "@/components/Testimonials";
import GoogleReviews from "@/components/GoogleReviews";
import MobileApp from "@/components/MobileApp";
import Contact from "@/components/Contact";
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
      <MarketOverview />
      <About />
      <Services />
      <UnlistedShares />
      <MarketNews />
      <Testimonials />
      <GoogleReviews />
      <MobileApp />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
