import { ExternalLink, Instagram, Phone, Mail, Facebook, ArrowUp, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

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
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={logo}
              alt="Parasram"
              className="h-12 w-auto mb-4 brightness-0 invert"
              whileHover={{ scale: 1.05 }}
            />
            <p className="text-primary-foreground/70 text-sm mb-4">
              Science of Investment - Your trusted partner for wealth creation since 1970.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: "https://www.instagram.com/parasrampanipat/", icon: Instagram, label: "Instagram" },
                { href: "tel:+919416400314", icon: Phone, label: "Phone" },
                { href: "mailto:parasrampnp@gmail.com", icon: Mail, label: "Email" },
                { href: "https://www.facebook.com/share/18B5W5rZaT/", icon: Facebook, label: "Facebook" },
                { href: "https://x.com/ParasramPanipat", icon: Twitter, label: "X" },
              ].map((item, i) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:scale-110 hover:-translate-y-1 transition-all"
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

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
                { label: "About Company", href: "https://parasramindia.com/about-parasram" },
                { label: "Research", href: "https://parasramindia.com/research" },
              ].map((link, i) => (
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
            <p className="text-primary-foreground/70 text-sm mb-2">
              <a href="tel:+919416400314" className="hover:text-secondary transition-colors">+91 9416400314</a><br />
              <a href="tel:+919999790011" className="hover:text-secondary transition-colors">+91 9999790011</a><br />
              <a href="tel:+919416400277" className="hover:text-secondary transition-colors">+91 9416400277</a>
            </p>
            <p className="text-primary-foreground/70 text-sm">
              <a href="mailto:parasrampnp@gmail.com" className="hover:text-secondary transition-colors">parasrampnp@gmail.com</a>
            </p>
          </motion.div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
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
            <div className="text-center text-sm text-primary-foreground/60">
              <p className="mb-2">
                SEBI Registration No: INZ000220838 | CDSL DP ID: 12058200 | NSDL DP ID: IN302365 | MCX: INZ000033839
              </p>
              <p className="mb-2 text-primary-foreground/80">
                <Link to="/privacy-policy" className="hover:text-secondary hover:underline transition-colors">Privacy Policy</Link>
                <span className="mx-2">|</span>
                <Link to="/cookie-policy" className="hover:text-secondary hover:underline transition-colors">Cookie Policy</Link>
              </p>
              <p>
                © {new Date().getFullYear()} Parasram India Pvt. Ltd. All rights reserved. | Panipat Branch
              </p>
            </div>
            <button
              onClick={scrollToTop}
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
