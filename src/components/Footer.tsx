"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-40 border-t border-white/10 bg-[#0b0f19]/70 backdrop-blur-xl overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center pointer-events-none">
        <div className="w-[280px] h-[200px] md:w-[600px] md:h-[300px] bg-purple-600/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-3 text-gray-400">

        {/* Brand */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4 tracking-tight">
            Exam<span className="text-purple-500">Shelf</span>
          </h3>

          {/* ⭐ SEO + TRUST TEXT */}
          <p className="text-sm leading-relaxed">
            ExamShelf provides structured university notes, solved previous year
            questions, and exam-focused study material designed to help college
            students prepare efficiently and perform better in exams.
          </p>

          {/* ⭐ TRUST MICRO TEXT */}
          <p className="text-xs text-gray-500 mt-4">
            Built for clarity • Focused on results • Designed for real exams
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-medium mb-4">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/subjects" className="hover:text-white transition-colors duration-200">
                Subjects
              </Link>
            </li>
            <li>
              <Link href="/library" className="hover:text-white transition-colors duration-200">
                My Library
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors duration-200">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors duration-200">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-medium mb-4">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-white transition-colors duration-200">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-black border-t border-white/5 py-6 text-center text-xs text-gray-400">
  © {new Date().getFullYear()} ExamShelf. All rights reserved.
</div>

    </footer>
  );
}
