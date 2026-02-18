"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  const sections = [
    {
      title: "Usage",
      content:
        "Purchased content is for personal academic use only. Redistribution is prohibited.",
    },
    {
      title: "Payments",
      content:
        "All purchases are final. Access is granted instantly after payment verification.",
    },
    {
      title: "Account Responsibility",
      content:
        "Users are responsible for maintaining account confidentiality.",
    },
    {
      title: "Content Accuracy",
      content:
        "We strive for accuracy but do not guarantee exam outcomes.",
    },
    {
      title: "Modifications",
      content:
        "ExamShelf reserves the right to update these terms at any time.",
    },
  ];

  return (
    <main className="relative min-h-screen px-6 py-24 text-white overflow-hidden">

      {/* glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12"
        >
          Terms of Service
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
