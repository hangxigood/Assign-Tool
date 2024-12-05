/*a server-side middleware to protect API routes and pages*/
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasPermission } from "@/lib/permission";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (
    pathname.startsWith('/auth') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Protected API routes pattern
  if (pathname.startsWith('/api/')) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check specific permissions for API routes
    if (pathname.startsWith('/api/workorders')) {
      if (request.method === "POST" && !hasPermission(token.role as string, "create-work-orders")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (request.method === "PUT" && !hasPermission(token.role as string, "edit-work-orders")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  // Protected pages - redirect to login if not authenticated
  if (!token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};