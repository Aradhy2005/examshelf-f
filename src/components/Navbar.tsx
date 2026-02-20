"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  Menu, X, LogOut, LayoutDashboard, 
  Library, Sparkles, Command, ChevronRight 
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
        className={`relative transition-all duration-500 rounded-full flex items-center ${
          mobile 
            ? "w-full justify-between py-4 px-6 text-[12px] font-bold tracking-[0.15em] uppercase border-b border-white/5" 
            : "px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
        } ${isActive ? "text-white" : "text-slate-500 hover:text-white"}`}
      >
        <span>{label}</span>
        {isActive && !mobile && (
          <div className="absolute inset-0 bg-white/[0.08] border border-white/10 rounded-full -z-10 shadow-inner" />
        )}
        {mobile && <ChevronRight size={14} className={isActive ? "text-purple-500" : "text-slate-700"} />}
      </Link>
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ease-out ${
        scrolled 
          ? "bg-black/40 backdrop-blur-3xl py-3 border-b border-white/5" 
          : "bg-transparent py-8 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="relative group flex items-center">
          <img 
            src="/logo.svg" 
            alt="ExamShelf" 
            className="h-9 w-9 relative z-10 transition-transform duration-500 group-hover:scale-110" 
          />
        </Link>

        {/* Desktop Central Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-full px-1.5 py-1.5">
          <NavItem href="/" label="Index" />
          <NavItem href="/subjects" label="Subjects" />
          <NavItem href="/blog" label="Blog" />
          {!loading && user && <NavItem href="/library" label="My Library" />}
        </div>

        {/* Desktop User System */}
        <div className="hidden md:flex items-center gap-8">
          {!loading && user ? (
            <div className="flex items-center gap-6">
              {role === "admin" && (
                <Link href="/admin" className="text-slate-500 hover:text-purple-400 transition-all">
                  <Command size={18} />
                </Link>
              )}
              <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-red-400 transition-all">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            !loading && (
              <Link
                href="/login"
                className="group px-7 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:bg-purple-600 hover:text-white"
              >
                Get Started
              </Link>
            )
          )}
        </div>

        {/* Mobile Controller */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative h-10 w-10 flex items-center justify-center border border-white/10 rounded-xl bg-white/5 text-white"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 📱 Professional Mobile Dropdown (75% Height) */}
      <div
        className={`fixed top-0 left-0 w-full h-[75vh] z-[90] bg-[#02040a]/95 backdrop-blur-3xl border-b border-white/10 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
          open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-10">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 px-6">Navigation</p>
            <NavItem href="/" label="Dashboard" mobile />
            <NavItem href="/subjects" label="Subjects" mobile />
            <NavItem href="/blog" label="Blog" mobile />
            {user && <NavItem href="/library" label="My Library" mobile />}
            {role === "admin" && <NavItem href="/admin" label="Console" mobile />}
          </div>
          
          <div className="mt-auto flex flex-col gap-4">
             {user ? (
              <button 
                onClick={handleLogout} 
                className="w-full py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <LogOut size={14} /> Logout
              </button>
             ) : (
              <Link 
                href="/login" 
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-center text-[11px] uppercase tracking-[0.25em]"
              >
                Get Started
              </Link>
             )}
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {open && (
        <div 
          onClick={() => setOpen(false)} 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] md:hidden" 
        />
      )}
    </nav>
  );
}