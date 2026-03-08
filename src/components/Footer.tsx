import { ExternalLink, Instagram, Phone, Mail, Facebook, ArrowUp, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-hero text-primary-foreground relative overflow-hidden">
      {/* Animated top border */}
      <motion.div
        className="h-1 bg-gradient-to-r from-secondary via-brand-gold to-secondary"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{ backgroundSize: "200% 100%" }}
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
              Science of Investment - Your trusted partner for wealth creation since 1974.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: "https://www.instagram.com/parasrampanipat/", icon: Instagram, label: "Instagram" },
                { href: "tel:+919416400314", icon: Phone, label: "Phone" },
                { href: "mailto:parasrampnp@gmail.com", icon: Mail, label: "Email" },
                { href: "https://www.facebook.com/share/18B5W5rZaT/", icon: Facebook, label: "Facebook" },
                { href: "https://x.com/ParasramPanipat", icon: Twitter, label: "X" },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.15, y: -3 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.a>
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
                { label: "About Company", href: "https://parasramindia.com/about-parasram" },
                { label: "Our Services", href: "https://parasramindia.com/services" },
                { label: "Research", href: "https://parasramindia.com/research" },
                { label: "Contact Us", href: "https://parasramindia.com/contact-us" },
              ].map((link, i) => (
                <motion.li
                  key={link.label}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                  </a>
                </motion.li>
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
              <p className="mb-1">
                SEBI Registration No: INZ000175134 | NSE: 12583 | BSE: 1153 | MCX: 46510
              </p>
              <p>
                © {new Date().getFullYear()} Parasram India Pvt. Ltd. All rights reserved. | Panipat Branch
              </p>
            </div>
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 bg-secondary/20 hover:bg-secondary rounded-full flex items-center justify-center text-primary-foreground transition-colors"
              whileHover={{ scale: 1.1, y: -3 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
