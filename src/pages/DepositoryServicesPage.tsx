import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PageTransition from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Vault, Share2, FileDigit, Link as LinkIcon, ShieldAlert } from "lucide-react";

const features = [
  { icon: Vault, title: "Secure Account Maintenance", desc: "Safe keeping of your securities in electronic form fully backed by CDSL/NSDL." },
  { icon: Share2, title: "Seamless Transfers", desc: "Instantly transfer shares seamlessly without the hassles of physical share certificates." },
  { icon: FileDigit, title: "Corporate Action Tracking", desc: "Automatic credit of bonuses, splits, and tracking of dividend payments directly to your linked bank account." },
  { icon: LinkIcon, title: "Easy Pledging (Margin)", desc: "Pledge your existing holdings electronically to acquire trading margin seamlessly without selling." },
  { icon: ShieldAlert, title: "SMS Alerts", desc: "Real-time automated alerts for all depository transactions ensuring highest transparency." },
];

const DepositoryServicesPage = () => {
  return (
    <PageTransition>
      <SEOHead 
        title="Depository Services | NSDL & CDSL | Parasram India Panipat" 
        description="Open your secure Demat account. Enjoy seamless transfers, pledge for margin, and automated corporate actions with Parasram India."
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-brand-navy to-background text-primary-foreground text-center">
          <div className="container mx-auto px-4 z-10 relative">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Depository <span className="text-secondary">Services</span>
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A robust foundation for your wealth. Hold, transfer, and manage your electronic securities with absolute peace of mind.
            </motion.p>
          </div>
        </section>

        {/* Info Content Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 max-w-6xl">
            
            <motion.div 
              className="mb-16 bg-card glass-card p-8 md:p-12 rounded-3xl border border-border overflow-hidden relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Decorative Circle */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl"></div>

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-bold font-heading text-foreground mb-6">Why Open a Demat With Us?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Parasram India acts as a Depository Participant (DP) with both **NSDL** and **CDSL** . 
                  Our depository services form the cornerstone of all your investment activities, 
                  allowing you to hold shares, mutual funds, bonds, and ETFs electronically in a single, secure account.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Coupled with our integrated trading platforms, our depository services ensure zero lags during settlement. You have full transparency through regular holding statements, online viewing capabilities, and direct margin pledging mechanisms.
                </p>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <motion.div 
                  key={feature.title}
                  className="bg-muted/30 p-6 rounded-2xl border border-border/50 hover:bg-muted/60 hover:border-secondary/30 transition-all duration-300 transform hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 text-secondary">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default DepositoryServicesPage;
