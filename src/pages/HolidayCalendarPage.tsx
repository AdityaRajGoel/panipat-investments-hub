import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2 } from "lucide-react";

type Holiday = {
  date: string;
  day: string;
  name: string;
  exchanges: ("NSE" | "BSE" | "MCX")[];
};

const HOLIDAYS_2026: Holiday[] = [
  { date: "Jan 26", day: "Monday", name: "Republic Day", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Feb 27", day: "Friday", name: "Maha Shivaratri", exchanges: ["NSE", "BSE"] },
  { date: "Mar 14", day: "Saturday", name: "Holi", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Mar 31", day: "Tuesday", name: "Id-Ul-Fitr (Ramadan)", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Apr 2", day: "Thursday", name: "Ram Navami", exchanges: ["NSE", "BSE"] },
  { date: "Apr 3", day: "Friday", name: "Good Friday", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Apr 14", day: "Tuesday", name: "Dr. Ambedkar Jayanti", exchanges: ["NSE", "BSE"] },
  { date: "May 1", day: "Friday", name: "Maharashtra Day", exchanges: ["NSE", "BSE"] },
  { date: "Jun 7", day: "Sunday", name: "Bakri Id (Eid ul-Adha)", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Jul 6", day: "Monday", name: "Muharram", exchanges: ["NSE", "BSE"] },
  { date: "Aug 15", day: "Saturday", name: "Independence Day", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Aug 16", day: "Sunday", name: "Parsi New Year", exchanges: ["NSE", "BSE"] },
  { date: "Sep 5", day: "Saturday", name: "Milad-Un-Nabi", exchanges: ["NSE", "BSE"] },
  { date: "Oct 2", day: "Friday", name: "Mahatma Gandhi Jayanti", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Oct 20", day: "Tuesday", name: "Dussehra", exchanges: ["NSE", "BSE", "MCX"] },
  { date: "Nov 4", day: "Wednesday", name: "Diwali (Laxmi Puja)", exchanges: ["NSE", "BSE"] },
  { date: "Nov 5", day: "Thursday", name: "Diwali Balipratipada", exchanges: ["NSE", "BSE"] },
  { date: "Nov 19", day: "Thursday", name: "Guru Nanak Jayanti", exchanges: ["NSE", "BSE"] },
  { date: "Dec 25", day: "Friday", name: "Christmas", exchanges: ["NSE", "BSE", "MCX"] },
];

const getMonth = (dateStr: string) => dateStr.split(" ")[0];

const HolidayCalendarPage = () => {
  const months = [...new Set(HOLIDAYS_2026.map(h => getMonth(h.date)))];
  const now = new Date();
  const currentMonthAbbr = now.toLocaleString("en", { month: "short" });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="NSE BSE Holiday Calendar 2026" description="Complete list of NSE, BSE, and MCX trading holidays for 2026. Plan your trades around market closures." keywords="NSE holidays 2026, BSE holidays, MCX holidays, stock market holidays India" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Market Holiday Calendar 2026</h1>
          </div>
          <p className="text-muted-foreground">NSE, BSE & MCX trading holidays — plan your trades in advance</p>
        </motion.div>

        <div className="flex items-center gap-3 mb-6 text-sm">
          <Badge className="bg-primary text-primary-foreground">NSE</Badge>
          <Badge className="bg-secondary text-secondary-foreground">BSE</Badge>
          <Badge variant="outline" className="border-brand-gold text-brand-gold">MCX</Badge>
          <span className="text-muted-foreground ml-2">Total: {HOLIDAYS_2026.length} holidays</span>
        </div>

        <div className="space-y-8">
          {months.map(month => {
            const holidays = HOLIDAYS_2026.filter(h => getMonth(h.date) === month);
            const isCurrent = month === currentMonthAbbr;
            return (
              <motion.div key={month} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-lg font-heading font-semibold text-foreground">{month} 2026</h2>
                  {isCurrent && <Badge className="bg-secondary/20 text-secondary text-xs">Current Month</Badge>}
                </div>
                <div className="grid gap-2">
                  {holidays.map((h, i) => {
                    const isPast = false; // simplified
                    return (
                      <Card key={i} className={`flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50 ${isPast ? "opacity-50" : ""}`}>
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[50px]">
                            <div className="text-lg font-bold text-foreground">{h.date.split(" ")[1]}</div>
                            <div className="text-xs text-muted-foreground">{h.day}</div>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{h.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {h.exchanges.map(ex => (
                            <Badge key={ex} variant={ex === "MCX" ? "outline" : "default"} className={`text-[10px] px-1.5 ${ex === "NSE" ? "bg-primary text-primary-foreground" : ex === "BSE" ? "bg-secondary text-secondary-foreground" : "border-brand-gold text-brand-gold"}`}>
                              {ex}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <Card className="mt-8 p-4 bg-muted/50 flex items-start gap-3">
          <Building2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">Holiday dates are subject to change by exchange authorities. Special trading sessions (e.g., Muhurat Trading on Diwali) are not listed. Always verify with official NSE/BSE circulars.</p>
        </Card>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default HolidayCalendarPage;
