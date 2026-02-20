"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Menu, X, LogOut, LayoutDashboard, 
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    router.push("/");
  };

  const NavItem = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative transition-all duration-300 rounded-full flex items-center ${
          mobile 
            ? "w-full justify-between py-5 px-8 text-[11px] font-bold tracking-[0.2em] uppercase border-b border-white/5" 
            : "px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em]"
        } ${isActive ? "text-white" : "text-slate-500 hover:text-white"}`}
      >
        <span>{label}</span>
        {isActive && !mobile && (
          <div className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-full -z-10 shadow-sm" />
        )}
        {mobile && <ChevronRight size={14} className={isActive ? "text-purple-500" : "text-slate-800"} />}
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-black/60 backdrop-blur-2xl py-3 border-b border-white/5" 
          : "bg-transparent py-7 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-12 flex items-center justify-between">
        
        {/* BRAND: BALANCED PROFESSIONAL LOGO */}
<Link href="/" className="relative group flex items-center justify-center">
  {/* Soft ambient glow that expands on hover */}
  <div className="absolute -inset-8 bg-purple-600/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out" />
  
  {/* Increased size from h-12 to h-14 (Desktop) and h-12 (Mobile).
      Using a rounded-2xl glass container to anchor the brand.
  */}
  <div className="relative h-14 w-14 md:h-16 md:w-16 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/20 group-hover:scale-105">
    
    {/* Internal light reflection for a 'glass' look */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 rounded-2xl pointer-events-none" />
    
    <img 
      src="/logo.svg" 
      alt="ExamShelf" 
      className="h-full w-full object-contain relative z-10 transition-transform duration-500 group-hover:rotate-[-3deg] drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]" 
    />
  </div>
</Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-full px-2 py-1.5 shadow-xl">
          <NavItem href="/" label="Home" />
          <NavItem href="/subjects" label="Subjects" />
          <NavItem href="/blog" label="Blog" />
          {!loading && user && <NavItem href="/library" label="My Library" />}
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-6">
          {!loading && user ? (
            <div className="flex items-center gap-5">
              {role === "admin" && (
                <Link href="/admin" className="text-slate-500 hover:text-purple-400 transition-colors">
                  <LayoutDashboard size={18} />
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 transition-all"
              >
                Logout <LogOut size={15} />
              </button>
            </div>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="px-7 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest transition-all hover:bg-purple-600 hover:text-white"
              >
                Get Started
              </Link>
            )
          )}
        </div>

        {/* MOBILE TRIGGER */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden h-11 w-11 flex items-center justify-center border border-white/10 rounded-xl bg-white/5 text-white active:scale-95 transition-transform"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE NAV: 75% HEIGHT ISLAND */}
      <div
        className={`fixed top-0 left-0 w-full h-[75vh] z-[90] bg-[#050505]/95 backdrop-blur-3xl border-b border-white/10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
          open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full pt-28 px-8 pb-10">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 px-8">System Menu</p>
            <NavItem href="/" label="Home" mobile />
            <NavItem href="/subjects" label="Subjects" mobile />
            <NavItem href="/blog" label="Blog" mobile />
            {user && <NavItem href="/library" label="My Library" mobile />}
            {role === "admin" && <NavItem href="/admin" label="Admin Console" mobile />}
          </div>
          
          <div className="mt-auto px-4">
             {user ? (
              <button 
                onClick={handleLogout} 
                className="w-full py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Logout
              </button>
             ) : (
              <Link 
                href="/login" 
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-center text-[10px] uppercase tracking-widest"
              >
                Get Started
              </Link>
             )}
          </div>
        </div>
      </div>

      {/* CLICK OUTSIDE TO CLOSE */}
      {open && (
        <div 
          onClick={() => setOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80] md:hidden" 
        />
      )}
    </nav>
  );
}