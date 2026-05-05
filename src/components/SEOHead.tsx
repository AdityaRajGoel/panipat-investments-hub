import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

type BreadcrumbItem = {
  name: string;
  url?: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FAQItem[];
  noindex?: boolean;
  type?: "website" | "article" | "profile" | "product";
  datePublished?: string;
  dateModified?: string;
  author?: string;
};

const BASE_URL = "https://www.sphpnp.com";

const SEOHead = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  keywords, 
  jsonLd, 
  breadcrumbs, 
  faqItems, 
  noindex, 
  type = "website", 
  datePublished, 
  dateModified, 
  author 
}: SEOProps) => {
  const location = useLocation();
  const fullCanonical = canonical || `${BASE_URL}${location.pathname}`;
  const fullTitle = title.length > 60 || title === "Best Stock Broker in Panipat" ? title : `${title} | Parasram India`;
  
  // Combine all JSON-LD scripts
  const schemaScripts = [];

  // Custom JSON-LD from props
  if (jsonLd) {
    schemaScripts.push({ "@context": "https://schema.org", ...jsonLd });
  } else if (type === "article") {
    schemaScripts.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": ogImage || "https://www.sphpnp.com/logo.png",
      "datePublished": datePublished || new Date().toISOString(),
      "dateModified": dateModified || datePublished || new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": author || "Parasram India"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Parasram India - Panipat Branch",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.sphpnp.com/logo.png"
        }
      }
    });
  }

  // BreadcrumbList schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemaScripts.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        ...(item.url ? { "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}` } : {}),
      })),
    });
  }

  // FAQPage schema
  if (faqItems && faqItems.length > 0) {
    schemaScripts.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      
      <link rel="canonical" href={fullCanonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Parasram India - Panipat Branch" />
      <meta property="og:locale" content="en_IN" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {type === "article" && datePublished && <meta property="article:published_time" content={datePublished} />}
      {type === "article" && dateModified && <meta property="article:modified_time" content={dateModified} />}
      {type === "article" && author && <meta property="article:author" content={author} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {schemaScripts.map((schema, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
