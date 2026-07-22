export interface JwtPayload {
  sub: string;      // user id
  email: string;
  role: string;
  plan: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}
