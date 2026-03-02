import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import GoogleReviews from "@/components/GoogleReviews";
import Testimonials from "@/components/Testimonials";
import ClientMarquee from "@/components/ClientMarquee";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <About />
      <HowItWorks />
      <ClientMarquee />
      <Testimonials />
      <GoogleReviews />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AboutPage;
