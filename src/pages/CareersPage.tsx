import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Users, TrendingUp, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";



const CareersPage = () => {
  return (
    <PageTransition>
      <SEOHead 
        title="Careers | Parasram India Panipat" 
        description="Join the Parasram India Panipat branch. We are hiring Relationship Managers and Equity Dealers to empower regional wealth creation."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-20 bg-hero text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
          <div className="container mx-auto px-4 z-10 relative">
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-gold/20 text-brand-gold text-sm font-semibold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Briefcase className="w-4 h-4" /> We're Hiring!
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Build Your Career in <span className="text-brand-gold">Finance</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Join the fastest growing brokerage branch in Panipat. Work with a trusted legacy spanning 50+ years and help drive wealth creation.
            </motion.p>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-10">Why Join Parasram Panipat?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">Rapid career progression models and incredibly competitive incentive structures directly tied to your performance.</p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Excellent Environment</h3>
                <p className="text-sm text-muted-foreground">Work closely with seasoned market veterans in an encouraging, fast-paced, and dynamic financial hub.</p>
              </div>
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-4 text-brand-gold">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Local Branch Power</h3>
                <p className="text-sm text-muted-foreground">Capitalize on the Panipat industrial network with the full backing and tech infrastructure of a premier national broker.</p>
              </div>
            </div>
          </div>
        </section>

        {/* General Application Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-8">
              <h4 className="text-2xl font-bold text-foreground mb-3">Looking for Opportunities?</h4>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">While we don't currently have any immediate openings, we are always on the lookout for driven talent. Send us your resume, and we'll reach out when a position opens up!</p>
              <Button asChild className="bg-brand-gold hover:bg-brand-gold/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full">
                <a href="mailto:parasrampnp@gmail.com?subject=General Application">Submit Your Resume</a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default CareersPage;
