import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    brand: 'CLASSICAL DECOR I D (DST Deco)',
    email: 'dstdeco@gmail.com',
    whatsapp: '+971 543 532 585'
  });
}

