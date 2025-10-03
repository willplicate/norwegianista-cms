// Database types for Cruise Blog CMS

export interface Ship {
  id: string;
  name: string;
  cruise_line: string;
  year_built: number | null;
  capacity: number | null;
  gross_tonnage: number | null;
  itineraries: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  ship_id: string;
  cruise_date: string | null;
  rating: number;
  reviewer_name: string | null;
  review_text: string;
  categories: {
    [key: string]: number;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  ship_id: string | null;
  review_id: string | null;
  url: string;
  caption: string | null;
  credit: string | null;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  ship_id: string;
  topic_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_id: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StyleGuide {
  id: string;
  name: string;
  system_prompt: string;
  tone: string | null;
  structure_template: string | null;
  dos_and_donts: {
    dos: string[];
    donts: string[];
  } | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Input types for creating/updating records
export interface ArticleInput {
  ship_id: string;
  topic_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_id?: string;
}

// Extended types with relations
export interface ArticleWithRelations extends Article {
  ship?: Ship;
  topic?: Topic;
  featured_image?: Image;
}

export interface ReviewWithImages extends Review {
  images?: Image[];
}

export interface ShipWithReviews extends Ship {
  reviews?: Review[];
  images?: Image[];
}
