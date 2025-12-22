import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL!;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_VISITOR_SECRET = process.env.JWT_VISITOR_SECRET!;
export const JWT_QR_SECRET = process.env.JWT_QR_SECRET!;
export const CLOUDFLARE_TURNSTILE_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET!;
export const SMS_API_TOKEN = process.env.SMS_API_TOKEN!;
export const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY!;
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY!;
export const MQTT_BRIDGE = process.env.MQTT_BRIDGE!;
export const MQTT_BRIDGE_SECRET = process.env.MQTT_BRIDGE_SECRET!;

if(!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_REFRESH_SECRET) {
  throw new Error("JWT_ACCESS_SECRET cannot be found on Environment Variables")
}
if(!JWT_VISITOR_SECRET) {
  throw new Error("JWT_VISITOR_SECRET cannot be found on Environment Variables")
}
if(!JWT_QR_SECRET) {
  throw new Error("JWT_QR_SECRET cannot be found on Environment Variables")
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
if(!IMAGEKIT_PUBLIC_KEY) {
  throw new Error("IMAGEKIT_PUBLIC_KEY cannot be found on Environment Variables")
}
if(!IMAGEKIT_PRIVATE_KEY) {
  throw new Error("IMAGEKIT_PRIVATE_KEY cannot be found on Environment Variables")
}
if(!MQTT_BRIDGE) {
  throw new Error("MQTT_BRIDGE cannot be found on Environment Variables")
}
if(!MQTT_BRIDGE_SECRET) {
  throw new Error("MQTT_BRIDGE_SECRET cannot be found on Environment Variables")
}