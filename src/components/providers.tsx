"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initTealium, trackView } from "../lib/tracking";
export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useEffect(() => { initTealium(); }, []);
  useEffect(() => { trackView(pathname); }, [pathname]);
  return <>{children}</>;
}
