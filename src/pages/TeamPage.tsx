import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { motion } from "framer-motion";
import { Phone, Mail, Award, TrendingUp, Users, Briefcase, Clock, Star, ChevronRight } from "lucide-react";

const teamMembers = [
  {
    name: "Anil Kumar Goel",
    role: "Principal Financial Consultant",
    description: "35+ years experience in financial services and long-term investment guidance.",
    phone: "+91 9416400314",
    email: "anil@sphpnp.com",
    icon: Award,
    accent: "from-secondary to-brand-green",
    statValue: "35+",
    statLabel: "Years",
  },
  {
    name: "Ajay Gupta",
    role: "Senior Financial Advisor",
    description: "30+ years experience in client advisory and financial product services.",
    phone: "+91 9416400277",
    email: "ajay@sphpnp.com",
    icon: Users,
    accent: "from-brand-gold to-secondary",
    statValue: "30+",
    statLabel: "Years",
  },
  {
    name: "Aditya Raj Goel",
    role: "Operations & Processing Executive",
    description: "Assists investors with account opening, KYC processing, and service queries. Also handles Online services, Website and Social Media.",
    phone: "+91 8295565443",
    email: "parasrampnp@gmail.com",
    icon: TrendingUp,
    accent: "from-secondary to-brand-gold",
    statValue: "KYC",
    statLabel: "Expert",
  },
  {
    name: "Rajat Gupta",
    role: "Client Relationship Manager",
    description: "Manages documentation, transaction execution, and coordination with service platforms and AMCs.",
    phone: "+91 9999790011",
    email: "rajat@sphpnp.com",
    icon: Briefcase,
    accent: "from-brand-gold to-brand-green",
    statValue: "CRM",
    statLabel: "Lead",
  },
];

const TeamPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />

      <section className="py-24 bg-background relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 9, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(213 80% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 80% 25%) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4"
              initial={{ opacity: 0, letterSpacing: "0em" }}
              animate={{ opacity: 1, letterSpacing: "0.15em" }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Our Experts
            </motion.span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Meet Our <span className="text-secondary">Team</span>
            </h1>
            <motion.div
              className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full mb-6"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
              Experienced professionals dedicated to helping you achieve your financial goals
            </p>

            {/* Legacy tagline */}
            <motion.div
              className="inline-flex items-center gap-2 bg-card border border-border/50 rounded-full px-6 py-3 shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Clock className="w-4 h-4 text-brand-gold" />
              <span className="text-sm text-foreground font-medium">
                Serving investors and families across generations with disciplined financial guidance since the late 1980s.
              </span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="group bg-card rounded-2xl border border-border/50 hover:border-secondary/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 bg-gradient-to-r ${member.accent}`} />

                {/* Gradient overlay */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className="w-16 h-16 bg-hero rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg flex-shrink-0"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <member.icon className="w-8 h-8" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-semibold text-sm">{member.role}</p>
                    </div>
                    {/* Stat badge — Groww-style */}
                    <div className="bg-muted rounded-xl px-3 py-2 text-center flex-shrink-0">
                      <div className="text-lg font-bold text-secondary">{member.statValue}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{member.statLabel}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5 pl-0 md:pl-20">
                    {member.description}
                  </p>

                  {/* Contact links */}
                  <div className="flex flex-col sm:flex-row gap-3 pl-0 md:pl-20">
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors bg-muted/50 hover:bg-secondary/10 rounded-lg px-3 py-2"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors bg-muted/50 hover:bg-secondary/10 rounded-lg px-3 py-2"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  </div>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-3xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA strip */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 bg-hero text-primary-foreground font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, gap: "12px" }}
              whileTap={{ scale: 0.98 }}
            >
              <Star className="w-5 h-5 text-brand-gold" />
              Get in Touch with Our Experts
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TeamPage;
