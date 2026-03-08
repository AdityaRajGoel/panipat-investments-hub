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
import HowItWorks from "@/components/HowItWorks";
import InvestmentTools from "@/components/InvestmentTools";
import SIPCalculator from "@/components/SIPCalculator";
import GoogleReviews from "@/components/GoogleReviews";
import CompanyValues from "@/components/CompanyValues";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import SEOHead from "@/components/SEOHead";

const homeFAQs = [
  { q: "What is the minimum amount to start investing?", a: "You can start investing with as little as ₹500 per month through SIP in mutual funds, or buy stocks with any amount. There's no minimum balance required for your Demat account." },
  { q: "How long does it take to open a Demat account?", a: "Account opening is completed within 24-48 hours. You just need your Aadhaar, PAN card, bank details, and a cancelled cheque. Visit our branch or apply online." },
  { q: "Is Parasram India SEBI registered?", a: "Yes, Parasram India is fully SEBI registered and compliant with all regulatory requirements. We are authorized members of NSE, BSE, and MCX exchanges." },
  { q: "What trading platforms do you offer?", a: "We provide access to multiple trading platforms including desktop terminals, mobile apps, and web-based platforms for trading in equity, F&O, commodities, and currencies." },
  { q: "Do you provide research and advisory services?", a: "Yes, our expert research team provides daily market reports, stock recommendations, sector analysis, and personalized investment advisory based on your risk profile." },
  { q: "What are your brokerage charges?", a: "We offer competitive brokerage rates. Account opening is absolutely free. Contact us for a detailed fee structure tailored to your trading volume and preferences." },
  { q: "Can I trade in commodities and currencies?", a: "Yes, we offer trading in MCX commodities (gold, silver, crude oil, etc.) and currency derivatives (USD/INR, EUR/INR, etc.) through our integrated platforms." },
  { q: "Do you offer IPO services?", a: "Yes, we help you apply for IPOs through your Demat account. We also provide IPO analysis, grey market premium tracking, and recommendations on upcoming IPOs." },
];

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
      <HowItWorks />
      <InvestmentTools />
      <SIPCalculator />
      <CompanyValues />
      <ClientMarquee />
      <GoogleReviews />
      <MarketNews />
      <FAQ
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about investing with Parasram India"
        items={homeFAQs}
      />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
