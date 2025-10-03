import { NextResponse } from 'next/server';
import { getShips } from '@/lib/queries';

export async function GET() {
  try {
    const ships = await getShips();
    return NextResponse.json(ships);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ships' },
      { status: 500 }
    );
  }
}
