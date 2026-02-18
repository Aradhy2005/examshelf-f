"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { number: "50+", label: "Structured Units" },
    { number: "200+", label: "Verified PYQs" },
    { number: "10+", label: "Subjects Covered" },
    { number: "500+", label: "Students Preparing" },
  ];

  return (
    <section className="w-full mt-40 px-6 relative">

      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center -z-10">
        <div className="w-[700px] h-[400px] bg-purple-600/15 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto text-center">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold tracking-tight text-white"
        >
          Built for Serious Preparation
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed"
        >
          Everything organized to help you prepare smarter, not harder.
        </motion.p>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 px-6 py-10 text-center transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-600/20"
            >
              {/* Subtle Inner Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">

                <div className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {item.number}
                </div>

                <div className="mt-3 text-sm text-gray-300 tracking-wide">
                  {item.label}
                </div>

              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
