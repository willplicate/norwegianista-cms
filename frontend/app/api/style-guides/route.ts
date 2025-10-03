import { NextResponse } from 'next/server';
import { getStyleGuides } from '@/lib/queries';

export async function GET() {
  try {
    const styleGuides = await getStyleGuides();
    return NextResponse.json(styleGuides);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch style guides' },
      { status: 500 }
    );
  }
}
