"use client";

import { motion } from "framer-motion";

export default function RequestSubjectPage() {
  return (
    <main className="min-h-screen px-6 py-24 text-white relative overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">
            Can’t find your subject?
          </h1>

          <p className="text-gray-400 mb-8">
            Tell us your university & subject.  
            We’ll add it soon for you.
          </p>

          {/* ✅ FORM */}
          <form
            action="https://formsubmit.co/examshelf.teams@gmail.com"
            method="POST"
            className="space-y-5"
          >
            {/* prevent spam */}
            <input type="hidden" name="_captcha" value="false" />

            {/* email subject */}
            <input
              type="hidden"
              name="_subject"
              value="New Subject Request — ExamShelf"
            />

            {/* redirect after submit */}
            <input
              type="hidden"
              name="_next"
              value="https://examshelf.in/"
            />

            <Input name="name" placeholder="Your Name" required />
            <Input name="email" placeholder="Your Email" type="email" required />
            <Input name="university" placeholder="University Name" required />
            <Input name="course" placeholder="Course (B.Tech, BCA…)" required />
            <Input name="year" placeholder="Year / Semester" required />
            <Input name="subject" placeholder="Subject Name" required />

            <textarea
              name="message"
              placeholder="Anything else you want us to know?"
              className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-lg shadow-lg hover:scale-[1.02] transition"
            >
              Submit Request 🚀
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

function Input({ name, placeholder, type = "text", required = false }: any) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  );
}
