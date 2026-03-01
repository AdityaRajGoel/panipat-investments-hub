import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import InvestmentTools from "@/components/InvestmentTools";
import SIPCalculator from "@/components/SIPCalculator";
import MobileApp from "@/components/MobileApp";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <Services />
      <InvestmentTools />
      <SIPCalculator />
      <MobileApp />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServicesPage;
