import { ExternalLink, Instagram, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <img src={logo} alt="Parasram" className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-primary-foreground/70 text-sm mb-4">
              Science of Investment - Your trusted partner for wealth creation since 1974.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/parasrampanipat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="tel:+919416400314" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://parasramindia.com/about-parasram" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  About Company
                </a>
              </li>
              <li>
                <a href="https://parasramindia.com/services" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="https://parasramindia.com/research" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  Research
                </a>
              </li>
              <li>
                <a href="https://parasramindia.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Panipat Branch</h4>
            <p className="text-primary-foreground/70 text-sm mb-3">
              Shri Parasram Holdings<br />
              Shakuntala Complex, Palika Bazaar<br />
              Panipat - 132103
            </p>
            <p className="text-primary-foreground/70 text-sm">
              <a href="tel:+919416400314" className="hover:text-secondary">+91 9416400314</a><br />
              <a href="tel:+919999790011" className="hover:text-secondary">+91 9999790011</a>
            </p>
          </div>
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
                © {new Date().getFullYear()} Paras Ram India Pvt. Ltd. All rights reserved. | Panipat Branch
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;