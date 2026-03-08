import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LiveMarketProvider } from "@/hooks/useLiveMarket";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTracking } from "@/hooks/usePageTracking";

const PageTracker = () => { usePageTracking(); return null; };

// Eagerly load the home page for fastest FCP
import Index from "./pages/Index";

// Lazy load all other pages
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const UnlistedZonePage = lazy(() => import("./pages/UnlistedZonePage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const OpenAccountPage = lazy(() => import("./pages/OpenAccountPage"));
const StockScreenerPage = lazy(() => import("./pages/StockScreenerPage"));
const HolidayCalendarPage = lazy(() => import("./pages/HolidayCalendarPage"));
const Week52TrackerPage = lazy(() => import("./pages/Week52TrackerPage"));
const FnODashboardPage = lazy(() => import("./pages/FnODashboardPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-8 w-1/3" />
      <div className="grid md:grid-cols-3 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LiveMarketProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/unlisted-zone" element={<UnlistedZonePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/open-account" element={<OpenAccountPage />} />
              <Route path="/screener" element={<StockScreenerPage />} />
              <Route path="/fno" element={<FnODashboardPage />} />
              <Route path="/holidays" element={<HolidayCalendarPage />} />
              <Route path="/52-week-tracker" element={<Week52TrackerPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LiveMarketProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
