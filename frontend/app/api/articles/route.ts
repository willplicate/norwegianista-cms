import { NextRequest, NextResponse } from 'next/server';
import { saveArticleDraft } from '@/lib/queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ship_id, topic_id, title, slug, content, excerpt, featured_image_id } = body;

    if (!ship_id || !topic_id || !title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const article = await saveArticleDraft({
      ship_id,
      topic_id,
      title,
      slug,
      content,
      excerpt,
      featured_image_id,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('Save article error:', error);
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    );
  }
}
