"use client";

import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Finally something structured. I stopped wasting time searching random PDFs.",
      name: "2nd Year BTech Student"
    },
    {
      text: "The unit-wise format makes revision so much easier before exams.",
      name: "AKTU Student"
    },
    {
      text: "PYQs are actually relevant. This saves so much time during preparation.",
      name: "Engineering Student"
    }
  ];

  return (
    <section className="w-full mt-40 px-6 relative">

      {/* Background Glow */}
      <div className="absolute inset-0 flex justify-center -z-10">
        <div className="w-[700px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          What Students Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-400 mt-4 max-w-2xl mx-auto"
        >
          Real feedback from students preparing smarter with ExamShelf.
        </motion.p>

        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">

          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="relative rounded-3xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-8 shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-600/20"
            >
              <div className="text-gray-300 text-sm leading-relaxed">
                “{item.text}”
              </div>

              <div className="mt-6 text-xs text-indigo-300 tracking-wide">
                — {item.name}
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
