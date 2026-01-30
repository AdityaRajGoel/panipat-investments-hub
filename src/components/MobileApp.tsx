import { Smartphone, Download, Star, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  { icon: Zap, text: "Lightning Fast Trading" },
  { icon: Shield, text: "Bank-Level Security" },
  { icon: BarChart3, text: "Real-Time Charts" },
  { icon: Star, text: "Expert Research" },
];

const MobileApp = () => {
  return (
    <section id="app" className="py-20 bg-hero overflow-hidden">
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
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-secondary/30 blur-3xl rounded-full scale-75" />
              
              {/* Phone frame */}
              <div className="relative bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-background rounded-[2.5rem] overflow-hidden w-64 h-[500px] flex flex-col">
                  {/* Phone screen content */}
                  <div className="bg-hero p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="text-primary-foreground text-sm font-semibold">Parasram Trade</div>
                      <div className="text-primary-foreground/60 text-xs">Live Market</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-3">
                    {/* Mock stocks */}
                    {[
                      { name: "RELIANCE", price: "2,847.50", change: "+2.3%" },
                      { name: "TCS", price: "3,456.80", change: "+1.5%" },
                      { name: "HDFC BANK", price: "1,678.25", change: "-0.8%" },
                      { name: "INFOSYS", price: "1,523.40", change: "+3.1%" },
                      { name: "ICICI BANK", price: "987.65", change: "+0.9%" },
                    ].map((stock, i) => (
                      <div key={stock.name} className="bg-muted rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <div className="text-xs font-semibold text-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground">₹{stock.price}</div>
                        </div>
                        <div className={`text-xs font-medium ${stock.change.startsWith('+') ? 'text-secondary' : 'text-destructive'}`}>
                          {stock.change}
                        </div>
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