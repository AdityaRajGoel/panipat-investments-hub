import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import FAQ from "@/components/FAQ";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const contactFAQs = [
  { q: "What are your office timings?", a: "Our Panipat branch is open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays and market holidays." },
  { q: "Can I visit without an appointment?", a: "Yes! Walk-ins are welcome during office hours. However, for detailed portfolio consultations, we recommend calling ahead to schedule an appointment so our advisors can dedicate proper time to you." },
  { q: "How quickly will you respond to my inquiry?", a: "We aim to respond to all inquiries within 24 hours on business days. For urgent matters, please call us directly at +91 9416400314." },
  { q: "Do you provide services outside Panipat?", a: "Yes, while our physical branch is in Panipat, we serve clients across Haryana and India through our online trading platforms and phone/video consultations." },
  { q: "Is there parking available near your office?", a: "Yes, there is public parking available near Shakuntala Complex, Palika Bazaar. Our office is easily accessible from the main market area." },
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact Parasram India Panipat | Stock Broker Office"
        description="Contact Parasram India Panipat branch at Shakuntala Complex, Palika Bazaar. Call +91 9416400314. Open Mon-Sat. Free Demat account opening & investment consultation."
        keywords="contact Parasram India Panipat, stock broker office Panipat, Shakuntala Complex Panipat, financial advisor Panipat contact"
        jsonLd={{
          "@type": "LocalBusiness",
          "name": "Parasram India - Panipat Branch",
          "telephone": "+919416400314",
          "email": "parasrampnp@gmail.com",
          "address": { "@type": "PostalAddress", "streetAddress": "Shakuntala Complex, Palika Bazaar", "addressLocality": "Panipat", "addressRegion": "Haryana", "postalCode": "132103", "addressCountry": "IN" },
          "openingHours": ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
          "geo": { "@type": "GeoCoordinates", "latitude": "29.3909", "longitude": "76.9635" },
        }}
      />
      <ScrollProgress />
      <Header />

      {/* Hero banner */}
      <section className="py-16 bg-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-10 right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <MessageCircle className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium">We'd love to hear from you</span>
          </motion.div>
          <motion.h1
            className="font-heading text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Get In <span className="text-secondary">Touch</span>
          </motion.h1>
          <motion.p
            className="text-primary-foreground/70 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Visit our Panipat branch, call us, or send a message. We're here to help with all your investment needs.
          </motion.p>
        </div>
      </section>

      {/* Contact form + existing contact info */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div className="lg:col-span-3">
              <Contact />
            </div>
          </div>
        </div>
      </section>

      <FAQ
        title="Contact & Visiting"
        subtitle="Helpful info about reaching us"
        items={contactFAQs}
      />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ContactPage;
