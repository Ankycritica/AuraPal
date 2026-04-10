export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume-builder/:path*",
    "/resume-upload/:path*",
    "/cover-letter/:path*",
    "/interview-prep/:path*",
    "/linkedin-optimizer/:path*",
    "/job-fit/:path*",
    "/career-roadmap/:path*",
    "/settings/:path*",
  ],
}
