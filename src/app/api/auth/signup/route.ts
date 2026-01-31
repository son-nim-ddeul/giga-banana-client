import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '@/lib/db';
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
    const { email, name, password } = await request.json();

    // Validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await queryOne<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const result = await query<User>(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, name, email`,
      [name, email, hashedPassword]
    );

    const newUser = result[0];

    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(
      newUser.user_id,
      newUser.email
    );

    const response = NextResponse.json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
