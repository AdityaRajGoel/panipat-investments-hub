import { ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">PARASRAM</h3>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Science of Investment - Your trusted partner for wealth creation since 1974.
            </p>
            <a 
              href="https://parasramindia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:underline text-sm"
            >
              Visit Main Website
              <ExternalLink className="w-4 h-4" />
            </a>
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
            <h4 className="font-heading font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  SEBI
                </a>
              </li>
              <li>
                <a href="https://www.nseindia.com/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  NSE India
                </a>
              </li>
              <li>
                <a href="https://www.bseindia.com/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  BSE India
                </a>
              </li>
              <li>
                <a href="https://www.mcxindia.com/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  MCX
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="text-center text-sm text-primary-foreground/60">
            <p className="mb-2">
              SEBI Registration No: INZ000175134 | NSE: 12583 | BSE: 1153 | MCX: 46510
            </p>
            <p>
              © {new Date().getFullYear()} Paras Ram India Pvt. Ltd. All rights reserved. | Panipat Branch
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;