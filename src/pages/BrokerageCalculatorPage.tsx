import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, ArrowRight } from "lucide-react";

type ChargeBreakdown = {
  brokerage: number;
  stt: number;
  exchangeTxn: number;
  gst: number;
  sebi: number;
  stampDuty: number;
  total: number;
};

const SEGMENTS = [
  { key: "equity_delivery", label: "Equity Delivery" },
  { key: "equity_intraday", label: "Equity Intraday" },
  { key: "futures", label: "F&O Futures" },
  { key: "options", label: "F&O Options" },
  { key: "commodity", label: "Commodity" },
  { key: "currency", label: "Currency" },
];

function calculateCharges(
  segment: string,
  buyPrice: number,
  sellPrice: number,
  qty: number
): ChargeBreakdown {
  const buyValue = buyPrice * qty;
  const sellValue = sellPrice * qty;
  const turnover = buyValue + sellValue;

  let brokerage = 0;
  let sttRate = 0;
  let exchangeRate = 0.0000345;
  let stampRate = 0;

  switch (segment) {
    case "equity_delivery":
      brokerage = Math.min(turnover * 0.003, 40); // 0.3% or ₹20 per order
      sttRate = 0.001; // 0.1% on both sides
      stampRate = 0.00015;
      break;
    case "equity_intraday":
      brokerage = Math.min(turnover * 0.0003, 40);
      sttRate = 0.00025; // 0.025% on sell side
      stampRate = 0.00003;
      break;
    case "futures":
      brokerage = 40; // flat ₹20 per order × 2
      sttRate = 0.000125; // on sell side
      stampRate = 0.00002;
      break;
    case "options":
      brokerage = 40;
      sttRate = 0.000625; // on sell premium
      exchangeRate = 0.00053;
      stampRate = 0.00003;
      break;
    case "commodity":
      brokerage = 40;
      sttRate = 0.0001;
      exchangeRate = 0.00026;
      stampRate = 0.00002;
      break;
    case "currency":
      brokerage = 40;
      sttRate = 0;
      exchangeRate = 0.00009;
      stampRate = 0.00001;
      break;
  }

  const stt = segment === "equity_delivery"
    ? turnover * sttRate
    : sellValue * sttRate;

  const exchangeTxn = turnover * exchangeRate;
  const gst = (brokerage + exchangeTxn) * 0.18;
  const sebi = turnover * 0.000001;
  const stampDuty = buyValue * stampRate;
  const total = brokerage + stt + exchangeTxn + gst + sebi + stampDuty;

  return { brokerage, stt, exchangeTxn, gst, sebi, stampDuty, total };
}

const BrokerageCalculatorPage = () => {
  const [segment, setSegment] = useState("equity_intraday");
  const [buyPrice, setBuyPrice] = useState("1500");
  const [sellPrice, setSellPrice] = useState("1520");
  const [qty, setQty] = useState("100");

  const charges = useMemo(() => {
    return calculateCharges(segment, parseFloat(buyPrice) || 0, parseFloat(sellPrice) || 0, parseInt(qty) || 0);
  }, [segment, buyPrice, sellPrice, qty]);

  const buyVal = (parseFloat(buyPrice) || 0) * (parseInt(qty) || 0);
  const sellVal = (parseFloat(sellPrice) || 0) * (parseInt(qty) || 0);
  const grossPnL = sellVal - buyVal;
  const netPnL = grossPnL - charges.total;

  const fmt = (n: number) => `₹${Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Brokerage Calculator | Parasram India" description="Calculate brokerage, STT, GST, and other charges for equity, F&O, commodity, and currency trades." keywords="brokerage calculator, STT calculator, trading charges, equity brokerage, F&O charges" />
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Brokerage Calculator</h1>
          </div>
          <p className="text-muted-foreground">Calculate total trading charges including brokerage, STT, GST & more</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="font-semibold text-lg text-foreground">Trade Details</h2>
            <div className="space-y-3">
              <div>
                <Label>Segment</Label>
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SEGMENTS.map(s => (
                      <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Buy Price (₹)</Label>
                <Input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
              </div>
              <div>
                <Label>Sell Price (₹)</Label>
                <Input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
            </div>

            {/* P&L summary */}
            <div className={`rounded-lg p-4 ${netPnL >= 0 ? "bg-secondary/10" : "bg-destructive/10"}`}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Net P&L</span>
                <span className={`text-xl font-bold font-mono ${netPnL >= 0 ? "text-secondary" : "text-destructive"}`}>
                  {netPnL >= 0 ? "+" : "-"}{fmt(netPnL)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>Gross: {grossPnL >= 0 ? "+" : "-"}{fmt(grossPnL)}</span>
                <ArrowRight className="w-3 h-3" />
                <span>Charges: {fmt(charges.total)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h2 className="font-semibold text-lg text-foreground">Charge Breakdown</h2>
            {[
              { label: "Brokerage", value: charges.brokerage },
              { label: "STT/CTT", value: charges.stt },
              { label: "Exchange Txn Charges", value: charges.exchangeTxn },
              { label: "GST (18%)", value: charges.gst },
              { label: "SEBI Charges", value: charges.sebi },
              { label: "Stamp Duty", value: charges.stampDuty },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-2 border-b border-border/30">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="font-mono text-sm">{fmt(row.value)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3 mt-2">
              <span className="font-semibold text-foreground">Total Charges</span>
              <span className="font-mono font-bold text-primary">{fmt(charges.total)}</span>
            </div>
            <div className="flex justify-between py-2 text-xs">
              <span className="text-muted-foreground">Charges as % of turnover</span>
              <span className="font-mono">{((charges.total / (buyVal + sellVal)) * 100).toFixed(4)}%</span>
            </div>
          </Card>
        </div>

        <Card className="mt-8 p-4 bg-muted/30 border-muted">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> These calculations are indicative. Actual charges may vary based on your broker's plan, exchange notifications, and regulatory changes. STT rates are as per current SEBI guidelines.
          </p>
        </Card>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default BrokerageCalculatorPage;