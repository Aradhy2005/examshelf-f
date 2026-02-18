import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { adminDb, adminFieldValue } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      type,
      subjectId,
      unitId,
    } = body;

    // =========================
    // 🔐 VERIFY SIGNATURE
    // =========================
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false });
    }

    // =========================
    // 🔎 FETCH ORDER FROM RAZORPAY
    // =========================
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const paidAmount = Number(order.amount) / 100;

    let expectedAmount = 0;

    // =========================
    // 🔥 UNIT VALIDATION
    // =========================
    if (type === "unit") {
      const unitSnap = await adminDb
        .collection("units")
        .doc(unitId)
        .get();

      if (!unitSnap.exists) {
        return NextResponse.json({ success: false });
      }

      const unitData = unitSnap.data();
      expectedAmount = unitData?.price || 0;
    }

    // =========================
    // 🔥 SUBJECT VALIDATION
    // =========================
    if (type === "subject") {
      const subjectSnap = await adminDb
        .collection("subjects")
        .doc(subjectId)
        .get();

      if (!subjectSnap.exists) {
        return NextResponse.json({ success: false });
      }

      const subjectPrice = subjectSnap.data()?.price || 0;

      const unitsSnap = await adminDb
        .collection("units")
        .where("subjectId", "==", subjectId)
        .get();

      const allUnits = unitsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const userSnap = await adminDb
        .collection("users")
        .doc(userId)
        .get();

      const unlockedUnits = userSnap.data()?.unlockedUnits || [];

      const purchasedUnits = allUnits.filter((u: any) =>
        unlockedUnits.includes(u.id)
      );

      const purchasedAmount = purchasedUnits.reduce(
        (total: number, u: any) => total + (u.price || 0),
        0
      );

      expectedAmount = Math.max(subjectPrice - purchasedAmount, 0);
    }

    // =========================
    // 🔴 SECURITY CHECK
    // =========================
    if (paidAmount !== expectedAmount) {
      return NextResponse.json({ success: false });
    }

    // =========================
    // 💾 SAVE PAYMENT RECORD
    // =========================
    await adminDb
      .collection("payments")
      .doc(razorpay_payment_id)
      .set({
        userId,
        type,
        subjectId: subjectId || null,
        unitId: unitId || null,
        amount: expectedAmount,
        createdAt: new Date(),
      });

    // =========================
    // 🔓 UNLOCK CONTENT (FIXED)
    // =========================
    const userRef = adminDb.collection("users").doc(userId);

    console.log("Unlocking:", type, unitId, subjectId);

    if (type === "unit") {
      await userRef.set(
        {
          unlockedUnits: adminFieldValue.arrayUnion(unitId),
        },
        { merge: true }
      );
    }

    if (type === "subject") {
      await userRef.set(
        {
          unlockedSubjects: adminFieldValue.arrayUnion(subjectId),
        },
        { merge: true }
      );
    }

    return NextResponse.json({
      success: true,
      unlockedUnit: unitId || null,
      unlockedSubject: subjectId || null,
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
