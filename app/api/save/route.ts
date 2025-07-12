import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase"; // make sure supabase client works
import { connectMongo } from "../../lib/mongodb"; // make sure MongoDB works
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({ fullText: String });
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export async function POST(req: NextRequest) {
  const { summary, fullText } = await req.json();
  try {
    const { error } = await supabase.from("summaries").insert([{ summary }]);
    if (error) throw error;

    await connectMongo();
    const blog = new Blog({ fullText });
    await blog.save();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Save failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
