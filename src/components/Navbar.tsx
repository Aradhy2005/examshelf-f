"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";


export default function Navbar() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`relative transition-all duration-300 ${
        pathname === href
          ? "text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
      {pathname === href && (
        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-purple-500 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#000000e1] backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
{/* Logo */}
<Link
  href="/"
  aria-label="ExamShelf Home"
  className="flex items-center -ml-"
>
  <img
    src="/logo.svg"
    alt="ExamShelf"
    className="h-16 w-auto object saturate-125 "
  />
</Link>





          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">

            {navLink("/", "Home")}
            {navLink("/subjects", "Subjects")}
            {navLink("/blog", "Blog")}

            {!loading && user && (
              <>
                {navLink("/library", "My Library")}
                {role === "admin" && navLink("/admin", "Admin")}

                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}

            {!loading && !user && (
              <Link
                href="/login"
                className="relative inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium
                           bg-purple-600 hover:bg-purple-500 text-white
                           transition-all duration-300
                           shadow-lg shadow-purple-600/20
                           hover:shadow-purple-600/40
                           hover:-translate-y-[1px]
                           active:translate-y-0"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-300 hover:text-white transition"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-[#0b0f19]/95 backdrop-blur-xl border-t border-white/5`}
      >
        <div className="px-6 py-6 flex flex-col gap-5 text-sm font-medium">

          {navLink("/", "Home")}
          {navLink("/subjects", "Subjects")}
          {navLink("/blog", "Blog")}

          {!loading && user && (
            <>
              {navLink("/library", "My Library")}
              {role === "admin" && navLink("/admin", "Admin")}

              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="text-left text-gray-400 hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          )}

          {!loading && !user && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg text-center
                         transition-all duration-300 shadow-lg shadow-purple-600/20"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
