import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Stock = {
  name: string;
  price: string;
  change: string;
  up: boolean;
};

const fallbackTopGainers: Stock[] = [
  { name: "TATA POWER", price: "₹432.50", change: "+4.8%", up: true },
  { name: "ADANI GREEN", price: "₹1,892.30", change: "+3.9%", up: true },
  { name: "ZOMATO", price: "₹178.60", change: "+3.5%", up: true },
  { name: "BHARTI AIRTEL", price: "₹1,245.60", change: "+2.1%", up: true },
  { name: "INFOSYS", price: "₹1,523.40", change: "+3.1%", up: true },
];

const fallbackTopLosers: Stock[] = [
  { name: "PAYTM", price: "₹412.80", change: "-3.2%", up: false },
  { name: "BAJAJ FIN", price: "₹6,892.30", change: "-1.2%", up: false },
  { name: "HDFC BANK", price: "₹1,678.25", change: "-0.8%", up: false },
  { name: "WIPRO", price: "₹478.90", change: "-0.6%", up: false },
  { name: "COAL INDIA", price: "₹425.30", change: "-1.5%", up: false },
];

const marketStats = [
  { icon: Activity, label: "Market Cap", value: "₹385L Cr", color: "text-secondary" },
  { icon: BarChart3, label: "Volume", value: "18.2B", color: "text-brand-gold" },
  { icon: Zap, label: "Advances", value: "1,456", color: "text-secondary" },
  { icon: PieChart, label: "Declines", value: "892", color: "text-destructive" },
];

const StockRow = ({ stock, index }: { stock: Stock; index: number }) => (
  <motion.div
    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
  >
    <span className="font-medium text-sm text-foreground group-hover:text-secondary transition-colors">{stock.name}</span>
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">{stock.price}</span>
      <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
        stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
      }`}>
        {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {stock.change}
      </span>
    </div>
  </motion.div>
);

const MarketOverview = () => {
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3">
            Market Pulse
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Today's Market Overview
          </h2>
        </motion.div>

        {/* Market stats strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {marketStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card border border-border/50 rounded-xl p-4 text-center"
              whileHover={{ scale: 1.03, borderColor: "hsl(145 70% 40% / 0.4)" }}
              transition={{ duration: 0.2 }}
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Gainers & Losers */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-secondary/20 overflow-hidden">
              <div className="bg-secondary/10 px-5 py-3 border-b border-secondary/20 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <h3 className="font-heading font-bold text-foreground">Top Gainers</h3>
              </div>
              <CardContent className="p-3">
                {fallbackTopGainers.map((stock, i) => (
                  <StockRow key={stock.name} stock={stock} index={i} />
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-destructive/20 overflow-hidden">
              <div className="bg-destructive/10 px-5 py-3 border-b border-destructive/20 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <h3 className="font-heading font-bold text-foreground">Top Losers</h3>
              </div>
              <CardContent className="p-3">
                {fallbackTopLosers.map((stock, i) => (
                  <StockRow key={stock.name} stock={stock} index={i} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
