import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Fetch single creation
    const creation = await queryOne<Creation>(
      `SELECT creation_id, user_id, workflow, metadata, image_url, created_date, status
       FROM creations
       WHERE creation_id = $1 AND user_id = $2 AND status = 'active'`,
      [id, payload.userId]
    );

    if (!creation) {
      return NextResponse.json(
        { error: '생성물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      creation: {
        id: creation.creation_id,
        userId: creation.user_id,
        workflow: creation.workflow,
        metadata: creation.metadata ? JSON.parse(creation.metadata) : null,
        image_url: creation.image_url,
        createdAt: creation.created_date,
        status: creation.status,
      },
    });
  } catch (error) {
    console.error('Creation fetch error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Soft delete (update status to 'deleted')
    const result = await query(
      `UPDATE creations
       SET status = 'deleted'
       WHERE creation_id = $1 AND user_id = $2 AND status = 'active'
       RETURNING creation_id`,
      [id, payload.userId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: '생성물을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: '삭제되었습니다.',
    });
  } catch (error) {
    console.error('Creation delete error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
