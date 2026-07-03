import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_VALUE, DROP_PASSWORD } from "@/lib/access";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = String(body?.password ?? "");
  } catch {
    // no body — falls through to 401
  }

  if (!DROP_PASSWORD || password.trim().toLowerCase() !== DROP_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const store = await cookies();
  store.set(ACCESS_COOKIE, ACCESS_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60, // 60 days — covers the runway to the drop
  });
  return NextResponse.json({ ok: true });
}

// temp: re-lock for testing the teaser
export async function DELETE() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  return NextResponse.json({ ok: true });
}
