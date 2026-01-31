import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export async function signAccessToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);
}

export async function signRefreshToken(payload: Omit<TokenPayload, 'type'>): Promise<string> {
  return new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function generateTokens(userId: string, email: string) {
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken({ userId, email }),
    signRefreshToken({ userId, email }),
  ]);

  return { accessToken, refreshToken };
}
