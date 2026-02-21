"use client";

import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Lock, CheckCircle } from "lucide-react";

type Subject = {
  name: string;
  university: string;
  course: string;
  semester?: number | null;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  published: boolean;
};

type Unit = {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  price: number;
  previewSlug?: string;
};

// 1. Move all logic into this internal component
function SubjectDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [subjectUnlocked, setSubjectUnlocked] = useState(false);
  const [unlockedUnits, setUnlockedUnits] = useState<string[]>([]);
  const [remainingAmount, setRemainingAmount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [allUnitsUploaded, setAllUnitsUploaded] = useState(false);

  /* FETCH SUBJECT */
  useEffect(() => {
    const fetchSubject = async () => {
      const ref = doc(db, "subjects", id);
      const snap = await getDoc(ref);

      if (!snap.exists() || !snap.data().published) {
        router.replace("/subjects");
        return;
      }

      setSubject(snap.data() as Subject);
    };

    fetchSubject();
  }, [id, router]);

  /* FETCH UNITS */
  useEffect(() => {
    const fetchUnits = async () => {
      const q = query(
        collection(db, "units"),
        where("subjectId", "==", id),
        where("published", "==", true)
      );

      const snap = await getDocs(q);
      const list: Unit[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Unit, "id">),
      }));

      const sorted = list.sort((a, b) => a.unitNumber - b.unitNumber);
      setUnits(sorted);
      setAllUnitsUploaded(sorted.length >= 5);
    };

    fetchUnits();
  }, [id]);

  /* CHECK UNLOCKS */
  useEffect(() => {
    const checkUnlocks = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSubjectUnlocked(
          (snap.data().unlockedSubjects || []).includes(id)
        );
        setUnlockedUnits(snap.data().unlockedUnits || []);
      }
    };

    if (user) checkUnlocks();
  }, [user, id]);

  /* CALCULATE REMAINING PRICE */
  useEffect(() => {
    if (!subject) return;

    const purchasedUnits = units.filter((u) =>
      unlockedUnits.includes(u.id)
    );

    const purchasedAmount = purchasedUnits.reduce(
      (t, u) => t + (u.price || 0),
      0
    );

    setRemainingAmount(Math.max(subject.price - purchasedAmount, 0));
  }, [units, unlockedUnits, subject]);

  const handleSubjectPayment = async () => {
  if (!user) {
    router.push(`/login?redirect=/subjects/${id}`);
    return;
  }

  if (!subject || remainingAmount === null || processing) return;

  try {
    setProcessing(true);

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        type: "subject",
        subjectId: id,
      }),
    });

    const order = await res.json();

    if (!order?.id) {
      alert("Unable to start payment. Try again.");
      setProcessing(false);
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Payment service failed to load. Please refresh.");
      setProcessing(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;

    const rzp = new Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ExamShelf",
      description: subject.name,
      order_id: order.id,

      handler: async (response: any) => {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            userId: user.uid,
            type: "subject",
            subjectId: id,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          setSubjectUnlocked(true);
          setUnlockedUnits(units.map((u) => u.id));
          setPaymentSuccess(true);
        }

        setProcessing(false);
      },

      theme: { color: "#7c3aed" },
    });

    rzp.on("payment.failed", () => {
      alert("Payment failed. Please try again.");
      setProcessing(false);
    });

    rzp.open();
  } catch (err) {
    console.error(err);
    setProcessing(false);
  }
};

