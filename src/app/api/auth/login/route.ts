import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { queryOne } from '@/lib/db';
import { generateTokens } from '@/lib/jwt';

interface User {
  id: number;
  user_id: string;
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await queryOne<User>(
      'SELECT id, user_id, name, email, password FROM users WHERE email = $1',
      [email]
    );

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      user.user_id,
      user.email
    );

    const response = NextResponse.json({
      message: '로그인 성공',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });

    // Set refresh token as httpOnly cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3 * 60 * 60, // 3 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
