import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL!;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_VISITOR_SECRET = process.env.JWT_VISITOR_SECRET!;
export const CLOUDFLARE_TURNSTILE_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET!;
export const SMS_API_TOKEN = process.env.SMS_API_TOKEN!;

if(!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_VISITOR_SECRET) {
  throw new Error("JWT_VISITOR_SECRET cannot be found on Environment Variables")
}
if(!DATABASE_URL) {
  throw new Error("DATABASE_URL cannot be found on Environment Variables")
}
if(!CLOUDFLARE_TURNSTILE_SECRET) {
  throw new Error("CLOUDFLARE_TURNSTILE_SECRET cannot be found on Environment Variables")
}
if(!SMS_API_TOKEN) {
  throw new Error("SMS_API_TOKEN cannot be found on Environment Variables")
}