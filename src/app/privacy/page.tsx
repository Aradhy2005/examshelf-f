"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect your email address, purchase history, and usage data to provide and improve our services.",
    },
    {
      title: "How We Use Information",
      content:
        "We use your data to provide access to purchased content, improve performance, and send essential updates.",
    },
    {
      title: "Payment Security",
      content:
        "All payments are securely processed via Razorpay. We never store card details.",
    },
    {
      title: "Data Protection",
      content:
        "We implement industry-standard security practices to safeguard your information.",
    },
    {
      title: "Contact",
      content: "For privacy concerns, contact examshelf.teams@gmail.com",
    },
  ];

  return (
    <main className="relative min-h-screen px-6 py-24 text-white overflow-hidden">

      {/* glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12"
        >
          Privacy Policy
        </motion.h1>

        <div className="space-y-8">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
            >
              <h2 className="text-lg font-semibold text-purple-300">
                {sec.title}
              </h2>
              <p className="text-gray-300 mt-2 leading-relaxed">
                {sec.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
