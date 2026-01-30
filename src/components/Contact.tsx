import { MapPin, Phone, Mail, Clock, ExternalLink, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visit Our Branch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Come visit us at our Panipat branch for personalized investment guidance
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Office Address</h3>
                    <p className="text-muted-foreground">
                      Shri Parasram Holdings<br />
                      Shakuntala Complex, Palika Bazaar<br />
                      Panipat, Haryana - 132103
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Phone</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+919416400314" className="hover:text-secondary transition-colors">
                        +91 9416400314
                      </a><br />
                      <a href="tel:+919999790011" className="hover:text-secondary transition-colors">
                        +91 9999790011
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Instagram</h3>
                    <p className="text-muted-foreground">
                      <a 
                        href="https://instagram.com/parasrampanipat" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                      >
                        @parasrampanipat
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Working Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Map placeholder & CTA */}
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-2xl h-64 flex items-center justify-center border border-border/50">
              <div className="text-center p-6">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Shakuntala Complex, Palika Bazaar, Panipat
                </p>
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <a 
                    href="https://maps.google.com/?q=Shakuntala+Complex+Palika+Bazaar+Panipat+Haryana" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <Card className="bg-hero text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h3 className="font-heading text-2xl font-bold mb-4">Ready to Start Investing?</h3>
                <p className="text-primary-foreground/80 mb-6">
                  Open your Demat account today and get access to all our trading platforms
                </p>
                <Button 
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold w-full"
                >
                  <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                    Open Account Now
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;