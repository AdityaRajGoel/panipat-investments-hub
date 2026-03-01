import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { motion } from "framer-motion";
import { Phone, Mail, Award, TrendingUp, Users, Briefcase } from "lucide-react";

const teamMembers = [
  {
    name: "Rajesh Parasram",
    role: "Branch Head",
    experience: "25+ Years",
    specialization: "Equity & Derivatives",
    phone: "+91 9416400314",
    email: "parasrampnp@gmail.com",
    icon: Award,
  },
  {
    name: "Amit Sharma",
    role: "Senior Relationship Manager",
    experience: "15+ Years",
    specialization: "Mutual Funds & SIP",
    phone: "+91 9999790011",
    email: "parasrampnp@gmail.com",
    icon: Users,
  },
  {
    name: "Vikas Gupta",
    role: "Research Analyst",
    experience: "10+ Years",
    specialization: "Technical & Fundamental Analysis",
    phone: "+91 9416400277",
    email: "parasrampnp@gmail.com",
    icon: TrendingUp,
  },
  {
    name: "Priya Mehta",
    role: "Operations Manager",
    experience: "12+ Years",
    specialization: "Account Opening & KYC",
    phone: "+91 9416400314",
    email: "parasrampnp@gmail.com",
    icon: Briefcase,
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
              className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full mb-4"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to helping you achieve your financial goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="group bg-card rounded-2xl p-8 border border-border/50 hover:border-secondary/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Gradient overlay */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className="w-16 h-16 bg-hero rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg"
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <member.icon className="w-8 h-8" />
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-semibold text-sm">{member.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                        {member.experience}
                      </span>
                      <span className="text-muted-foreground text-sm">Experience</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <span className="font-semibold text-foreground">Specialization:</span> {member.specialization}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                  </div>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-3xl"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TeamPage;
