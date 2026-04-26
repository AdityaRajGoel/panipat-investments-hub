import Header from "@/components/Header";
import StockTicker from "@/components/StockTicker";
import Hero from "@/components/Hero";
import ScrollProgress from "@/components/ScrollProgress";
import SEOHead from "@/components/SEOHead";
import AnnouncementBar from "@/components/AnnouncementBar";
import BannerMessage from "@/components/BannerMessage";
import FloatingActions from "@/components/FloatingActions";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";

// Lazy load below-fold heavy components
const LiveChart = lazy(() => import("@/components/LiveChart"));
const MarketDashboard = lazy(() => import("@/components/MarketDashboard"));
const TrustBadges = lazy(() => import("@/components/TrustBadges"));
const AwardsSection = lazy(() => import("@/components/AwardsSection"));
const MarketOverview = lazy(() => import("@/components/MarketOverview"));
const IPOTracker = lazy(() => import("@/components/IPOTracker"));
const ClientMarquee = lazy(() => import("@/components/ClientMarquee"));
const MarketNews = lazy(() => import("@/components/MarketNews"));
const WhyChooseUs = lazy(() => import("@/components/WhyChooseUs"));
const DailyResearch = lazy(() => import("@/components/DailyResearch"));
const TelegramChannel = lazy(() => import("@/components/TelegramChannel"));
const BecomePartner = lazy(() => import("@/components/BecomePartner"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`container mx-auto px-4 py-8`}>
    <Skeleton className={`${height} w-full rounded-xl`} />
  </div>
);

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
      <SEOHead
        title="Best Stock Broker in Panipat"
        description="Parasram India Panipat - SEBI registered stock broker since 1970. Open free Demat account. Stocks, mutual funds, IPO, unlisted shares, F&O, commodities trading."
        keywords="best stock broker Panipat, demat account Panipat, stock trading Panipat, mutual funds Panipat, IPO Panipat, Parasram India, SEBI registered broker Haryana"
        ogImage="https://www.sphpnp.com/logo.png"
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />
      <BannerMessage />
      <ScrollProgress />
      <Header />
      <AnnouncementBar />
      <StockTicker />
      <main id="main-content">
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
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <AwardsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <WhyChooseUs />
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
      <Suspense fallback={<SectionSkeleton height="h-64" />}>
        <DailyResearch />
      </Suspense>
      <Suspense fallback={<SectionSkeleton height="h-80" />}>
        <TelegramChannel />
      </Suspense>
      <div className="hidden md:block">
        <Suspense fallback={<SectionSkeleton height="h-80" />}>
          <BecomePartner />
        </Suspense>
      </div>
      </main>
      <Suspense fallback={<SectionSkeleton height="h-48" />}>
        <Footer />
      </Suspense>
      <FloatingActions />
      </div>
    </PageTransition>
  );
};

export default Index;
