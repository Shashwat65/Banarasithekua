import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scrolls to top on route change (including hash-less policy/detail pages)
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use requestAnimationFrame so layout is painted before scroll adjustment
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    });
  }, [pathname]);
  return null;
}
