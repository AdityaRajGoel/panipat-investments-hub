import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import UnlistedShares from "@/components/UnlistedShares";
import Testimonials from "@/components/Testimonials";
import MobileApp from "@/components/MobileApp";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StockTicker />
      <Hero />
      <About />
      <Services />
      <UnlistedShares />
      <Testimonials />
      <MobileApp />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;