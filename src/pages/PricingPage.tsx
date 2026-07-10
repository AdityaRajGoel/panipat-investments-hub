import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisibleBreadcrumbs from "@/components/VisibleBreadcrumbs";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { IndianRupee, BadgeCheck, Calculator, ArrowRight, Phone, Info } from "lucide-react";

// Published tariff for Shri Parasram Holdings (as listed on broker-data
// aggregators sourced from the firm's tariff sheet). Keep in sync with the
// branch's current schedule - update here when rates change.
const accountCharges = [
  { item: "Demat Account Opening", value: "₹0 (Free)", highlight: true },
  { item: "Trading Account Opening", value: "₹0 (Free)", highlight: true },
  { item: "Demat AMC (Annual Maintenance)", value: "₹885 / year" },
  { item: "Trading Account AMC", value: "Free" },
];

const brokerageCharges = [
  { segment: "Equity Delivery", rate: "0.15%" },
  { segment: "Equity Intraday", rate: "0.02%" },
  { segment: "Equity Futures", rate: "0.02%" },
  { segment: "Equity Options", rate: "₹30 per lot" },
  { segment: "Currency Futures", rate: "0.02%" },
  { segment: "Currency Options", rate: "₹30 per lot" },
  { segment: "Commodity (MCX)", rate: "₹30 per lot" },
];

const otherCharges = [
  { item: "Transaction Charges", value: "0.003%" },
  { item: "GST", value: "18% on brokerage & fees" },
  { item: "Demat Reactivation", value: "₹20 per instruction" },
  { item: "Account Closure", value: "₹35 per instruction" },
];

const faqs = [
  {
    q: "Is the Demat account really free to open?",
    a: "Yes. Both the Demat and trading accounts are free to open at Parasram India Panipat. The only recurring cost is the Demat AMC of ₹885 per year; the trading account has no AMC.",
  },
  {
    q: "How is equity delivery brokerage calculated?",
    a: "Delivery brokerage is 0.15% of the trade value. For example, buying shares worth ₹1,00,000 costs ₹150 in brokerage, plus statutory charges like STT, exchange transaction charges and GST.",
  },
  {
    q: "Are there hidden charges?",
    a: "No. Beyond brokerage you pay only the standard statutory levies (STT, exchange charges, SEBI fees, stamp duty, GST) that apply at every Indian broker. Use our brokerage calculator for an exact breakdown before you trade.",
  },
  {
    q: "Can I negotiate brokerage for high volumes?",
    a: "Active traders and HNI clients can discuss customised brokerage plans at our Panipat branch - call +91 9416400314 or visit us at Shakuntala Complex, Palika Bazaar.",
  },
];

