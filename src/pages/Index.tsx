import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import SEOHead from "@/components/SEOHead";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-fold heavy components
const LiveChart = lazy(() => import("@/components/LiveChart"));
const MarketDashboard = lazy(() => import("@/components/MarketDashboard"));
const TrustBadges = lazy(() => import("@/components/TrustBadges"));
const MarketOverview = lazy(() => import("@/components/MarketOverview"));
const IPOTracker = lazy(() => import("@/components/IPOTracker"));
const ClientMarquee = lazy(() => import("@/components/ClientMarquee"));
const MarketNews = lazy(() => import("@/components/MarketNews"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`container mx-auto px-4 py-8`}>
    <Skeleton className={`${height} w-full rounded-xl`} />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Best Stock Broker in Panipat | Parasram India - Since 1970"
        description="Parasram India Panipat - SEBI registered stock broker since 1970. Open free Demat account. Stocks, mutual funds, IPO, unlisted shares, F&O, commodities trading."
        keywords="best stock broker Panipat, demat account Panipat, stock trading Panipat, mutual funds Panipat, IPO Panipat, Parasram India, SEBI registered broker Haryana"
      />
      <ScrollProgress />
      <Header />
      <AnnouncementBar />
      <StockTicker />
      <Hero />
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <LiveChart />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <MarketDashboard />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-32" />}>
        <TrustBadges />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <MarketOverview />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <IPOTracker />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-24" />}>
        <ClientMarquee />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <MarketNews />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-48" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />
    </div>
  );
};

export default Index;
