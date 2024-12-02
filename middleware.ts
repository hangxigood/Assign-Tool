/*a server-side middleware to protect API routes*/
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { hasPermission } from "@/lib/permission";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Protected API routes pattern
  if (request.nextUrl.pathname.startsWith('/api/workorders')) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check specific permissions based on HTTP method
    if (request.method === "POST" && !hasPermission(token.role as string, "create-work-orders")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (request.method === "PUT" && !hasPermission(token.role as string, "edit-work-orders")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/workorders/:path*',
    '/api/users/:path*',
    '/api/equipment/:path*'
  ]
};