import { TrendingUp, BarChart3, Wallet, Globe, FileText, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: TrendingUp,
    title: "Equity Trading",
    description: "Trade in NSE & BSE with our advanced trading platforms and expert guidance.",
  },
  {
    icon: BarChart3,
    title: "Derivatives",
    description: "Futures & Options trading with comprehensive research and market analysis.",
  },
  {
    icon: Globe,
    title: "Currency Trading",
    description: "Trade in currency derivatives with competitive pricing and real-time quotes.",
  },
  {
    icon: Wallet,
    title: "Mutual Funds",
    description: "Invest in top-performing mutual funds with expert portfolio management.",
  },
  {
    icon: FileText,
    title: "IPO Services",
    description: "Get early access to IPOs and expert recommendations for your investments.",
  },
  {
    icon: Smartphone,
    title: "Mobile Trading",
    description: "Trade on-the-go with our powerful Parasram Trade mobile app.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive financial services tailored to meet your investment goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group bg-card hover:shadow-xl transition-all duration-300 border-border/50 hover:border-secondary/50 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <service.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="https://parasramindia.com/services" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
          >
            View All Services on Main Website →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;