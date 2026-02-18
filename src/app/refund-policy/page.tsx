export const metadata = {
  title: "Refund Policy | ExamShelf",
  description:
    "Refund policy for purchases made on ExamShelf. Learn about eligibility, conditions, and refund requests.",
};

export default function RefundPolicy() {
  return (
    <main className="min-h-screen px-6 py-24 text-white max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-semibold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
          Refund Policy
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          We aim to provide high-quality exam preparation content.
          Please review our refund policy before making a purchase.
        </p>
      </div>

      {/* IMPORTANT NOTICE */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 mb-12">
        <p className="text-purple-200 text-sm leading-relaxed">
          All products on ExamShelf are digital study materials.
          Once access is granted, refunds are generally not applicable
          except under specific conditions listed below.
        </p>
      </div>

      {/* SECTION */}
      <PolicySection
        title="Refund Eligibility"
        content="Refund requests may be considered under the following conditions:"
        list={[
          "Duplicate payment made by mistake.",
          "Technical issues preventing access to purchased content.",
          "Incorrect charge due to system error.",
        ]}
      />

      <PolicySection
        title="Non-Refundable Cases"
        list={[
          "Change of mind after purchase.",
          "Failure to review product details before purchase.",
          "Completion of download or access to full content.",
        ]}
      />

      <PolicySection
        title="Refund Request Process"
        content="To request a refund, contact us within 48 hours of purchase with your payment details and issue description."
      />

      {/* CONTACT */}
      <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
        <h2 className="text-xl font-semibold mb-3">Contact Support</h2>
        <p className="text-gray-400">
          Email:
          <span className="text-white ml-2">examshelf.teams@gmail.com</span>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-16 text-center">
        ExamShelf reserves the right to update this policy at any time.
      </p>
    </main>
  );
}

/* Reusable Section Component */
function PolicySection({
  title,
  content,
  list,
}: {
  title: string;
  content?: string;
  list?: string[];
}) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>

      {content && (
        <p className="text-gray-400 leading-relaxed mb-3">{content}</p>
      )}

      {list && (
        <ul className="space-y-2 text-gray-400 list-disc pl-5">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
