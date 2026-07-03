import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_VALUE } from "@/lib/access";

// Until drop day the whole shop is gated: without the access cookie every
// route collapses to the teaser at "/".
// Note: middleware.ts (edge) instead of Next 16's proxy.ts (node) because
// the OpenNext Cloudflare adapter doesn't support node middleware yet.
export default function middleware(request: NextRequest) {
  const unlocked =
    request.cookies.get(ACCESS_COOKIE)?.value === ACCESS_VALUE;
  if (!unlocked && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // gate all pages; skip the unlock api, next internals and any static file
  // (anything with a dot: .png, .mp3, .ico, ...)
  matcher: ["/((?!api/unlock|_next/static|_next/image|.*\\..*).*)"],
};
