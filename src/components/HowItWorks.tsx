import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Rocket, Shield, Users, Clock, Award, Globe } from "lucide-react";

const steps = [
  { icon: Globe, title: "Visit Our Branch Or Call Us", desc: "Walk into our Panipat office at Shakuntala Complex, call us or fill out the form for us to contact you.", num: "01" },
  { icon: Shield, title: "KYC Verification", desc: "Complete your KYC with Aadhaar, PAN, and bank details.", num: "02" },
  { icon: Users, title: "Account Opening", desc: "Open your Demat & Trading account in minutes.", num: "03" },
  { icon: Rocket, title: "Start Trading", desc: "Begin investing in stocks, F&O, mutual funds, IPOs and more.", num: "04" },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="py-10 md:py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Get Started
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          {/* Animated vertical line */}
          <div className="absolute left-8 top-0 w-px h-full bg-border/50 hidden md:block">
            <motion.div
              className="w-full bg-gradient-to-b from-secondary to-brand-gold"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex items-start gap-6 group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-card border-2 border-secondary/30 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:border-secondary group-hover:shadow-xl transition-all relative z-10"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className="w-7 h-7 text-secondary" />
                </motion.div>
                <motion.div
                  className="bg-card border border-border/50 rounded-xl p-5 flex-1 group-hover:border-secondary/30 group-hover:shadow-lg transition-all"
                  whileHover={{ x: 6 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      Step {step.num}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
