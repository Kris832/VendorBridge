export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days
};
