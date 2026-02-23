import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    location: "Panipat",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Parasram has been instrumental in growing my investment portfolio. Their personalized advice and local presence in Panipat make all the difference.",
    rating: 5,
  },
  {
    name: "Sunita Sharma",
    role: "Retired Teacher",
    location: "Panipat",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    content: "As a first-time investor, I was nervous. The team at Parasram Panipat guided me patiently and helped me build a secure retirement corpus.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "IT Professional",
    location: "Panipat",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "The Parasram Trade app is fantastic! Easy to use and the research recommendations have consistently given me good returns.",
    rating: 5,
  },
  {
    name: "Priya Gupta",
    role: "Doctor",
    location: "Panipat",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "Trustworthy and reliable. I've been with Parasram for 3 years now and their service quality has been consistently excellent.",
    rating: 5,
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background decoration with parallax */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Testimonials
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Hear from investors in Panipat who have trusted Parasram with their financial journey.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Quote icon */}
              <motion.div
                className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-secondary to-brand-green rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
              >
                <Quote className="w-4 h-4 text-white" />
              </motion.div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-secondary/30"
                  whileHover={{ scale: 1.1 }}
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.location}</div>
                </div>
              </div>

              {/* Hover gradient effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-4">Ready to start your investment journey?</p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            Visit our Panipat branch today
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
