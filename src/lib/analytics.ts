/**
 * A simple tracking utility for Ourrika Experiences.
 * In a real production app, these functions would push to Google Analytics, 
 * Meta Pixel, or a custom event pipeline.
 */

type EventName = 
  | 'page_view'
  | 'booking_submit'
  | 'whatsapp_click'
  | 'cta_click'
  | 'newsletter_signup';

interface TrackingParams {
  item_id?: string;
  item_name?: string;
  category?: string;
  location?: string;
  [key: string]: any;
}

export const trackEvent = (name: EventName, params?: TrackingParams) => {
  if (typeof window === 'undefined') return;

  // Log to console in dev mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Event: ${name}`, params);
  }

  // Example: Google Analytics implementation
  // if (window.gtag) {
  //   window.gtag('event', name, params);
  // }
};

/** Hook for tracking page views if needed for complex client-side navigation. */
export function useAnalytics() {
  return {
    track: trackEvent,
  };
}