const handleUnitPayment = async (unit: Unit) => {
  if (!user) {
    router.push(`/login?redirect=/subjects/${id}`);
    return;
  }

  if (processing) return;

  try {
    setProcessing(true);

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.uid,
        type: "unit",
        subjectId: id,
        unitId: unit.id,
      }),
    });

    const order = await res.json();

    if (!order?.id) {
      alert("Unable to start payment.");
      setProcessing(false);
      return;
    }

    if (!(window as any).Razorpay) {
      alert("Payment service failed to load.");
      setProcessing(false);
      return;
    }

    const Razorpay = (window as any).Razorpay;

    const rzp = new Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "ExamShelf",
      description: unit.title,
      order_id: order.id,

      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              userId: user.uid,
              type: "unit",
              subjectId: id,
              unitId: unit.id,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setUnlockedUnits((prev) => [...prev, unit.id]);
            setPaymentSuccess(true);
          }
        } catch (err) {
          console.error("Verification failed:", err);
        }

        setProcessing(false);
      },

      theme: { color: "#7c3aed" },
    });

    rzp.on("payment.failed", () => {
      alert("Payment failed. Please try again.");
      setProcessing(false);
    });

    rzp.open();
  } catch (err) {
    console.error(err);
    setProcessing(false);
  }
};

  if (!subject || loading) {
    return <p className="p-10 text-white">Loading...</p>;
  }

  return (
    <main className="relative min-h-screen px-6 py-24 text-white overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[900px] h-[600px] bg-purple-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        {paymentSuccess && (
          <div className="mb-10 rounded-xl border border-green-500/40 bg-green-500/10 p-4 text-green-400 text-sm flex items-center gap-2">
            <CheckCircle size={18} /> Payment successful! Content unlocked.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-14">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              {subject.name}
            </h1>

            <p className="text-gray-400 mt-3">
              {subject.university.toUpperCase()} • {subject.course.toUpperCase()}
            </p>

            {/* Progress */}
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Your Progress</span>
                <span>
                  {subjectUnlocked
                    ? "Full Access"
                    : `${unlockedUnits.length}/${units.length} Units`}
                </span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
                  style={{
                    width: subjectUnlocked
                      ? "100%"
                      : `${(unlockedUnits.length / (units.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Units */}
            <h2 className="text-2xl font-semibold mt-14 mb-8">Units</h2>

            <div className="space-y-6">
              {units.map((u) => {
                const unlocked =
                  subjectUnlocked || unlockedUnits.includes(u.id);

                return (
                  <div
                    key={u.id}
                    className="rounded-2xl bg-[#0f172a] border border-white/10 p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-600/20 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-400">
                          Unit {u.unitNumber}
                        </p>
                        <h3 className="text-lg font-semibold mt-1">
                          {u.title}
                        </h3>
                      </div>

                      {unlocked ? (
                        <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                          <CheckCircle size={16} />
                          Unlocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                          <Lock size={16} /> ₹{u.price}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex gap-3">
                      {unlocked ? (
                        <button
                          onClick={() => router.push(`/units/${u.id}`)}
                          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold hover:scale-[1.02] transition"
                        >
                          View PDF
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleUnitPayment(u)}
                            className="flex-1 py-3 rounded-xl border border-red-500/40 text-red-400 font-semibold hover:bg-red-500/10"
                          >
                            Buy Unit – ₹{u.price}
                          </button>

                          {u.previewSlug && (
                            <a
                              href={`/blog/${u.previewSlug}`}
                              className="flex-1 text-center py-3 rounded-xl border border-white/15 text-gray-200 font-semibold hover:bg-white/5 transition"
                            >
                              Preview
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PURCHASE CARD */}
          {!subjectUnlocked && remainingAmount !== 0 && (
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/30 p-10 shadow-2xl">
                <p className="text-sm text-gray-400 line-through">
                  ₹{subject.originalPrice ?? subject.salePrice ?? subject.price}
                </p>

                <p className="text-5xl font-bold text-red-400 mt-2">
                  ₹{remainingAmount}
                </p>

                <div className="mt-4 text-xs inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  Most students unlock full access
                </div>

                <button
                  onClick={handleSubjectPayment}
                  disabled={!allUnitsUploaded || processing}
                  className={`mt-8 w-full py-4 rounded-xl font-bold text-lg shadow-xl transition
    ${
      allUnitsUploaded
        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:scale-[1.03]"
        : "bg-gray-700 cursor-not-allowed opacity-60"
    }`}
                >
                  {processing
                    ? "Processing..."
                    : allUnitsUploaded
                    ? "Unlock Full Subject"
                    : "Available when all units are uploaded"}
                </button>

                {!allUnitsUploaded && (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Full subject access unlocks after all units are uploaded.
                  </p>
                )}

                <ul className="mt-8 space-y-2 text-sm text-gray-400">
                  <li>✔ Lifetime access</li>
                  <li>✔ Verified exam content</li>
                  <li>✔ All units unlocked</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// 2. Main Page Wrapper with Suspense to prevent build error
export default function SubjectDetailPage() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <SubjectDetailContent />
    </Suspense>
  );
}

// 3. Force dynamic rendering
export const dynamic = "force-dynamic";