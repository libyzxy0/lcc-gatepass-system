import "dotenv/config";

export const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL!;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_VISITOR_SECRET = process.env.JWT_VISITOR_SECRET!;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN!;
export const CLOUDFLARE_TURNSTILE_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET!;

if(!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_VISITOR_SECRET) {
  throw new Error("JWT_VISITOR_SECRET cannot be found on Environment Variables")
}
if(!NEON_DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL cannot be found on Environment Variables")
}
if(!NEON_DATABASE_URL) {
  throw new Error("FRONTEND_ORIGIN cannot be found on Environment Variables")
}
if(!CLOUDFLARE_TURNSTILE_SECRET) {
  throw new Error("CLOUDFLARE_TURNSTILE_SECRET cannot be found on Environment Variables")
}