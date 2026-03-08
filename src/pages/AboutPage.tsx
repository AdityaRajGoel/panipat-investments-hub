import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import CompanyTimeline from "@/components/CompanyTimeline";
import GoogleReviews from "@/components/GoogleReviews";
import Testimonials from "@/components/Testimonials";
import ClientMarquee from "@/components/ClientMarquee";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import FAQ from "@/components/FAQ";

const aboutFAQs = [
  { q: "How long has Parasram India been in business?", a: "Parasram India was established in 1970 and has over 50+ years of experience in the financial markets. Our Panipat branch has been serving clients since the late 1980s." },
  { q: "Is Parasram India registered with SEBI?", a: "Yes, Parasram India is a SEBI-registered stock broker (Registration No: INZ000175134) and a member of NSE (12583), BSE (1153), and MCX (46510)." },
  { q: "What services does the Panipat branch offer?", a: "Our Panipat branch offers equity trading, derivatives, commodity trading, mutual fund investments, IPO applications, SIP planning, unlisted shares, portfolio management services, and personalized financial advisory." },
  { q: "How can I open a Demat account?", a: "You can open a free Demat account by visiting our branch at Shakuntala Complex, Palika Bazaar, Panipat, or by filling out the online form on our website. You'll need your PAN card, Aadhaar card, and bank details." },
  { q: "Do you provide research and advisory services?", a: "Yes, our research team provides daily market reports, stock recommendations, and personalized portfolio advisory. All research calls are SEBI-compliant." },
  { q: "What are the brokerage charges?", a: "We offer competitive brokerage rates. Contact our Panipat branch for the latest rate card tailored to your trading volume and requirements." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <About />
      <CompanyTimeline />
      <HowItWorks />
      <ClientMarquee />
      <Testimonials />
      <GoogleReviews />
      <FAQ
        title="About Parasram India"
        subtitle="Common questions about our firm and services"
        items={aboutFAQs}
      />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AboutPage;
