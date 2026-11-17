"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ShoppingBag, Waves } from "lucide-react";
export default function Header({ cartCount }: { cartCount?: number }) {
 const path = usePathname();
 return <header className="site-header"><div className="container nav"><Link href="/" className="brand"><span className="brand-logo"><Waves size={22}/></span> SIGNAL<span>STORE</span></Link><nav><Link className={path==="/"?"active":""} href="/"><ShoppingBag size={16}/> Store</Link><Link className={path==="/dashboard"?"active":""} href="/dashboard"><Activity size={16}/> Event monitor</Link></nav>{cartCount !== undefined && <span className="cart-count">Bag <b>{cartCount}</b></span>}</div></header>;
}
