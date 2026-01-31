import { CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const features = [
  "SEBI Registered Stock Broker",
  "Member of NSE, BSE & MCX",
  "50+ Years of Market Experience",
  "Research-Backed Recommendations",
  "Dedicated Relationship Managers",
  "Real-Time Portfolio Tracking",
];

const About = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: 50, rotateY: -10 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 
              className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              variants={itemVariants}
            >
              Welcome to Parasram India
              <motion.span 
                className="block text-secondary mt-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Panipat Branch
              </motion.span>
            </motion.h2>
            
            <motion.p 
              className="text-muted-foreground text-lg mb-6"
              variants={itemVariants}
            >
              Parasram India is one of India's most trusted stock broking firms with over 
              five decades of experience in the financial markets. Our Panipat branch brings 
              world-class investment services right to your doorstep.
            </motion.p>
            
            <motion.p 
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Whether you're a seasoned investor or just starting your investment journey, 
              our team of experts is here to guide you every step of the way. We combine 
              traditional values with cutting-edge technology to deliver the best trading 
              experience.
            </motion.p>
            
            <motion.div 
              className="grid sm:grid-cols-2 gap-4"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={feature} 
                  className="flex items-center gap-3 group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  </motion.div>
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
          >
            <motion.div 
              className="bg-hero rounded-2xl p-8 lg:p-12 text-primary-foreground shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="font-heading text-2xl font-bold mb-6">Why Choose Our Panipat Branch?</h3>
              <ul className="space-y-4">
                {[
                  { num: 1, title: "Local Expertise", desc: "Team that understands local market dynamics" },
                  { num: 2, title: "Personalized Service", desc: "Face-to-face consultations with our advisors" },
                  { num: 3, title: "Quick Resolution", desc: "On-ground support for all your queries" },
                ].map((item, index) => (
                  <motion.li 
                    key={item.num}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
                  >
                    <motion.span 
                      className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-secondary-foreground font-bold"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.num}
                    </motion.span>
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-primary-foreground/70 text-sm">{item.desc}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-2xl -z-10"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            <motion.div 
              className="absolute -top-4 -left-4 w-16 h-16 bg-brand-gold/20 rounded-xl -z-10"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
