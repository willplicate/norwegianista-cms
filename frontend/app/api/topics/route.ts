import { NextResponse } from 'next/server';
import { getTopics } from '@/lib/queries';

export async function GET() {
  try {
    const topics = await getTopics();
    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}
