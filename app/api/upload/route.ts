import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: 'Signed upload URL generation not implemented yet.',
      },
    },
    { status: 501 },
  );
}
