import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_QR_SECRET
} from '@/secrets'

interface TokenDecodedType {
  id: string;
  iat: number;
  exp: number;
}

class AuthService {
  static generateAdminAccessToken(id: string) {
    return jwt.sign({ id }, JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
  }
  static generateAdminRefreshToken(id: string) {
    return jwt.sign({ id }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }
  static generateVisitorAccessToken(id: string) {
    return jwt.sign({ id }, JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });
  }
  static generateQRToken(id: string) {
    return jwt.sign({ id }, JWT_QR_SECRET, {
      expiresIn: "7d",
    });
  }

  static verifyAdminRefreshToken(token: string) {
    const decoded = jwt.verify(
      token,
      JWT_REFRESH_SECRET
    ) as TokenDecodedType;
    return decoded;
  }
  
}

export default AuthService;