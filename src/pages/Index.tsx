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
        title="Best Stock Broker in Panipat | Parasram India"
        description="SEBI-registered stock broker in Panipat since 1970. Open a free Demat account. Trade stocks, mutual funds, IPO, F&O, commodities and unlisted shares."
        ogImage="https://www.sphpnp.com/logo.png"
        breadcrumbs={[{ name: "Home", url: "/" }]}
        jsonLd={{
          "@type": "VideoObject",
          "name": "Parasram India Panipat — SEBI Registered Stock Broker Since 1970",
          "description": "Discover Parasram India, Panipat's most trusted SEBI-registered stock broker since 1970. Open a free Demat account and trade stocks, mutual funds, IPO, F&O and unlisted shares.",
          "thumbnailUrl": "https://www.sphpnp.com/hero-bg.jpg",
          "uploadDate": "2024-01-01",
          "contentUrl": "https://www.sphpnp.com/video.mp4",
          "publisher": {
            "@type": "Organization",
            "name": "Parasram India - Panipat Branch",
            "logo": { "@type": "ImageObject", "url": "https://www.sphpnp.com/logo.png" }
          }
        }}
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
        <TelegramChannel limit={4} showViewAll={true} />
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
