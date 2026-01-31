import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateTokens } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokens = await generateTokens(payload.userId, payload.email);

    const response = NextResponse.json({
      message: '토큰이 갱신되었습니다.',
      accessToken: tokens.accessToken,
    });

    // Set new refresh token
    response.cookies.set('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60 * 60, // 3 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
