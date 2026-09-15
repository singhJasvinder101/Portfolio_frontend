import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db";

export async function GET() {
  try {
    await connectDb();
  } catch {
    // reported via readyState below
  }
  return NextResponse.json({
    ok: true,
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
}
