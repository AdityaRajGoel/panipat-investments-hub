import { Phone, Mail, ExternalLink, Instagram, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#unlisted-shares", label: "Unlisted Shares" },
    { href: "#app", label: "App" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-hero text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="tel:+919416400314" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 9416400314</span>
            </a>
            <a href="tel:+919999790011" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 9999790011</span>
            </a>
            <a href="mailto:parasrampnp@gmail.com" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              <span>parasrampnp@gmail.com</span>
            </a>
            <a 
              href="https://www.instagram.com/parasrampanipat/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-secondary transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>@parasrampanipat</span>
            </a>
          </div>
          <a 
            href="https://parasramindia.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-secondary transition-colors"
          >
            <span>Visit Main Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      {/* Main header */}
      <div className="bg-card shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Parasram - Science of Investment" className="h-20 md:h-24 w-auto" />
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="font-medium text-foreground hover:text-secondary transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <Button 
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold hidden sm:inline-flex"
            >
              <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                Open Account
              </a>
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
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="font-medium text-foreground hover:text-secondary transition-colors py-2 border-b border-border/30"
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                <Button 
                  asChild
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold mt-2 w-full"
                >
                  <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                    Open Account
                  </a>
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