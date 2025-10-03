import Anthropic from '@anthropic-ai/sdk';
import type { Ship, Review, Topic, StyleGuide } from './types';

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  throw new Error(
    'Missing ANTHROPIC_API_KEY environment variable. Please check your .env file.'
  );
}

const anthropic = new Anthropic({
  apiKey: apiKey,
});

export interface GenerateArticleOptions {
  ship: Ship;
  reviews: Review[];
  topic: Topic;
  styleGuide?: StyleGuide;
}

export async function generateArticle(options: GenerateArticleOptions) {
  const { ship, reviews, topic, styleGuide } = options;

  // Build the system prompt
  const systemPrompt = styleGuide?.system_prompt ||
    'You are a professional cruise travel writer. Write engaging, informative articles about cruise ships.';

  // Build the user prompt
  const userPrompt = buildArticlePrompt(ship, reviews, topic, styleGuide);

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    return stream;
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate article. Please try again.');
  }
}

function buildArticlePrompt(
  ship: Ship,
  reviews: Review[],
  topic: Topic,
  styleGuide?: StyleGuide
): string {
  const reviewSummaries = reviews
    .map((review, idx) => {
      const categories = review.categories
        ? Object.entries(review.categories)
            .map(([cat, rating]) => `${cat}: ${rating}/5`)
            .join(', ')
        : 'No categories';

      return `
Review ${idx + 1}:
- Rating: ${review.rating}/5
- Date: ${review.cruise_date || 'Not specified'}
- Reviewer: ${review.reviewer_name || 'Anonymous'}
- Categories: ${categories}
- Review: ${review.review_text}
`;
    })
    .join('\n');

  let prompt = `Write a comprehensive 1200-word article about "${topic.name}" on the ${ship.name} cruise ship.

Ship Details:
- Name: ${ship.name}
- Cruise Line: ${ship.cruise_line}
- Year Built: ${ship.year_built || 'Unknown'}
- Capacity: ${ship.capacity || 'Unknown'} passengers
- Gross Tonnage: ${ship.gross_tonnage || 'Unknown'}
${ship.itineraries ? `- Itineraries: ${ship.itineraries.join(', ')}` : ''}

Topic: ${topic.name}
${topic.description ? `Description: ${topic.description}` : ''}

Base your article on these ${reviews.length} reviews:
${reviewSummaries}
`;

  if (styleGuide?.structure_template) {
    prompt += `\n\nArticle Structure:
${styleGuide.structure_template}`;
  }

  if (styleGuide?.dos_and_donts) {
    const { dos, donts } = styleGuide.dos_and_donts;
    prompt += `\n\nStyle Guidelines:
DO:
${dos.map((item) => `- ${item}`).join('\n')}

DON'T:
${donts.map((item) => `- ${item}`).join('\n')}`;
  }

  prompt += `\n\nPlease write the article now. Include a compelling title at the beginning.`;

  return prompt;
}

export function extractTitleFromContent(content: string): string {
  // Try to extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // Fallback: use first line
  const firstLine = content.split('\n')[0].trim();
  return firstLine.substring(0, 100);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/^#+ .+$/gm, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italics
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .trim();

  // Get first paragraph
  const firstParagraph = plainText.split('\n\n')[0];

  // Truncate to maxLength
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength - 3) + '...';
}
