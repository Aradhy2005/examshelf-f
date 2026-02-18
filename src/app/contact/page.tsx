"use client";

import { motion } from "framer-motion";
import { Mail, Briefcase, Clock } from "lucide-react";

export default function ContactPage() {
  const cards = [
    {
      icon: Mail,
      title: "Email Support",
      value: "examshelf.teams@gmail.com",
    },
    {
      icon: Briefcase,
      title: "Business Enquiries",
      value: "bajpaiaradhy@gmail.com",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
    },
  ];

  return (
    <main className="relative min-h-screen px-6 py-24 text-white overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto text-center">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Contact Us
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 mt-4 mb-14"
        >
          Questions, feedback, or partnership ideas — we’d love to hear from you.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl p-8 shadow-lg hover:border-purple-400/40 transition"
              >
                <Icon className="mx-auto mb-4 text-purple-400" size={28} />
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="mt-2 font-semibold">{card.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
