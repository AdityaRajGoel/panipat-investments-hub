import { Phone, Mail, ExternalLink, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="w-full">
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
            <a 
              href="https://instagram.com/parasrampanipat" 
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
            <img src={logo} alt="Parasram - Science of Investment" className="h-14 md:h-16 w-auto" />
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="font-medium text-foreground hover:text-secondary transition-colors">About</a>
            <a href="#services" className="font-medium text-foreground hover:text-secondary transition-colors">Services</a>
            <a href="#contact" className="font-medium text-foreground hover:text-secondary transition-colors">Contact</a>
          </nav>
          
          <Button 
            asChild
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
          >
            <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
              Open Account
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;