import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem("panipat_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("panipat_cookie_consent", "all");
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("panipat_cookie_consent", "essential");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
        >
          <div className="container mx-auto max-w-5xl pointer-events-auto">
            <div className="bg-card border border-border shadow-2xl rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">We value your privacy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic. By clicking "Accept All", you agree to our website's cookie use as described in our{" "}
                    <Link to="/cookie-policy" className="text-secondary hover:underline font-medium">
                      Cookie Policy
                    </Link>.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <Button 
                  variant="outline" 
                  onClick={handleEssentialOnly}
                  className="w-full sm:w-auto font-medium"
                >
                  Essential Only
                </Button>
                <Button 
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy/90 text-white font-medium shadow-md"
                >
                  Accept All
                </Button>
              </div>

              {/* Mobile close button (optional) */}
              <button 
                onClick={handleEssentialOnly}
                className="absolute top-4 right-4 md:hidden p-1 text-muted-foreground hover:text-foreground"
                aria-label="Close cookie banner"
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
