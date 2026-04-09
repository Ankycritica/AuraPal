import { auth } from "./auth"

export default auth((req) => {
  if (!req.auth && (
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/resume-builder") ||
    req.nextUrl.pathname.startsWith("/cover-letter") ||
    req.nextUrl.pathname.startsWith("/interview-prep")
  )) {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = { 
  matcher: [
    "/dashboard/:path*", 
    "/resume-builder/:path*", 
    "/cover-letter/:path*", 
    "/interview-prep/:path*",
    "/linkedin-optimizer/:path*",
    "/job-fit/:path*",
    "/career-roadmap/:path*"
  ] 
}
