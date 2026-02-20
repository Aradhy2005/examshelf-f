import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return NextResponse.json({ error: "Missing slug" });

  await deleteDoc(doc(db, "blogs", slug));

  return NextResponse.json({ success: true });
}