export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">
          Premium Access
        </h1>

        <p className="text-gray-400 mb-10">
          View content inside ExamShelf. No downloads. No sharing.
        </p>

        <div className="border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-4">
            OOPS with Java – Full Access
          </h2>
          <p className="text-3xl font-bold mb-6">₹299</p>

          <button className="bg-white text-black px-8 py-3 rounded-lg font-medium">
            Unlock Now
          </button>
        </div>
      </div>

      
    </main>
  );
}