const ChargesTable = ({ title, rows, cols }: { title: string; rows: { [k: string]: string | boolean | undefined }[]; cols: [string, string] }) => (
  <motion.div
    className="bg-card border border-border/50 rounded-2xl overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="font-heading text-lg font-bold text-foreground px-5 py-4 bg-muted/40 border-b border-border/50">
      {title}
    </h2>
    <table className="w-full text-sm">
      <thead>
        <tr className="text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border/40">
          <th className="text-left px-5 py-2.5 font-medium">{cols[0]}</th>
          <th className="text-right px-5 py-2.5 font-medium">{cols[1]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={String(r.item ?? r.segment)} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
            <td className="px-5 py-3 text-foreground">{r.item ?? r.segment}</td>
            <td className={`px-5 py-3 text-right font-semibold ${r.highlight ? "text-secondary" : "text-foreground"}`}>
              {r.value ?? r.rate}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

const PricingPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Brokerage Charges & Pricing | Parasram India Panipat"
          description="Transparent brokerage: free Demat account opening, 0.15% equity delivery, 0.02% intraday & futures, ₹30/lot options. Full charge sheet for Parasram India Panipat."
          canonical="https://www.sphpnp.com/pricing"
          breadcrumbs={[{ name: "Home", url: "/" }, { name: "Pricing & Charges" }]}
          jsonLd={{
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }}
        />
        <ScrollProgress />
        <Header />
        <VisibleBreadcrumbs items={[{ name: "Home", url: "/" }, { name: "Pricing & Charges" }]} />

        <main className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">
          {/* Hero */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
              <IndianRupee className="w-4 h-4" /> Transparent Pricing
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
              Brokerage Charges, <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-brand-gold">No Surprises</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every charge published upfront - the same full-service research and
              branch support, at rates that reward long-term investors.
            </p>
          </motion.div>

          {/* Free-opening banner */}
          <motion.div
            className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 bg-secondary/5 border border-secondary/20 rounded-2xl px-6 py-4 text-sm font-semibold"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="inline-flex items-center gap-1.5 text-secondary"><BadgeCheck className="w-4 h-4" /> ₹0 Account Opening</span>
            <span className="inline-flex items-center gap-1.5 text-secondary"><BadgeCheck className="w-4 h-4" /> Free Trading AMC</span>
            <span className="inline-flex items-center gap-1.5 text-secondary"><BadgeCheck className="w-4 h-4" /> SEBI-Registered Since 1970</span>
          </motion.div>

          <div className="space-y-8">
            <ChargesTable title="Account Charges" rows={accountCharges} cols={["Item", "Charge"]} />
            <ChargesTable title="Brokerage by Segment" rows={brokerageCharges} cols={["Segment", "Brokerage"]} />
            <ChargesTable title="Other Charges" rows={otherCharges} cols={["Item", "Charge"]} />
          </div>

          {/* Calculator cross-links */}
          <motion.div
            className="mt-10 grid sm:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/brokerage-calculator" className="group flex items-center gap-3 bg-card border border-border/50 rounded-xl p-4 hover:border-secondary/40 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors">Brokerage Calculator</div>
                <div className="text-xs text-muted-foreground">See your exact cost & breakeven before trading</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
            </Link>
            <Link to="/margin-calculator" className="group flex items-center gap-3 bg-card border border-border/50 rounded-xl p-4 hover:border-secondary/40 hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors">Margin Calculator</div>
                <div className="text-xs text-muted-foreground">SPAN + exposure margins for F&O positions</div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>

          {/* FAQs */}
          <section className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">Pricing FAQs</h2>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <motion.details
                  key={f.q}
                  className="group bg-card border border-border/50 rounded-xl px-5 py-4 open:border-secondary/40 transition-colors"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <summary className="font-semibold text-sm text-foreground cursor-pointer list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-secondary group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
                </motion.details>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <div className="mt-10 flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/30 border border-border/50 rounded-xl p-4">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Rates shown are the published tariff for Shri Parasram Holdings Pvt. Ltd. and are indicative;
              statutory charges (STT, exchange transaction fees, SEBI fees, stamp duty) apply additionally as per
              regulation. Please confirm the current schedule of charges at the Panipat branch or on your account
              opening tariff sheet. Custom plans are available for active traders.
            </p>
          </div>

          {/* CTA */}
          <motion.div
            className="mt-12 bg-gradient-to-br from-brand-navy to-primary text-white rounded-2xl p-6 md:p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-xl md:text-2xl font-bold mb-2">Ready to invest at these rates?</h2>
            <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
              Open your free Demat account today, or call us to discuss a plan that fits your trading style.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="tel:+919416400314" className="inline-flex items-center gap-2 border border-white/30 hover:border-secondary hover:text-secondary rounded-xl px-5 py-3 text-sm font-semibold transition-colors">
                <Phone className="w-4 h-4" /> +91 9416400314
              </a>
              <Link
                to="/open-account"
                className="inline-flex items-center gap-2 btn-shine bg-gradient-to-r from-secondary to-brand-green text-secondary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.03] transition-transform"
              >
                Open Free Demat Account <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </main>

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default PricingPage;
