"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  CheckCircle2,
  Code2,
  Eye,
  MousePointerClick,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Header from "../../components/header";
import {
  clearEvents,
  getEvents,
  hasConsent,
  LoggedEvent,
  realMode,
  setConsent,
} from "../../lib/tracking";

const kinds = [
  "all",
  "page_view",
  "product_view",
  "cart_add",
  "checkout_started",
  "purchase",
];
function pretty(s: string) {
  return s.replaceAll("_", " ");
}
export default function Dashboard() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<LoggedEvent | null>(null);
  const [consent, setConsentState] = useState(false);
  useEffect(() => {
    const update = () => {
      setEvents(getEvents());
      setConsentState(hasConsent());
    };
    update();
    window.addEventListener("demo-events-updated", update);
    window.addEventListener("demo-consent-updated", update);
    return () => {
      window.removeEventListener("demo-events-updated", update);
      window.removeEventListener("demo-consent-updated", update);
    };
  }, []);
  const shown = useMemo(
    () => events.filter((e) => filter === "all" || e.tealium_event === filter),
    [events, filter],
  );
  const number = (type: string) =>
    events.filter((e) => e.tealium_event === type).length;
  return (
    <>
      <Header />
      <main className="container dashboard">
        <div className="dash-heading">
          <div>
            <span className="eyebrow">
              <Activity size={14} /> DEVELOPER WORKSPACE
            </span>
            <h1>Event monitor</h1>
            <p>
              See exactly what your frontend sends, one interaction at a time.
            </p>
          </div>
          <span className="mode">
            <span className="status-dot" />
            {realMode ? "Real Tealium configured" : "Local demo mode"}
          </span>
        </div>
        <div className="notice">
          <Code2 size={20} />
          <div>
            <strong>Local Event Monitor — Not Tealium UI</strong>
            <p>
              Events are recorded in your browser localStorage. A Tealium
              account and consent are required for real forwarding. “Configured”
              does not confirm network delivery.
            </p>
          </div>
        </div>
        <div className="metrics">
          <div className="metric">
            <span>
              Total events <Activity size={18} />
            </span>
            <strong>{events.length}</strong>
            <small>All tracked interactions</small>
          </div>
          <div className="metric">
            <span>
              Page views <Eye size={18} />
            </span>
            <strong>{number("page_view")}</strong>
            <small>Route visits</small>
          </div>
          <div className="metric">
            <span>
              Product views <ArrowDownRight size={18} />
            </span>
            <strong>{number("product_view")}</strong>
            <small>Detail modal opens</small>
          </div>
          <div className="metric">
            <span>
              Cart additions <MousePointerClick size={18} />
            </span>
            <strong>{number("cart_add")}</strong>
            <small>Products added to bag</small>
          </div>
        </div>
        <div className="dash-grid">
          <section className="panel events-panel">
            <div className="panel-head">
              <div>
                <h2>Event stream</h2>
                <p>Latest activity from this browser</p>
              </div>
              <button
                className="btn ghost small"
                onClick={() => {
                  clearEvents();
                  setSelected(null);
                }}
              >
                <Trash2 size={15} /> Clear events
              </button>
            </div>
            <div className="filters">
              {kinds.map((k) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={filter === k ? "filter active" : "filter"}
                >
                  {pretty(k)}
                </button>
              ))}
            </div>
            <div className="event-list">
              {shown.length === 0 ? (
                <div className="empty">
                  No events yet. Browse products to generate activity.
                </div>
              ) : (
                shown.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e)}
                    className={
                      selected?.id === e.id ? "event selected" : "event"
                    }
                  >
                    <span className="event-icon">
                      <Activity size={16} />
                    </span>
                    <span className="event-main">
                      <strong>{pretty(e.tealium_event)}</strong>
                      <small>
                        {e.product_id ||
                          e.page_name ||
                          e.order_id ||
                          "Store action"}
                      </small>
                    </span>
                    <span className="event-time">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
          <section className="panel inspector">
            <div className="panel-head">
              <div>
                <h2>Payload inspector</h2>
                <p>Full event JSON</p>
              </div>
              {selected && (
                <button
                  className="icon-button"
                  onClick={() => setSelected(null)}
                  aria-label="Close event"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {selected ? (
              <>
                <div className="inspect-name">
                  <CheckCircle2 size={17} />
                  {pretty(selected.tealium_event)}
                </div>
                <pre>{JSON.stringify(selected, null, 2)}</pre>
              </>
            ) : (
              <div className="empty inspect-empty">
                <Code2 size={35} />
                <p>Select an event to inspect its payload.</p>
              </div>
            )}
            <div className="consent">
              <div>
                <Shield size={19} />
                <span>
                  <strong>Third-party tracking consent</strong>
                  <small>
                    {consent
                      ? "Allowed for this browser"
                      : "Disabled by default"}
                  </small>
                </span>
              </div>
              <button
                role="switch"
                aria-checked={consent}
                aria-label="Toggle third-party tracking consent"
                className={consent ? "toggle on" : "toggle"}
                onClick={() => {
                  setConsent(!consent);
                  setConsentState(!consent);
                }}
              >
                <span />
              </button>
            </div>
          </section>
        </div>
      </main>
      <footer>
        Signal Store · Local event inspection is not a Tealium CDP dashboard
      </footer>
    </>
  );
}
