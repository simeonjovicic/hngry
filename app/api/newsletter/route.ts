import { NextResponse } from "next/server";

// TODO before launch: wire this to a real list (Resend, Mailchimp, Cloudflare
// KV, ...). Right now it only validates and acknowledges — nothing is stored.
export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim();
  } catch {
    // no body — falls through to 400
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.log("newsletter signup:", email);
  return NextResponse.json({ ok: true });
}
