import { Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-hero text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm gap-2">
          <div className="flex items-center gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </a>
            <a href="mailto:panipat@parasramindia.com" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Mail className="w-4 h-4" />
              <span>panipat@parasramindia.com</span>
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
                PARASRAM
              </h1>
              <span className="text-xs text-secondary font-medium -mt-1">Science of Investment</span>
            </div>
          </div>
          
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