import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  jsonLd?: Record<string, any>;
};

const BASE_URL = "https://parasramindiapanipat.com";

const SEOHead = ({ title, description, canonical, ogImage, keywords, jsonLd }: SEOProps) => {
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
    setMeta("robots", "index, follow");

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:url", fullCanonical, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Parasram India - Panipat Branch", true);
    if (ogImage) setMeta("og:image", ogImage, true);

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

    // JSON-LD
    if (jsonLd) {
      const existingScript = document.querySelector('script[data-seo-jsonld]');
      if (existingScript) existingScript.remove();
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify({ "@context": "https://schema.org", ...jsonLd });
      document.head.appendChild(script);
    }

    return () => {
      const script = document.querySelector('script[data-seo-jsonld]');
      if (script) script.remove();
    };
  }, [fullTitle, description, fullCanonical, ogImage, keywords, jsonLd]);

  return null;
};

export default SEOHead;
