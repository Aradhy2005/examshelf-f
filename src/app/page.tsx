import UniversitySelector from "@/components/UniversitySelector";
import HeroSection from "@/components/HeroSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import StatsSection from "@/components/StatsSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import LatestBlogs from "@/components/LatestBlogs";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">

      <HeroSection />

      <section className="max-w-3xl mx-auto text-center mt-20 px-4">

  <h2 className="text-3xl md:text-4xl font-semibold text-white leading-snug tracking-tight">
    University Notes & PYQs
    <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
      Smart Exam Preparation for College Students
    </span>
  </h2>

  <p className="mt-6 text-gray-300 text-base md:text-lg leading-relaxed">
    ExamShelf provides <span className="text-white font-medium">structured semester notes</span>,
    <span className="text-white font-medium"> solved previous year questions</span>, and
    exam-focused study material to help students prepare smarter and perform better in
    university examinations.
  </p>

  <p className="mt-5 text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
    Whether preparing for internal assessments, semester exams, or last-minute revision,
    get clear concepts, important questions, and structured resources in one place.
  </p>

</section>



      <section className="w-full mt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <UniversitySelector />
        </div>
      </section>

      <WhyChooseSection />
      <StatsSection />
      <ProblemSolutionSection />
      <TestimonialsSection />
      

      <section className="w-full mt-40 mb-32 px-6 relative">

  {/* Subtle Glow */}
  <div className="absolute inset-0 flex justify-center -z-10">
    <div className="w-[700px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full" />
  </div>

  <div className="max-w-4xl mx-auto text-center">

    <div className="rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 p-12 shadow-xl shadow-purple-600/10">

      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8 
                     bg-gradient-to-r from-white to-purple-300 
                     bg-clip-text text-transparent">
        About ExamShelf
      </h2>

      <p className="text-gray-300 leading-relaxed text-base md:text-lg max-w-3xl mx-auto">
        ExamShelf was built to remove confusion from exam preparation.
        Instead of endless searching and scattered resources, everything is
        structured, unit-wise, and focused on what actually matters in exams.
      </p>

      <p className="text-gray-400 leading-relaxed text-sm md:text-base mt-6 max-w-2xl mx-auto">
        No clutter. No distractions. Just clarity, structure, and verified content —
        designed to help you prepare smarter and finish stronger.
      </p>

    </div>

  </div>
</section>


    </main>
  );
}
