import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LiveMarketProvider } from "@/hooks/useLiveMarket";
import { lazy, Suspense } from "react";
import { usePageTracking } from "@/hooks/usePageTracking";
import { motion, AnimatePresence } from "framer-motion";

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
    {/* Animated header skeleton */}
    <div className="h-16 bg-card shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <motion.div
          className="h-10 w-32 bg-muted rounded-lg"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div className="hidden md:flex items-center gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-4 w-16 bg-muted rounded"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Hero skeleton */}
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="space-y-4 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-10 w-3/4 bg-muted rounded-lg"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-5 w-1/2 bg-muted rounded"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.15 }}
        />
      </motion.div>

      {/* Content cards skeleton */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-44 bg-muted rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0.3, 0.5, 0.3], y: 0 }}
            transition={{
              opacity: { duration: 1.5, repeat: Infinity, delay: i * 0.2 },
              y: { duration: 0.4, delay: i * 0.1 },
            }}
          />
        ))}
      </div>

      {/* Chart skeleton */}
      <motion.div
        className="h-72 bg-muted rounded-xl mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0.2, 0.4, 0.2], y: 0 }}
        transition={{
          opacity: { duration: 2, repeat: Infinity },
          y: { duration: 0.5, delay: 0.4 },
        }}
      />
    </div>

    {/* Centered loading indicator */}
    <div className="flex justify-center py-4">
      <motion.div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-secondary"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
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
          <PageTracker />
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
