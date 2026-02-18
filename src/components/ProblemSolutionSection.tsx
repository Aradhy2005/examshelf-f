"use client";

import { motion } from "framer-motion";

export default function ProblemSolutionSection() {
  return (
    <section className="w-full mt-40 px-6 relative">

      <div className="max-w-6xl mx-auto">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-center text-white"
        >
          Preparation, Simplified.
        </motion.h2>

        <div className="mt-16 grid md:grid-cols-2 gap-12">

          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-red-500/5 border border-red-500/20 p-8"
          >
            <h3 className="text-red-300 font-semibold text-lg mb-6">
              The Old Way
            </h3>

            <ul className="space-y-4 text-gray-400 text-sm">
              <li>• Random PDF collections</li>
              <li>• Unorganized Telegram files</li>
              <li>• No unit structure</li>
              <li>• Guessing important questions</li>
              <li>• Wasting time searching</li>
            </ul>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-purple-500/5 border border-purple-500/20 p-8"
          >
            <h3 className="text-purple-300 font-semibold text-lg mb-6">
              The ExamShelf Way
            </h3>

            <ul className="space-y-4 text-gray-300 text-sm">
              <li>• Unit-wise structured content</li>
              <li>• Verified important PYQs</li>
              <li>• Clean, distraction-free layout</li>
              <li>• Focused exam preparation</li>
              <li>• Everything in one place</li>
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
