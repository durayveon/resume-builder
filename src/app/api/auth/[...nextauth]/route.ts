import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'NextAuth disabled: using Supabase Auth' },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: 'NextAuth disabled: using Supabase Auth' },
    { status: 410 }
  );
}
