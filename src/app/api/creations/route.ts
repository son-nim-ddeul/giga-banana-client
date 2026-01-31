import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

interface Creation {
  creation_id: string;
  user_id: string;
  workflow: string | null;
  metadata: string | null;
  image_url: string;
  created_date: Date;
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // Fetch creations for the user
    const creations = await query<Creation>(
      `SELECT creation_id, user_id, workflow, metadata, image_url, created_date, status
       FROM creations
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_date DESC`,
      [payload.userId]
    );

    return NextResponse.json({
      creations: creations.map((c) => ({
        id: c.creation_id,
        userId: c.user_id,
        workflow: c.workflow,
        metadata: c.metadata ? JSON.parse(c.metadata) : null,
        image_url: c.image_url,
        createdAt: c.created_date,
        status: c.status,
      })),
    });
  } catch (error) {
    console.error('Creations fetch error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
