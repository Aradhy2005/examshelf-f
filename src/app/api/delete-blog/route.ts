import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug" },
        { status: 400 }
      );
    }

    const blogRef = adminDb.collection("blogs").doc(slug);
    const snap = await blogRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    await blogRef.delete();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}