"use client";

import { motion } from "framer-motion";

export default function WhyChooseSection() {
  return (
    <section className="w-full mt-40 px-6 relative">

      <div className="max-w-6xl mx-auto text-center">

        {/* ⭐ SECTION HEADING */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent"
        >
          Why Students Choose ExamShelf
        </motion.h2>

        {/* ⭐ SEO + CLARITY SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 max-w-2xl mx-auto leading-relaxed text-base md:text-lg"
        >
          Designed for university exam preparation — providing structured notes,
          solved previous year questions, and focused study material that helps
          you prepare efficiently and score better.
        </motion.p>

        {/* ⭐ BENEFIT CARDS */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">

          {[
            {
              title: "Structured Learning",
              desc: "Unit-wise organization that helps you follow a clear study path and complete the syllabus efficiently."
            },
            {
              title: "Verified Previous Year Questions",
              desc: "Carefully selected PYQs that frequently appear in exams, helping you focus on what truly matters."
            },
            {
              title: "Distraction-Free Study",
              desc: "Clean, focused content without clutter — making revision faster and exam preparation more effective."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/10 p-8 shadow-lg shadow-purple-600/10 hover:border-purple-500/40 hover:shadow-purple-600/25 transition-all duration-300"
            >
              <h3 className="text-white font-semibold text-lg mb-4 tracking-tight">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
