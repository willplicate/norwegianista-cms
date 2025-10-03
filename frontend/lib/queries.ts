import { supabase } from './supabase';
import type {
  Ship,
  Review,
  Image,
  Topic,
  Article,
  StyleGuide,
  ArticleInput,
  ShipWithReviews,
  ReviewWithImages,
  ArticleWithRelations,
} from './types';

// Ships
export async function getShips(): Promise<Ship[]> {
  const { data, error } = await supabase
    .from('ships')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching ships:', error);
    throw new Error('Failed to fetch ships');
  }

  return data || [];
}

export async function getShipById(id: string): Promise<Ship | null> {
  const { data, error } = await supabase
    .from('ships')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching ship:', error);
    return null;
  }

  return data;
}

// Reviews
export async function getShipReviews(shipId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('ship_id', shipId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Failed to fetch reviews');
  }

  return data || [];
}

export async function getReviewsWithImages(
  shipId: string
): Promise<ReviewWithImages[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      images (*)
    `)
    .eq('ship_id', shipId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews with images:', error);
    throw new Error('Failed to fetch reviews with images');
  }

  return data || [];
}

// Images
export async function getShipImages(shipId: string): Promise<Image[]> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('ship_id', shipId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images');
  }

  return data || [];
}

// Topics
export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching topics:', error);
    throw new Error('Failed to fetch topics');
  }

  return data || [];
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching topic:', error);
    return null;
  }

  return data;
}

// Style Guides
export async function getStyleGuides(): Promise<StyleGuide[]> {
  const { data, error } = await supabase
    .from('style_guides')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching style guides:', error);
    throw new Error('Failed to fetch style guides');
  }

  return data || [];
}

export async function getDefaultStyleGuide(): Promise<StyleGuide | null> {
  const { data, error } = await supabase
    .from('style_guides')
    .select('*')
    .eq('is_default', true)
    .single();

  if (error) {
    console.error('Error fetching default style guide:', error);
    return null;
  }

  return data;
}

// Articles
export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }

  return data || [];
}

export async function getPublishedArticles(): Promise<ArticleWithRelations[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      ship:ships (*),
      topic:topics (*),
      featured_image:images (*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published articles:', error);
    throw new Error('Failed to fetch published articles');
  }

  return data || [];
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithRelations | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      ship:ships (*),
      topic:topics (*),
      featured_image:images (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

export async function saveArticleDraft(
  articleData: ArticleInput
): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...articleData,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving article draft:', error);
    throw new Error('Failed to save article draft');
  }

  return data;
}

export async function updateArticle(
  id: string,
  updates: Partial<ArticleInput>
): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating article:', error);
    throw new Error('Failed to update article');
  }

  return data;
}

export async function publishArticle(id: string): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error publishing article:', error);
    throw new Error('Failed to publish article');
  }

  return data;
}

export async function unpublishArticle(id: string): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update({
      status: 'draft',
      published_at: null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error unpublishing article:', error);
    throw new Error('Failed to unpublish article');
  }

  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);

  if (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
}
