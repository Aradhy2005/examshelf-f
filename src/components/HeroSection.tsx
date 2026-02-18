"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full pt-24 md:pt-40 pb-24 px-6 overflow-hidden">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-14">

        {/* LEFT SIDE */}
        <div className="text-center md:text-left">

          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block px-4 py-1 mb-6 text-xs tracking-wider uppercase rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
          >
            Structured Preparation
          </motion.div>

          {/* ⭐ PREMIUM MINIMAL HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-white"
          >
            Smart Exam Preparation
            <span className="block mt-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Notes & PYQs for University Students
            </span>
          </motion.h1>

          {/* ⭐ MINIMAL SUPPORT TEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-base md:text-lg text-gray-400 max-w-md md:max-w-lg mx-auto md:mx-0 leading-relaxed"
          >
            Structured notes. Verified PYQs. Focused exam preparation.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10"
          >
            <Link
              href="/subjects"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 transition-all duration-300 hover:shadow-purple-600/50 hover:-translate-y-1"
            >
              Explore Subjects →
            </Link>
          </motion.div>

        </div>

        {/* RIGHT SIDE – Workflow Card */}
        <div className="hidden md:flex justify-center relative">

          {/* Glow */}
          <div className="absolute w-[560px] h-[460px] bg-purple-600/25 blur-[140px] rounded-full -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-[440px] rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-purple-600/30 p-10"
          >

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="text-white text-lg font-semibold tracking-tight">
                  Preparation Workflow
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Structured. Clear. Focused.
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Exam Ready
              </span>
            </div>

            {/* Steps */}
            <div className="relative">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-purple-500/40 to-transparent" />

              <div className="space-y-8">
                {[
                  "Select University",
                  "Choose Subject",
                  "Practice Verified PYQs",
                  "Ready for Exam"
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-6 group"
                  >
                    <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-purple-600/30">
                      {i + 1}
                    </div>

                    <div className="text-gray-300 text-sm tracking-wide group-hover:text-white transition-colors duration-300">
                      {step}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
