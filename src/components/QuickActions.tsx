import { motion } from "framer-motion";
import { TrendingUp, Wallet, FileText, Calculator, BarChart3, Smartphone, PieChart, CreditCard } from "lucide-react";

const actions = [
  { icon: TrendingUp, label: "Stocks", color: "bg-secondary/10 text-secondary", href: "https://parasramindia.com" },
  { icon: Wallet, label: "Mutual Funds", color: "bg-brand-gold/10 text-brand-gold", href: "https://parasramindia.com/services" },
  { icon: FileText, label: "IPO", color: "bg-primary/10 text-primary", href: "#unlisted-shares" },
  { icon: Calculator, label: "SIP Calc", color: "bg-secondary/10 text-secondary", href: "#sip-calculator" },
  { icon: BarChart3, label: "Research", color: "bg-brand-gold/10 text-brand-gold", href: "https://parasramindia.com/research" },
  { icon: Smartphone, label: "Trade App", color: "bg-primary/10 text-primary", href: "#app" },
  { icon: PieChart, label: "Portfolio", color: "bg-secondary/10 text-secondary", href: "https://parasramindia.com" },
  { icon: CreditCard, label: "Open Demat", color: "bg-destructive/10 text-destructive", href: "https://parasramindia.com" },
];

const QuickActions = () => {
  return (
    <section className="py-8 bg-card border-b border-border/30 sticky top-[64px] z-30 backdrop-blur-lg bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide pb-1">
          {actions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              target={action.href.startsWith("http") ? "_blank" : undefined}
              rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center gap-1.5 min-w-[72px] py-2 px-3 rounded-xl hover:bg-muted/60 transition-all duration-200 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} transition-all group-hover:shadow-md`}
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                <action.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {action.label}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
