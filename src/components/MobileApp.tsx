import { Smartphone, Download, Star, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
const features = [
  { icon: Zap, text: "Lightning Fast Trading" },
  { icon: Shield, text: "Bank-Level Security" },
  { icon: BarChart3, text: "Real-Time Charts" },
  { icon: Star, text: "Expert Research" },
];

const MobileApp = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const phoneY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} id="app" className="py-20 bg-hero overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-2 mb-6">
              <Smartphone className="w-4 h-4 text-secondary" />
              <span className="text-primary-foreground text-sm font-medium">Mobile App</span>
            </div>
            
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Trade Anytime, Anywhere with
              <span className="block text-secondary mt-2">Parasram Trade App</span>
            </h2>
            
            <p className="text-primary-foreground/80 text-lg mb-8">
              Download our powerful mobile app to access markets on the go. 
              Experience seamless trading with real-time data, advanced charts, 
              and instant order execution.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.text}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-primary-foreground text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold transition-all duration-300 hover:scale-105"
              >
                <a 
                  href="https://play.google.com/store/apps/details?id=com.parasramindia.xts" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Google Play
                </a>
              </Button>
              <Button 
                asChild
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold transition-all duration-300 hover:scale-105"
              >
                <a 
                  href="https://apps.apple.com/us/app/parasram-trade/id1564728869" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 w-5 h-5" />
                  App Store
                </a>
              </Button>
            </div>
          </motion.div>
          
          {/* Phone mockup */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ y: phoneY }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-secondary/30 blur-3xl rounded-full scale-75" />
              
              {/* Phone frame */}
              <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-background rounded-[2.5rem] overflow-hidden w-64 h-[500px] flex flex-col">
                  {/* Phone screen content */}
                  {/* Dashboard Header */}
                  <div className="bg-muted px-3 py-2 flex items-center justify-between border-b border-border">
                    <span className="text-foreground text-xs font-bold">Dashboard</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-secondary/20 rounded-full" />
                      <div className="w-4 h-4 bg-muted-foreground/20 rounded-full" />
                    </div>
                  </div>

                  {/* Net Holdings */}
                  <div className="bg-muted/50 mx-2 mt-2 rounded-lg p-3 text-center">
                    <div className="text-[10px] text-muted-foreground">Net Holdings</div>
                    <div className="text-foreground text-sm font-bold">₹ 10,42,507.50</div>
                    <div className="text-secondary text-[10px] font-semibold mt-1">81,502.50 (39.11%)</div>
                  </div>

                  {/* Sector Allocation Mini Pie */}
                  <div className="mx-2 mt-2 bg-muted/50 rounded-lg p-2">
                    <div className="text-[9px] text-center text-muted-foreground font-semibold mb-1">Sector Allocation</div>
                    <div className="flex justify-center gap-3 text-[8px]">
                      <span className="text-secondary font-medium">Financial 69.89%</span>
                      <span className="text-brand-gold font-medium">Goods 18.22%</span>
                    </div>
                  </div>

                  {/* Position Summary */}
                  <div className="mx-2 mt-2 bg-muted/50 rounded-lg p-2 flex justify-between items-center">
                    <div className="text-[10px] text-muted-foreground font-semibold">Position Summary</div>
                    <div className="text-right">
                      <div className="text-secondary text-xs font-bold">₹ 642.80</div>
                      <div className="text-[8px] text-muted-foreground">4 Scrips</div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="mx-2 mt-2 bg-muted/50 rounded-lg p-2">
                    <div className="text-[9px] text-center text-muted-foreground font-semibold mb-1">Total Orders: 4</div>
                    <div className="grid grid-cols-3 text-center text-[8px]">
                      <div><div className="font-bold text-foreground">1</div><div className="text-muted-foreground">Executed</div></div>
                      <div className="border-x border-border"><div className="font-bold text-foreground">0</div><div className="text-muted-foreground">Open</div></div>
                      <div><div className="font-bold text-foreground">3</div><div className="text-muted-foreground">Others</div></div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="mt-auto border-t border-border flex justify-around py-2">
                    {["Markets", "Watch", "Dashboard", "Position"].map((tab, i) => (
                      <div key={tab} className={`text-[8px] text-center ${i === 2 ? "text-secondary font-bold" : "text-muted-foreground"}`}>
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm font-semibold shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                4.5 ★ Rating
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-card text-foreground rounded-full px-4 py-2 text-sm font-semibold shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                100K+ Downloads
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;