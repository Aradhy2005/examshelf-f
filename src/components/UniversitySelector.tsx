"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UniversitySelector() {
  const router = useRouter();

  const [university, setUniversity] = useState("aktu");
  const [course, setCourse] = useState("btech");
  const [year, setYear] = useState("1");

  const handleExplore = () => {
    router.push(`/subjects?university=${university}&course=${course}&year=${year}`);
  };

  return (
    <div className="max-w-xl mx-auto relative">
      

      <motion.div
        initial={false}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-purple-900/20 transition-all duration-300 hover:shadow-purple-900/30"
      >

        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">Select Your Path</h2>
          <p className="text-gray-400 mt-2 text-sm">Choose your university and academic year to begin</p>
        </div>

        <div className="space-y-7">

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">University</label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full bg-[#0f172a]/70 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500 transition-all duration-200 hover:border-white/20"
            >
              <option value="aktu">AKTU</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Course</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full bg-[#0f172a]/70 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500 transition-all duration-200 hover:border-white/20"
            >
              <option value="btech">BTech</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#0f172a]/70 border border-white/10 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500 transition-all duration-200 hover:border-white/20"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

        </div>

        <div className="mt-12 text-center">
          <motion.button
  initial={false}
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  onClick={handleExplore}
  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/25 transition-all duration-300 hover:shadow-purple-600/40"
>
  Start Exploring
  <span className="text-base">→</span>
</motion.button>


        </div>

      </motion.div>
    </div>
  );
}
