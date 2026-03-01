import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnlistedShares from "@/components/UnlistedShares";
import Contact from "@/components/Contact";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const UnlistedZonePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <UnlistedShares />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default UnlistedZonePage;
