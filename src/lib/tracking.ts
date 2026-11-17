export type EventName = "page_view" | "product_view" | "cart_add" | "checkout_started" | "purchase";
export type EventData = {
  tealium_event: EventName;
  page_name?: string;
  page_type?: string;
  product_id?: string;
  product_name?: string;
  product_category?: string;
  product_price?: number;
  product_quantity?: number;
  order_value?: number;
  currency?: "INR";
  order_id?: string;
};
export type LoggedEvent = EventData & { id: string; timestamp: string; destination: "local" | "tealium" };

declare global {
  interface Window {
    utag_data?: Record<string, unknown>;
    utag_cfg_ovrd?: { noview?: boolean };
    utag?: { view: (data: EventData) => void; link: (data: EventData) => void };
  }
}

const KEY = "tealium-demo-events-v1";
const CONSENT_KEY = "tealium-demo-consent-v1";
const ACCOUNT = process.env.NEXT_PUBLIC_TEALIUM_ACCOUNT?.trim();
const PROFILE = process.env.NEXT_PUBLIC_TEALIUM_PROFILE?.trim();
const ENV = process.env.NEXT_PUBLIC_TEALIUM_ENV?.trim() || "dev";
export const realMode = Boolean(ACCOUNT && PROFILE);
let scriptState: "idle" | "loading" | "loaded" | "failed" = "idle";
let pending: EventData[] = [];
let lastView = "";

export function hasConsent() {
  return typeof window !== "undefined" && window.localStorage.getItem(CONSENT_KEY) === "yes";
}
export function getEvents(): LoggedEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(KEY) || "[]") as LoggedEvent[]; }
  catch { return []; }
}
export function clearEvents() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("demo-events-updated"));
}
export function setConsent(allowed: boolean) {
  window.localStorage.setItem(CONSENT_KEY, allowed ? "yes" : "no");
  if (!allowed) pending = [];
  window.dispatchEvent(new Event("demo-consent-updated"));
  if (allowed) initTealium();
}

export function initTealium() {
  if (typeof window === "undefined" || !realMode || !hasConsent() || scriptState !== "idle") return;
  // Explicit SPA page views; avoid Tealium's default automatic initial view.
  window.utag_cfg_ovrd = { ...window.utag_cfg_ovrd, noview: true };
  window.utag_data = { page_name: document.title, page_type: "demo" };
  scriptState = "loading";
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://tags.tiqcdn.com/utag/${encodeURIComponent(ACCOUNT!)}/${encodeURIComponent(PROFILE!)}/${encodeURIComponent(ENV)}/utag.js`;
  script.onload = () => {
    scriptState = "loaded";
    // Tealium may finish initialization asynchronously after the script loads.
    let tries = 0;
    const flush = () => {
      if (!hasConsent()) { pending = []; return; }
      if (window.utag?.view && window.utag?.link) {
        for (const evt of pending.splice(0)) sendToTealium(evt);
      } else if (++tries < 30) setTimeout(flush, 100);
    };
    flush();
  };
  script.onerror = () => { scriptState = "failed"; pending = []; };
  document.head.appendChild(script);
}
function sendToTealium(event: EventData) {
  if (!hasConsent()) return;
  try {
    if (event.tealium_event === "page_view") window.utag?.view(event);
    else window.utag?.link(event);
  } catch (error) { console.error("Tealium tracking failed", error); }
}
export function track(event: EventData) {
  if (typeof window === "undefined") return;
  // Events are recorded locally for debugging even without third-party consent.
  const item: LoggedEvent = {
    ...event, id: crypto.randomUUID(), timestamp: new Date().toISOString(),
    destination: realMode && hasConsent() ? "tealium" : "local"
  };
  window.localStorage.setItem(KEY, JSON.stringify([item, ...getEvents()].slice(0, 200)));
  window.dispatchEvent(new Event("demo-events-updated"));
  if (!realMode || !hasConsent()) return;
  initTealium();
  if (window.utag?.view && window.utag?.link) sendToTealium(event);
  else if (scriptState !== "failed") pending.push(event);
}
export function trackView(path: string) {
  // Ignore repeated renders of the same route.
  if (lastView === path) return;
  lastView = path;
  track({ tealium_event: "page_view", page_name: path === "/" ? "Storefront" : "Local Event Monitor", page_type: path === "/" ? "home" : "dashboard" });
}
