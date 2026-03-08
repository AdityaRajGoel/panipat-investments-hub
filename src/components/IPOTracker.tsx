import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar, Clock, TrendingUp, ArrowUpRight, ArrowDownRight,
  ChevronRight, Rocket, CheckCircle2, Timer, Star, IndianRupee
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type IPO = {
  name: string;
  price: string;
  date: string;
  size: string;
  status: "upcoming" | "open" | "listed";
  gmp?: string;
  gmpUp?: boolean;
  listingGain?: string;
  listingUp?: boolean;
  rating?: number;
  type: "Mainboard" | "SME";
};

const ipoData: IPO[] = [
  // Upcoming
  { name: "Hexaware Technologies", price: "₹674-₹708", date: "Mar 12-14, 2026", size: "₹8,750 Cr", status: "upcoming", gmp: "+₹85", gmpUp: true, rating: 4, type: "Mainboard" },
  { name: "LG Electronics India", price: "₹1,485-₹1,560", date: "Mar 15-17, 2026", size: "₹15,000 Cr", status: "upcoming", gmp: "+₹120", gmpUp: true, rating: 5, type: "Mainboard" },
  { name: "Ather Energy", price: "₹304-₹321", date: "Mar 18-20, 2026", size: "₹3,100 Cr", status: "upcoming", gmp: "+₹45", gmpUp: true, rating: 3, type: "Mainboard" },
  // Open
  { name: "Vikran Engineering", price: "₹145-₹153", date: "Mar 8-11, 2026", size: "₹520 Cr", status: "open", gmp: "+₹22", gmpUp: true, rating: 3, type: "SME" },
  { name: "Sai Silks Kalamandir", price: "₹210-₹222", date: "Mar 7-10, 2026", size: "₹1,200 Cr", status: "open", gmp: "-₹8", gmpUp: false, rating: 2, type: "Mainboard" },
  // Listed
  { name: "Bajaj Housing Finance", price: "₹66-₹70", date: "Listed Feb 28", size: "₹6,560 Cr", status: "listed", listingGain: "+42.5%", listingUp: true, rating: 5, type: "Mainboard" },
  { name: "NTPC Green Energy", price: "₹102-₹108", date: "Listed Mar 1", size: "₹10,000 Cr", status: "listed", listingGain: "+8.2%", listingUp: true, rating: 4, type: "Mainboard" },
  { name: "Afcons Infrastructure", price: "₹440-₹463", date: "Listed Mar 3", size: "₹5,430 Cr", status: "listed", listingGain: "-5.1%", listingUp: false, rating: 3, type: "Mainboard" },
];

type TabKey = "upcoming" | "open" | "listed";

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: "upcoming", label: "Upcoming", icon: Timer },
  { key: "open", label: "Open Now", icon: Rocket },
  { key: "listed", label: "Recently Listed", icon: CheckCircle2 },
];

const IPOCard = ({ ipo, index }: { ipo: IPO; index: number }) => (
  <motion.div
    className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:border-brand-orange/30 transition-all cursor-pointer group"
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06 }}
    whileHover={{ y: -3 }}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-bold text-foreground truncate group-hover:text-brand-orange transition-colors">{ipo.name}</h4>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ipo.type === "Mainboard" ? "bg-primary/10 text-primary" : "bg-brand-gold/10 text-brand-gold"}`}>
            {ipo.type}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>{ipo.date}</span>
        </div>
      </div>
      {ipo.rating && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < ipo.rating! ? "text-brand-gold fill-brand-gold" : "text-muted"}`} />
          ))}
        </div>
      )}
    </div>

    <div className="grid grid-cols-3 gap-3">
      <div>
        <div className="text-[10px] text-muted-foreground mb-0.5">Price Band</div>
        <div className="text-xs font-bold text-foreground">{ipo.price}</div>
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground mb-0.5">Issue Size</div>
        <div className="text-xs font-bold text-foreground">{ipo.size}</div>
      </div>
      <div>
        {ipo.status === "listed" ? (
          <>
            <div className="text-[10px] text-muted-foreground mb-0.5">Listing Gain</div>
            <div className={`text-xs font-bold flex items-center gap-0.5 ${ipo.listingUp ? "text-secondary" : "text-destructive"}`}>
              {ipo.listingUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {ipo.listingGain}
            </div>
          </>
        ) : (
          <>
            <div className="text-[10px] text-muted-foreground mb-0.5">GMP</div>
            <div className={`text-xs font-bold flex items-center gap-0.5 ${ipo.gmpUp ? "text-secondary" : "text-destructive"}`}>
              {ipo.gmpUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {ipo.gmp}
            </div>
          </>
        )}
      </div>
    </div>

    {ipo.status === "open" && (
      <motion.div className="mt-3 pt-3 border-t border-border/30">
        <a
          href="https://parasramindia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-secondary to-brand-green text-secondary-foreground text-[11px] font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <IndianRupee className="w-3 h-3" />
          Apply Now
          <ChevronRight className="w-3 h-3" />
        </a>
      </motion.div>
    )}
  </motion.div>
);

const IPOTracker = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const filtered = ipoData.filter(i => i.status === activeTab);

  return (
    <section className="py-16 bg-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand-orange/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
            <Rocket className="w-3.5 h-3.5" />
            IPO Central
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">IPO Tracker</h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Track upcoming, open, and recently listed IPOs with GMP updates and expert ratings
          </p>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full mt-3" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} />
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const count = ipoData.filter(i => i.status === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30"
                    : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-muted"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* IPO Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ipo, i) => (
            <IPOCard key={ipo.name} ipo={ipo} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground mb-3">
            Want to apply for IPOs? Open your Demat account with Parasram India today.
          </p>
          <a
            href="https://parasramindia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-gold text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-orange/20"
          >
            <TrendingUp className="w-4 h-4" />
            Open Free Demat Account
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default IPOTracker;
