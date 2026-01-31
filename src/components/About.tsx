import { CheckCircle2 } from "lucide-react";

const features = [
  "SEBI Registered Stock Broker",
  "Member of NSE, BSE & MCX",
  "50+ Years of Market Experience",
  "Research-Backed Recommendations",
  "Dedicated Relationship Managers",
  "Real-Time Portfolio Tracking",
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Welcome to Parasram India
              <span className="block text-secondary mt-2">Panipat Branch</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-6">
              Parasram India is one of India's most trusted stock broking firms with over 
              five decades of experience in the financial markets. Our Panipat branch brings 
              world-class investment services right to your doorstep.
            </p>
            
            <p className="text-muted-foreground mb-8">
              Whether you're a seasoned investor or just starting your investment journey, 
              our team of experts is here to guide you every step of the way. We combine 
              traditional values with cutting-edge technology to deliver the best trading 
              experience.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-hero rounded-2xl p-8 lg:p-12 text-primary-foreground">
              <h3 className="font-heading text-2xl font-bold mb-6">Why Choose Our Panipat Branch?</h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold">1</span>
                  <div>
                    <div className="font-semibold">Local Expertise</div>
                    <div className="text-primary-foreground/70 text-sm">Team that understands local market dynamics</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold">2</span>
                  <div>
                    <div className="font-semibold">Personalized Service</div>
                    <div className="text-primary-foreground/70 text-sm">Face-to-face consultations with our advisors</div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold">3</span>
                  <div>
                    <div className="font-semibold">Quick Resolution</div>
                    <div className="text-primary-foreground/70 text-sm">On-ground support for all your queries</div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;