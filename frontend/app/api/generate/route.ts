import { NextRequest } from 'next/server';
import { generateArticle } from '@/lib/claude';
import {
  getShipById,
  getShipReviews,
  getTopicBySlug,
  getStyleGuides,
} from '@/lib/queries';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shipId, topicId, styleGuideId } = body;

    if (!shipId || !topicId) {
      return new Response('Missing shipId or topicId', { status: 400 });
    }

    // Fetch ship, reviews, and topic
    const [ship, reviews, topicResult, styleGuidesResult] = await Promise.all([
      getShipById(shipId),
      getShipReviews(shipId),
      supabase.from('topics').select('*').eq('id', topicId).single(),
      styleGuideId
        ? supabase.from('style_guides').select('*').eq('id', styleGuideId).single()
        : Promise.resolve({ data: null }),
    ]);

    if (!ship) {
      return new Response('Ship not found', { status: 404 });
    }

    if (!topicResult.data) {
      return new Response('Topic not found', { status: 404 });
    }

    const topic = topicResult.data;
    const styleGuide = styleGuidesResult.data || undefined;

    // Generate article using Claude
    const stream = await generateArticle({
      ship,
      reviews,
      topic,
      styleGuide,
    });

    // Create a ReadableStream to pipe Claude's response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
              const text = chunk.delta.type === 'text_delta' ? chunk.delta.text : '';
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return new Response('Failed to generate article', { status: 500 });
  }
}
