const localServer = "http://localhost:3000/api/v1";
export const API_BASE_URL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? localServer :"https://api.lccgatepass.xyz/api/v1";