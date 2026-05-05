import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisibleBreadcrumbs from "@/components/VisibleBreadcrumbs";
import Services from "@/components/Services";
import InvestmentTools from "@/components/InvestmentTools";
import SIPCalculator from "@/components/SIPCalculator";
import MobileApp from "@/components/MobileApp";
import ClientMarquee from "@/components/ClientMarquee";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import SEOHead from "@/components/SEOHead";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Services | Stocks, Mutual Funds, IPO, F&O - Parasram India Panipat"
        description="Complete financial services in Panipat - equity trading, mutual funds, SIP, IPO applications, F&O, commodities, unlisted shares. SEBI registered broker since 1970."
        ogImage="https://www.sphpnp.com/logo.png"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Services" },
        ]}
      />
      <ScrollProgress />
      <Header />
      <VisibleBreadcrumbs items={[{ name: "Home", url: "/" }, { name: "Services" }]} />
      <Services />
      <InvestmentTools />
      <SIPCalculator />
      <ClientMarquee />
      <MobileApp />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ServicesPage;
