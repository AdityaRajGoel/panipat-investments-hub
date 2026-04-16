import { ExternalLink, Instagram, Phone, Mail, Facebook, ArrowUp, Twitter, Shield, FileText, AlertCircle, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo80 from "@/assets/logo-80.webp";
import logo160 from "@/assets/logo-160.webp";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-hero text-primary-foreground relative overflow-hidden">
      {/* Animated top border */}
      <div
        className="h-1 bg-gradient-to-r from-secondary via-brand-gold to-secondary"
        style={{ backgroundSize: "200% 100%", animation: "ticker-left 6s linear infinite alternate" }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Main 4-column grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1 — Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={logo80}
              srcSet={`${logo80} 80w, ${logo160} 160w`}
              sizes="48px"
              alt="Parasram"
              width={80}
              height={80}
              className="h-12 w-auto mb-4 brightness-0 invert"
              whileHover={{ scale: 1.05 }}
            />
            <p className="text-primary-foreground/70 text-sm mb-4">
              Science of Investment - Your trusted partner for wealth creation since 1970.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://www.instagram.com/parasrampanipat/", icon: Instagram, label: "Instagram" },
                { href: "tel:+919416400314", icon: Phone, label: "Phone" },
                { href: "mailto:parasrampnp@gmail.com", icon: Mail, label: "Email" },
                { href: "https://www.facebook.com/share/18B5W5rZaT/", icon: Facebook, label: "Facebook" },
                { href: "https://x.com/ParasramPanipat", icon: Twitter, label: "X" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={item.label}
                  className="w-9 h-9 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:scale-110 hover:-translate-y-1 transition-all"
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2 — Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Stock Screener", href: "/screener", internal: true },
                { label: "52-Week Tracker", href: "/52-week-tracker", internal: true },
                { label: "Holiday Calendar", href: "/holidays", internal: true },
                { label: "Unlisted Shares", href: "/unlisted-space", internal: true },
                { label: "Brokerage Calculator", href: "/brokerage-calculator", internal: true },
                { label: "Learning Center", href: "/learn", internal: true },
              ].map((link) => (
                <li
                  key={link.label}
                  className="hover:translate-x-1 transition-transform"
                >
                  {(link as any).internal ? (
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3 — Important Links (NEW) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h4 className="font-heading font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Company", href: "https://www.parasramindia.com/about-us/" },
                { label: "Research", href: "https://www.parasramindia.com/tools-and-research/" },
                { label: "Investor Charter", href: "https://parasramindia.com/investor-charter" },
                { label: "SCORES Portal", href: "https://scores.sebi.gov.in", title: "SEBI Complaint Redressal" },
                { label: "NSE Investor", href: "https://www.nseindia.com/static/invest/investors-home" },
                { label: "BSE Investor", href: "https://www.bseindia.com/investor.html" },
                { label: "Useful Downloads", href: "https://www.parasramindia.com/software-setups/" },
              ].map((link) => (
                <li
                  key={link.label}
                  className="hover:translate-x-1 transition-transform"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.title}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 — Panipat Branch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-heading font-semibold mb-4">Panipat Branch</h4>
            <p className="text-primary-foreground/70 text-sm mb-3">
              Shri Parasram Holdings<br />
              Shakuntala Complex, Palika Bazaar<br />
              Panipat - 132103
            </p>
            <div className="flex flex-col gap-1 text-sm mb-3">
              <a href="tel:+919416400314" className="hover:text-secondary transition-colors py-1.5 inline-block min-h-[44px] flex items-center">+91 9416400314</a>
              <a href="tel:+919999790011" className="hover:text-secondary transition-colors py-1.5 inline-block min-h-[44px] flex items-center">+91 9999790011</a>
              <a href="tel:+919416400277" className="hover:text-secondary transition-colors py-1.5 inline-block min-h-[44px] flex items-center">+91 9416400277</a>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              <a href="mailto:parasrampnp@gmail.com" className="hover:text-secondary transition-colors">parasrampnp@gmail.com</a>
            </p>

            {/* App Download */}
            <div className="flex gap-2">
              <a
                href="https://play.google.com/store/apps/details?id=com.parasramindia.xts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary-foreground/10 hover:bg-secondary/30 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:scale-105"
              >
                 Google Play
              </a>
              <a
                href="https://apps.apple.com/us/app/parasram-trade/id1564728869"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary-foreground/10 hover:bg-secondary/30 rounded-lg px-3 py-2 text-xs font-medium transition-all hover:scale-105"
              >
                 App Store
              </a>
            </div>
          </motion.div>
        </div>

        {/* Compliance & Grievance Section (NEW) */}
        <motion.div
          className="border-t border-primary-foreground/15 pt-6 mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Compliance Officer */}
            <div className="bg-primary-foreground/5 rounded-xl p-4 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-secondary" />
                <h5 className="font-semibold text-sm">Compliance Officer</h5>
              </div>
              <p className="text-primary-foreground/60 text-xs leading-relaxed">
                <strong className="text-primary-foreground/80">Mr. Pankaj Kumar Gupta</strong><br />
                Email: <a href="mailto:compliance@parasramindia.com" className="hover:text-secondary transition-colors">compliance@parasramindia.com</a><br />
                Phone: <a href="tel:+911৩055555" className="hover:text-secondary transition-colors">+91 130-4055555</a>
              </p>
            </div>

            {/* Grievance Redressal */}
            <div className="bg-primary-foreground/5 rounded-xl p-4 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-brand-gold" />
                <h5 className="font-semibold text-sm">Grievance Redressal</h5>
              </div>
              <p className="text-primary-foreground/60 text-xs leading-relaxed">
                If your grievance is not resolved within 30 days, escalate to{" "}
                <a href="https://scores.sebi.gov.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold">
                  SEBI SCORES
                </a>{" "}
                portal or contact the{" "}
                <a href="https://igms.irda.gov.in" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-semibold">
                  IRDAI IGMS
                </a>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <a
              href="https://parasramindia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:underline text-sm"
            >
              Visit Main Website
              <ExternalLink className="w-4 h-4" />
            </a>
            <div className="text-center text-xs text-primary-foreground/50 max-w-3xl">
              <p className="mb-2">
                SEBI Reg: INZ000220838 | CDSL DP: IN-DP-47-2015 (DP ID: 12058200) | NSDL DP: IN-DP-NSDL-194-2001 (DP ID: IN302365) | MCX: INZ000033839 | AMFI ARN: 35616
              </p>
              <p className="mb-2 text-primary-foreground/70">
                <Link to="/privacy-policy" className="hover:text-secondary hover:underline transition-colors">Privacy Policy</Link>
                <span className="mx-2">|</span>
                <Link to="/cookie-policy" className="hover:text-secondary hover:underline transition-colors">Cookie Policy</Link>
                <span className="mx-2">|</span>
                <a href="https://parasramindia.com/investor-charter" target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:underline transition-colors">Investor Charter</a>
                <span className="mx-2">|</span>
                <a href="https://parasramindia.com/disclaimer" target="_blank" rel="noopener noreferrer" className="hover:text-secondary hover:underline transition-colors">Disclaimer</a>
              </p>
              <p className="text-primary-foreground/40">
                Investments in securities market are subject to market risks. Read all related documents carefully before investing.
              </p>
              <p className="mt-2">
                © {new Date().getFullYear()} Parasram India Pvt. Ltd. All rights reserved. | Panipat Branch
              </p>
            </div>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-10 h-10 bg-secondary/20 hover:bg-secondary rounded-full flex items-center justify-center text-primary-foreground transition-all hover:scale-110 hover:-translate-y-1 active:scale-95"
              style={{ animation: "float 2s ease-in-out infinite" }}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
