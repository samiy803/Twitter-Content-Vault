import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
    let url = request.nextUrl.clone();
    url.pathname = "/login";
    const token = request.cookies.get("token");
    if (!token) {
        console.log("no token");
        return NextResponse.redirect(url);
    }
    try {
        const v = await jose.jwtVerify(
            token.value,
            new TextEncoder().encode(process.env.JWT_SECRET ?? ""),
            {
                issuer: "jokevault",
                audience: "jokevault",
                requiredClaims: ["exp", "aud", "iss"],
                algorithms: ["HS256"],
            }
        );
        if (v.payload.exp && v.payload.exp < Math.floor(Date.now() / 1000)) {
            console.log("token expired");
            return NextResponse.redirect;
        }
        if (typeof v === "string") {
            console.log("decoding failed");
            return NextResponse.redirect(url);
        }
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-is-admin", v.payload.admin as string);
        requestHeaders.set("x-user-id", v.payload.id as string);
        const response = NextResponse.next({
            request: {
                // New request headers
                headers: requestHeaders,
            },
        });
        const newToken = await new jose.SignJWT({
            username: v.payload.username,
            admin: v.payload.admin,
            id: v.payload.id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setAudience("jokevault")
            .setIssuer("jokevault")
            .setExpirationTime("1h")
            .sign(new TextEncoder().encode(process.env.JWT_SECRET ?? ""));

        response.cookies.set("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
        return response;
    } catch (e) {
        console.log("decoding failed");
        console.log(e);
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|api/postRandom|favicon.ico|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
