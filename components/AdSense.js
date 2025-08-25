import React, { useEffect, useRef, useState } from 'react';

// Minimal, client-side-only Google AdSense component.
// Usage: <AdSense client="ca-pub-..." slot="1234567890" style={{display:'block'}} format="auto" layout="in-article" fullWidthResponsive="true" />
export default function AdSense({ client, slot, style = { display: 'block' }, className = '', format, layout, fullWidthResponsive, onAdRender, hideOnEmpty = true }) {
  const insRef = useRef(null);
  const [hasAd, setHasAd] = useState(null); // null = unknown, true/false = known

  // Helper to check whether this <ins> already contains an ad
  const insHasAd = () => {
    try {
      const el = insRef.current;
      if (!el) return false;
      // If an iframe is present inside, ad rendered
      if (el.querySelector && el.querySelector('iframe')) return true;
      // Or if it has a non-zero height
      if (el.offsetHeight && el.offsetHeight > 0) return true;
      // Or if adsbygoogle has marked it done
      const status = el.getAttribute && el.getAttribute('data-adsbygoogle-status');
      if (status && /done|filled|rendered/i.test(status)) return true;
    } catch (e) {
      // ignore
    }
    return false;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pushAd = () => {
      try {
        // Avoid pushing if this particular <ins> already has an ad. This prevents
        // the TagError: "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
        if (insRef.current && insHasAd()) return;
        if (!window || !window.adsbygoogle || typeof window.adsbygoogle.push !== 'function') return;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore push errors
        // console.warn('adsbygoogle push failed', e);
      }
    };

    // Ensure script is present only once per page
    const scriptId = 'adsbygoogle-js';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      script.onload = () => {
        pushAd();
      };
      document.head.appendChild(script);
    } else {
      // script already present — just push
      // small timeout to let any async init complete
      setTimeout(pushAd, 50);
    }

    // Also attempt to push when the component mounts
    // (if script already loaded, this will show the ad)
    // Delay a bit to avoid racing with SSR hydration
    const t = setTimeout(pushAd, 150);
    return () => clearTimeout(t);
  }, [client]);

  // Observe the <ins> element for changes (iframe insertion or height changes)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = insRef.current;
    if (!el) return;

    let settled = false;
    const checkForAd = () => {
      try {
        if (!el) return false;
        // If an iframe is present inside, ad rendered
        if (el.querySelector && el.querySelector('iframe')) return true;
        // Or if it has a non-zero height
        if (el.offsetHeight && el.offsetHeight > 0) return true;
      } catch (e) {
        // ignore
      }
      return false;
    };

    const notify = (val) => {
      if (settled && val === hasAd) return;
      settled = true;
      setHasAd(val);
      if (typeof onAdRender === 'function') {
        try {
          onAdRender(Boolean(val));
        } catch (e) {
          // ignore
        }
      }
    };

    // Mutation observer to detect when adsbygoogle injects nodes
    const mo = new MutationObserver(() => {
      if (checkForAd()) notify(true);
    });
    try {
      mo.observe(el, { childList: true, subtree: true, attributes: true });
    } catch (e) {
      // ignore
    }

    // Several probes after pushAd to catch delayed renders
    const probes = [200, 500, 1200, 2500];
    const timers = probes.map((ms) =>
      setTimeout(() => {
        if (checkForAd()) notify(true);
      }, ms)
    );

    // Final fallback: if no ad after 3s, consider it empty
    const finalTimer = setTimeout(() => {
      if (!checkForAd()) notify(false);
    }, 3200);

    return () => {
      mo.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, [onAdRender]);

  // Build attributes for the <ins> element
  const dataAttrs = {};
  if (format) dataAttrs['data-ad-format'] = format;
  if (layout) dataAttrs['data-ad-layout'] = layout;
  if (fullWidthResponsive) dataAttrs['data-full-width-responsive'] = fullWidthResponsive;

  return (
    <ins
      ref={insRef}
      className={`adsbygoogle ${className}`.trim()}
      // If we detected there is no ad and hideOnEmpty is true, hide the element
      style={hasAd === false && hideOnEmpty ? { ...style, display: 'none' } : style}
      data-ad-client={client}
      data-ad-slot={slot}
      {...dataAttrs}
    />
  );
}
