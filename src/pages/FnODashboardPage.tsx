import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Activity, Target, BarChart3 } from "lucide-react";

// Demo F&O data - in production this would come from a live API
type OptionData = {
  strike: number;
  callOI: number;
  callChange: number;
  callLTP: number;
  callIV: number;
  putOI: number;
  putChange: number;
  putLTP: number;
  putIV: number;
};

const NIFTY_SPOT = 22147;

const generateOptionsChain = (spot: number): OptionData[] => {
  const strikes: OptionData[] = [];
  const baseStrike = Math.round(spot / 50) * 50;
  for (let i = -12; i <= 12; i++) {
    const strike = baseStrike + i * 50;
    const dist = Math.abs(strike - spot);
    const callOI = Math.round((15000 - dist * 8 + Math.random() * 5000) * 100) / 100;
    const putOI = Math.round((12000 - dist * 6 + Math.random() * 5000) * 100) / 100;
    const callIV = 12 + dist * 0.02 + Math.random() * 3;
    const putIV = 11 + dist * 0.02 + Math.random() * 3;
    const intrinsicCall = Math.max(0, spot - strike);
    const intrinsicPut = Math.max(0, strike - spot);
    const timeValue = 50 + Math.random() * 80;
    strikes.push({
      strike,
      callOI: Math.max(500, callOI),
      callChange: (Math.random() - 0.4) * 3000,
      callLTP: intrinsicCall + timeValue * (1 - dist / 1500),
      callIV,
      putOI: Math.max(500, putOI),
      putChange: (Math.random() - 0.4) * 3000,
      putLTP: intrinsicPut + timeValue * (1 - dist / 1500),
      putIV,
    });
  }
  return strikes;
};

const EXPIRIES = ["27 Mar 2026", "03 Apr 2026", "10 Apr 2026", "24 Apr 2026", "29 May 2026"];

// Max Pain calculation
const calculateMaxPain = (chain: OptionData[]): number => {
  let minPain = Infinity;
  let maxPainStrike = chain[0]?.strike ?? 0;

  for (const row of chain) {
    let totalPain = 0;
    for (const other of chain) {
      if (row.strike < other.strike) totalPain += other.putOI * (other.strike - row.strike);
      if (row.strike > other.strike) totalPain += other.callOI * (row.strike - other.strike);
    }
    if (totalPain < minPain) {
      minPain = totalPain;
      maxPainStrike = row.strike;
    }
  }
  return maxPainStrike;
};

