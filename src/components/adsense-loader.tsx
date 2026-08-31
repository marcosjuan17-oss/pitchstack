import { useEffect } from "react";
import { hasAdsense, SITE } from "@/lib/stack/monetize.ts";

/** Loads AdSense only after a real publisher ID is configured. */
export function AdsenseLoader() {
  useEffect(() => {
    if (!hasAdsense()) return;
    const client = SITE.adsensePublisherId.trim();
    if (document.querySelector(`script[data-ad-client="${client}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = "anonymous";
    script.dataset.adClient = client;
    document.head.appendChild(script);
  }, []);
  return null;
}
