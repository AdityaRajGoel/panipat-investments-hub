import { MapPin, Phone, Mail, Clock, ExternalLink, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visit Our Branch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Come visit us at our Panipat branch for personalized investment guidance
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Office Address",
                content: (
                  <>
                    Shri Parasram Holdings<br />
                    Shakuntala Complex, Palika Bazaar<br />
                    Panipat, Haryana - 132103
                  </>
                ),
              },
              {
                icon: Phone,
                title: "Phone",
                content: (
                  <>
                    <a href="tel:+919416400314" className="hover:text-secondary transition-colors">
                      +91 9416400314
                    </a><br />
                    <a href="tel:+919999790011" className="hover:text-secondary transition-colors">
                      +91 9999790011
                    </a>
                  </>
                ),
              },
              {
                icon: Mail,
                title: "Email",
                content: (
                  <a href="mailto:anilgoel.sphpnp@gmail.com" className="hover:text-secondary transition-colors">
                    anilgoel.sphpnp@gmail.com
                  </a>
                ),
              },
              {
                icon: Instagram,
                title: "Instagram",
                content: (
                  <a 
                    href="https://www.instagram.com/parasrampanipat/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                  >
                    @parasrampanipat
                  </a>
                ),
              },
              {
                icon: Clock,
                title: "Working Hours",
                content: (
                  <>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* Map placeholder & CTA */}
          <div className="space-y-6">
            <motion.div 
              className="rounded-2xl overflow-hidden border border-border/50 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3469.037453247!2d76.96786!3d29.38917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dda2a2b0e82e1%3A0x8a8a8a8a8a8a8a8a!2sShakuntala%20Complex%2C%20Palika%20Bazaar%2C%20Panipat%2C%20Haryana%20132103!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Parasram Panipat Office Location"
                className="w-full"
              />
              <div className="bg-card p-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Shakuntala Complex, Palika Bazaar, Panipat
                </p>
                <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  <a 
                    href="https://maps.app.goo.gl/g9hDv9cKfdz28Hhx6" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open in Maps
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-hero text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <h3 className="font-heading text-2xl font-bold mb-4">Ready to Start Investing?</h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Open your Demat account today and get access to all our trading platforms
                  </p>
                  <Button 
                    asChild
                    size="lg"
                    className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold w-full transition-all duration-300 hover:scale-105"
                  >
                    <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                      Open Account Now
                      <ExternalLink className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;