import { Phone, Mail, ExternalLink, Instagram, Menu, X, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/unlisted-zone", label: "Unlisted Zone", highlight: true },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/team", label: "Team" },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar - hidden on mobile */}
      <div className="bg-hero text-primary-foreground py-1.5 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <a href="tel:+919416400314" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 9416400314</span>
            </a>
            <a href="tel:+919999790011" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 9999790011</span>
            </a>
            <a href="mailto:parasrampnp@gmail.com" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>parasrampnp@gmail.com</span>
            </a>
            <a href="https://www.instagram.com/parasrampanipat/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.facebook.com/share/18B5W5rZaT/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>
          <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-secondary transition-colors">
            <span>Visit Main Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Main header */}
      <div className="bg-card shadow-md">
        <div className="container mx-auto px-4 py-1 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Parasram - Science of Investment" className="h-10 md:h-20 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-secondary"
                    : (link as any).highlight
                    ? "text-brand-gold font-bold hover:text-secondary"
                    : "text-foreground hover:text-secondary"
                }`}
              >
                {link.label}
                {(link as any).highlight && (
                  <span className="ml-1 text-[9px] bg-brand-gold text-white px-1.5 py-0.5 rounded-full font-bold align-super">NEW</span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold hidden sm:inline-flex"
            >
              <Link to="/open-account">
                Open Account
              </Link>
            </Button>
            
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-foreground hover:text-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className={`block font-medium py-2 border-b border-border/30 transition-colors ${
                        location.pathname === link.href
                          ? "text-secondary"
                          : "text-foreground hover:text-secondary"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Button 
                  asChild
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold mt-2 w-full"
                >
                  <Link to="/open-account" onClick={() => setMobileMenuOpen(false)}>
                    Open Account
                  </Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
