import {
  TrendingUp, BarChart3, PieChart, Landmark, FileText, Coins,
  Calculator, GitCompare, Calendar, ArrowUpDown, Activity,
  BookOpen, GraduationCap, Radio, Newspaper,
  Users, Building2, Phone, Mail, Award, ShieldCheck,
  Search, Flame, Briefcase
} from "lucide-react";

export type SubItem = {
  label: string;
  href: string;
  icon: any;
  description: string;
  external?: boolean;
};

export type MegaMenuItem = {
  label: string;
  href?: string;
  highlight?: boolean;
  subItems?: SubItem[];
};

export const megaMenuItems: MegaMenuItem[] = [
  {
    label: "Services",
    href: "/services",
    subItems: [
      { label: "All Services Overview", href: "/services", icon: Briefcase, description: "View our complete range of services" },
      { label: "F&O Trading", href: "/fno", icon: Activity, description: "Futures & Options dashboard" },
      { label: "Unlisted Shares", href: "/unlisted-zone", icon: Flame, description: "Pre-IPO & unlisted opportunities" },
      { label: "Fixed Deposits/Bonds", href: "/products", icon: Building2, description: "FDs, Bonds & Insurance" },
      { label: "Depository Services", href: "/depository-services", icon: ShieldCheck, description: "Demat & CDSL/NSDL" },
    ],
  },
  {
    label: "Unlisted Zone",
    href: "/unlisted-zone",
    highlight: true,
  },
  {
    label: "Markets",
    href: "/screener",
    subItems: [
      { label: "Stock Screener", href: "/screener", icon: Search, description: "Filter stocks by key metrics" },
      { label: "Stock Comparison", href: "/compare", icon: GitCompare, description: "Compare two stocks side-by-side" },
      { label: "52 Week Tracker", href: "/52-week-tracker", icon: ArrowUpDown, description: "Stocks near 52-week highs/lows" },
      { label: "F&O Dashboard", href: "/fno", icon: Activity, description: "Live options chain & OI analysis" },
    ],
  },
  {
    label: "Tools",
    subItems: [
      { label: "Margin Calculator", href: "/margin-calculator", icon: Calculator, description: "Calculate margin requirements" },
      { label: "Brokerage Calculator", href: "/brokerage-calculator", icon: BarChart3, description: "Estimate trading charges & P&L" },
      { label: "Holiday Calendar", href: "/holidays", icon: Calendar, description: "Market holidays for 2026" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    subItems: [
      { label: "Articles & Guides", href: "/learn#articles", icon: GraduationCap, description: "Educational articles & tutorials" },
      { label: "Market News", href: "/learn#news", icon: Newspaper, description: "Latest business & market news" },
      { label: "Live TV", href: "/learn#live-tv", icon: Radio, description: "Zee Business & CNBC Awaaz live" },
    ],
  },
  {
    label: "About",
    href: "/about",
    subItems: [
      { label: "Our Story", href: "/about#about", icon: Building2, description: "Since 1970 — Panipat since 1997" },
      { label: "Our Journey", href: "/about#timeline", icon: Award, description: "Company milestones & timeline" },
      { label: "Our Team", href: "/team", icon: Users, description: "Meet the people behind Parasram Panipat" },
      { label: "SEBI Registration", href: "/about#about", icon: ShieldCheck, description: "Fully licensed & regulated broker" },
      { label: "Careers", href: "/careers", icon: Award, description: "Join our Panipat team" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    subItems: [
      { label: "Get in Touch", href: "/contact#contact-form", icon: Phone, description: "Call, email, or visit our office" },
      { label: "Open Account", href: "/open-account", icon: FileText, description: "Start trading in minutes" },
      { label: "Find Us", href: "/contact#map", icon: Mail, description: "Office location & directions" },
    ],
  },
];