const FnODashboardPage = () => {
  const [symbol, setSymbol] = useState("NIFTY");
  const [expiry, setExpiry] = useState(EXPIRIES[0]);
  const chain = useMemo(() => generateOptionsChain(NIFTY_SPOT), []);
  const maxPain = useMemo(() => calculateMaxPain(chain), [chain]);

  const totalCallOI = chain.reduce((s, r) => s + r.callOI, 0);
  const totalPutOI = chain.reduce((s, r) => s + r.putOI, 0);
  const pcr = totalPutOI / totalCallOI;
  const maxCallOI = Math.max(...chain.map(r => r.callOI));
  const maxPutOI = Math.max(...chain.map(r => r.putOI));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="F&O Dashboard | Options Chain, PCR & Max Pain" description="Live F&O dashboard with options chain viewer, Put-Call ratio trends, and max pain calculator for NIFTY and BANKNIFTY." keywords="options chain India, PCR ratio, max pain calculator, NIFTY options, F&O dashboard" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">F&O Dashboard</h1>
          <p className="text-muted-foreground">Options chain, Put-Call Ratio & Max Pain analysis</p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="NIFTY">NIFTY 50</SelectItem>
              <SelectItem value="BANKNIFTY">BANK NIFTY</SelectItem>
              <SelectItem value="FINNIFTY">FIN NIFTY</SelectItem>
            </SelectContent>
          </Select>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EXPIRIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-sm py-1.5 px-3">
            Spot: <span className="font-mono font-bold ml-1">₹{NIFTY_SPOT.toLocaleString("en-IN")}</span>
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 text-center">
            <Activity className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Put-Call Ratio</p>
            <p className={`text-2xl font-bold font-mono ${pcr > 1 ? "text-secondary" : "text-destructive"}`}>{pcr.toFixed(2)}</p>
            <p className="text-[10px] text-muted-foreground">{pcr > 1.2 ? "Bullish" : pcr > 0.8 ? "Neutral" : "Bearish"}</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Max Pain</p>
            <p className="text-2xl font-bold font-mono text-foreground">₹{maxPain.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">{maxPain > NIFTY_SPOT ? "Above Spot" : "Below Spot"}</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-secondary" />
            <p className="text-xs text-muted-foreground">Total Call OI</p>
            <p className="text-xl font-bold font-mono text-foreground">{(totalCallOI / 1000).toFixed(0)}K</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">Total Put OI</p>
            <p className="text-xl font-bold font-mono text-foreground">{(totalPutOI / 1000).toFixed(0)}K</p>
          </Card>
        </div>

        <Tabs defaultValue="chain" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="chain">Options Chain</TabsTrigger>
            <TabsTrigger value="oi">OI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chain">
            <Card className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th colSpan={4} className="text-center px-2 py-2 font-semibold text-secondary border-r border-border">CALLS</th>
                    <th className="px-3 py-2 font-semibold text-foreground">STRIKE</th>
                    <th colSpan={4} className="text-center px-2 py-2 font-semibold text-destructive border-l border-border">PUTS</th>
                  </tr>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                    <th className="px-2 py-1.5 text-right">OI</th>
                    <th className="px-2 py-1.5 text-right">Chg</th>
                    <th className="px-2 py-1.5 text-right">LTP</th>
                    <th className="px-2 py-1.5 text-right border-r border-border">IV%</th>
                    <th className="px-3 py-1.5 text-center"></th>
                    <th className="px-2 py-1.5 text-left border-l border-border">OI</th>
                    <th className="px-2 py-1.5 text-left">Chg</th>
                    <th className="px-2 py-1.5 text-left">LTP</th>
                    <th className="px-2 py-1.5 text-left">IV%</th>
                  </tr>
                </thead>
                <tbody>
                  {chain.map((row, i) => {
                    const isATM = Math.abs(row.strike - NIFTY_SPOT) < 25;
                    const isITMCall = row.strike < NIFTY_SPOT;
                    const isITMPut = row.strike > NIFTY_SPOT;
                    return (
                      <motion.tr
                        key={row.strike}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${isATM ? "bg-brand-gold/10 font-semibold" : ""}`}
                      >
                        <td className={`px-2 py-2 text-right font-mono ${isITMCall ? "bg-secondary/5" : ""}`}>
                          {(row.callOI / 1000).toFixed(1)}K
                          <div className="h-1 bg-muted rounded-full mt-0.5"><div className="h-full bg-secondary/40 rounded-full" style={{ width: `${(row.callOI / maxCallOI) * 100}%` }} /></div>
                        </td>
                        <td className={`px-2 py-2 text-right font-mono ${row.callChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                          {row.callChange >= 0 ? "+" : ""}{(row.callChange / 1000).toFixed(1)}K
                        </td>
                        <td className={`px-2 py-2 text-right font-mono ${isITMCall ? "bg-secondary/5" : ""}`}>
                          {row.callLTP > 0 ? row.callLTP.toFixed(1) : "—"}
                        </td>
                        <td className="px-2 py-2 text-right font-mono text-muted-foreground border-r border-border">
                          {row.callIV.toFixed(1)}
                        </td>
                        <td className={`px-3 py-2 text-center font-bold font-mono ${isATM ? "text-brand-gold" : "text-foreground"}`}>
                          {row.strike.toLocaleString("en-IN")}
                          {isATM && <span className="block text-[9px] text-brand-gold">ATM</span>}
                        </td>
                        <td className={`px-2 py-2 text-left font-mono border-l border-border ${isITMPut ? "bg-destructive/5" : ""}`}>
                          {(row.putOI / 1000).toFixed(1)}K
                          <div className="h-1 bg-muted rounded-full mt-0.5"><div className="h-full bg-destructive/40 rounded-full" style={{ width: `${(row.putOI / maxPutOI) * 100}%` }} /></div>
                        </td>
                        <td className={`px-2 py-2 text-left font-mono ${row.putChange >= 0 ? "text-secondary" : "text-destructive"}`}>
                          {row.putChange >= 0 ? "+" : ""}{(row.putChange / 1000).toFixed(1)}K
                        </td>
                        <td className={`px-2 py-2 text-left font-mono ${isITMPut ? "bg-destructive/5" : ""}`}>
                          {row.putLTP > 0 ? row.putLTP.toFixed(1) : "—"}
                        </td>
                        <td className="px-2 py-2 text-left font-mono text-muted-foreground">
                          {row.putIV.toFixed(1)}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="oi">
            <div className="grid md:grid-cols-2 gap-4">
              {/* OI Bar Chart - Calls */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-secondary" /> Call OI by Strike
                </h3>
                <div className="space-y-1.5">
                  {chain.filter((_, i) => i % 2 === 0).map(row => (
                    <div key={row.strike} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-right font-mono text-muted-foreground">{row.strike}</span>
                      <div className="flex-1 h-4 bg-muted rounded-sm relative">
                        <div className="absolute left-0 top-0 h-full bg-secondary/50 rounded-sm" style={{ width: `${(row.callOI / maxCallOI) * 100}%` }} />
                      </div>
                      <span className="w-12 text-right font-mono">{(row.callOI / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </Card>
              {/* OI Bar Chart - Puts */}
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-destructive" /> Put OI by Strike
                </h3>
                <div className="space-y-1.5">
                  {chain.filter((_, i) => i % 2 === 0).map(row => (
                    <div key={row.strike} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-right font-mono text-muted-foreground">{row.strike}</span>
                      <div className="flex-1 h-4 bg-muted rounded-sm relative">
                        <div className="absolute left-0 top-0 h-full bg-destructive/50 rounded-sm" style={{ width: `${(row.putOI / maxPutOI) * 100}%` }} />
                      </div>
                      <span className="w-12 text-right font-mono">{(row.putOI / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Data shown is for demonstration purposes. Options data requires a live market feed for real-time values.
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default FnODashboardPage;
