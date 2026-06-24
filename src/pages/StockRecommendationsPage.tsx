import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import TelegramChannel from "@/components/TelegramChannel";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import { AlertTriangle, ShieldAlert } from "lucide-react";

const StockRecommendationsPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <SEOHead
          title="Stock Recommendations | Parasram India Panipat"
          description="Latest SEBI-compliant stock recommendations and daily market updates from Parasram India Panipat. Expert equity research for informed investment decisions."
          breadcrumbs={[
            { name: "Home", url: "/" },
            { name: "Learning Center", url: "/learn" },
            { name: "Stock Recommendations", url: "/learn/recommendations" }
          ]}
        />
        <ScrollProgress />
        <Header />
        <main className="flex-grow pt-24 pb-12">
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-destructive/10 border-l-4 border-destructive rounded-r-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-destructive text-lg md:text-xl mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 hidden sm:inline-block" />
                    Strict Risk Warning & Investment Disclaimer
                  </h1>
                  <div className="text-foreground/80 text-sm space-y-3">
                    <p>
                      <strong>Trading and investing in the securities market carries a high degree of risk.</strong> You could potentially lose some or all of your initial investment. The stock recommendations and market analysis provided on this page are strictly for <strong>educational and informational purposes only</strong> and do not constitute certified financial advice.
                    </p>
                    <p>
                      Parasram India Pvt. Ltd. provides these insights based on technical and fundamental analysis, but <strong>past performance does not guarantee future returns.</strong> You must conduct your own independent research or consult with a SEBI-registered financial advisor before executing any trades or investments.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      By proceeding to view these recommendations, you acknowledge that all trading decisions are made entirely at your own risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* We use a high limit for the dedicated page and hide the view all button */}
          <TelegramChannel limit={50} showViewAll={false} />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default StockRecommendationsPage;
