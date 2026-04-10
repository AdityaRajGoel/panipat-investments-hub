import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

const BASE_URL = "https://parasramindiapanipat.com";

const SEOHead = ({ title, description, canonical, ogImage, keywords, jsonLd, breadcrumbs, faqItems, noindex, type = "website", datePublished, dateModified, author }: SEOProps) => {
  const location = useLocation();
  const fullCanonical = canonical || `${BASE_URL}${location.pathname}`;
  const fullTitle = title.length > 60 ? title : `${title} | Parasram India`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", fullCanonical, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", "Parasram India - Panipat Branch", true);
    setMeta("og:locale", "en_IN", true);
    if (ogImage) setMeta("og:image", ogImage, true);
    
    // Article specific Open Graph
    if (type === "article") {
      if (datePublished) setMeta("article:published_time", datePublished, true);
      if (dateModified) setMeta("article:modified_time", dateModified, true);
      if (author) setMeta("article:author", author, true);
    }

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = fullCanonical;

    // Remove all previous SEO JSON-LD scripts
    document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());

    // Inject page-specific JSON-LD
    const injectJsonLd = (data: Record<string, any>) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify({ "@context": "https://schema.org", ...data });
      document.head.appendChild(script);
    };

    // Custom JSON-LD from props
    if (jsonLd) {
      injectJsonLd(jsonLd);
    } else if (type === "article") {
      injectJsonLd({
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
      injectJsonLd({
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          ...(item.url ? { "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}` } : {}),
        })),
      });
    }

    // FAQPage schema for Google rich results
    if (faqItems && faqItems.length > 0) {
      injectJsonLd({
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

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach(el => el.remove());
    };
  }, [fullTitle, description, fullCanonical, ogImage, keywords, jsonLd, breadcrumbs, faqItems, noindex, type, datePublished, dateModified, author]);

  return null;
};

export default SEOHead;
