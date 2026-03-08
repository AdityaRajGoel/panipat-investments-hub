import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Loader2, CheckCircle2, User, Phone, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast({ title: "Name and phone are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: { ...form, city: "Contact Page Inquiry" },
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Message sent! ✅", description: "We'll get back to you shortly." });
      if (data?.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please call us directly.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="bg-card border border-secondary/30 rounded-2xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle2 className="w-8 h-8 text-secondary" />
        </motion.div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground text-sm">Our team will contact you within 24 hours.</p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-lg space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="font-heading text-xl font-bold text-foreground mb-1">Send Us a Message</h3>
      <p className="text-muted-foreground text-sm mb-4">Fill out the form and we'll get back to you within a business day.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input name="name" placeholder="Your Name *" value={form.name} onChange={handleChange} className="pl-10" required />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} className="pl-10" required />
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input name="email" type="email" placeholder="Email (optional)" value={form.email} onChange={handleChange} className="pl-10" />
      </div>

      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Textarea name="message" placeholder="Your message..." value={form.message} onChange={handleChange} className="pl-10 min-h-[100px]" />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </motion.form>
  );
};

export default ContactForm;
