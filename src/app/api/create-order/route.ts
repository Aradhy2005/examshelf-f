import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, subjectId, unitId } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 🔹 Fetch user
    const userSnap = await adminDb.collection("users").doc(userId).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userSnap.data();
    const unlockedSubjects = userData?.unlockedSubjects || [];
    const unlockedUnits = userData?.unlockedUnits || [];

    let finalAmount = 0;

    // ============================
    // SUBJECT PURCHASE
    // ============================
    if (type === "subject") {
      if (!subjectId) {
        return NextResponse.json({ error: "Subject ID missing" }, { status: 400 });
      }

      // Already unlocked
      if (unlockedSubjects.includes(subjectId)) {
        return NextResponse.json({ error: "Subject already purchased" }, { status: 400 });
      }

      const subjectSnap = await adminDb.collection("subjects").doc(subjectId).get();
      if (!subjectSnap.exists) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
      }

      const subject = subjectSnap.data();
      const subjectPrice = subject?.price || 0;

      // Calculate upgrade price
      const unitsSnap = await adminDb
        .collection("units")
        .where("subjectId", "==", subjectId)
        .get();

      let purchasedUnitTotal = 0;

      unitsSnap.forEach((doc) => {
        const unit = doc.data();
        if (unlockedUnits.includes(doc.id)) {
          purchasedUnitTotal += unit.price || 0;
        }
      });

      finalAmount = Math.max(subjectPrice - purchasedUnitTotal, 0);

      if (finalAmount <= 0) {
        return NextResponse.json({ error: "Nothing to pay" }, { status: 400 });
      }
    }

    // ============================
    // UNIT PURCHASE
    // ============================
    if (type === "unit") {
      if (!unitId) {
        return NextResponse.json({ error: "Unit ID missing" }, { status: 400 });
      }

      if (unlockedUnits.includes(unitId)) {
        return NextResponse.json({ error: "Unit already purchased" }, { status: 400 });
      }

      const unitSnap = await adminDb.collection("units").doc(unitId).get();
      if (!unitSnap.exists) {
        return NextResponse.json({ error: "Unit not found" }, { status: 404 });
      }

      finalAmount = unitSnap.data()?.price || 0;
    }

    if (finalAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    return NextResponse.json(order);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}
