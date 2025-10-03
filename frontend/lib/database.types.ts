// Generated types for Supabase database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      ships: {
        Row: {
          id: string;
          name: string;
          cruise_line: string;
          year_built: number | null;
          capacity: number | null;
          gross_tonnage: number | null;
          itineraries: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cruise_line: string;
          year_built?: number | null;
          capacity?: number | null;
          gross_tonnage?: number | null;
          itineraries?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cruise_line?: string;
          year_built?: number | null;
          capacity?: number | null;
          gross_tonnage?: number | null;
          itineraries?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          ship_id: string;
          cruise_date: string | null;
          rating: number;
          reviewer_name: string | null;
          review_text: string;
          categories: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ship_id: string;
          cruise_date?: string | null;
          rating: number;
          reviewer_name?: string | null;
          review_text: string;
          categories?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ship_id?: string;
          cruise_date?: string | null;
          rating?: number;
          reviewer_name?: string | null;
          review_text?: string;
          categories?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      images: {
        Row: {
          id: string;
          ship_id: string | null;
          review_id: string | null;
          url: string;
          caption: string | null;
          credit: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ship_id?: string | null;
          review_id?: string | null;
          url: string;
          caption?: string | null;
          credit?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          ship_id?: string | null;
          review_id?: string | null;
          url?: string;
          caption?: string | null;
          credit?: string | null;
          created_at?: string;
        };
      };
      topics: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          ship_id: string;
          topic_id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          featured_image_id: string | null;
          status: 'draft' | 'published';
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ship_id: string;
          topic_id: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string | null;
          featured_image_id?: string | null;
          status?: 'draft' | 'published';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ship_id?: string;
          topic_id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string | null;
          featured_image_id?: string | null;
          status?: 'draft' | 'published';
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      style_guides: {
        Row: {
          id: string;
          name: string;
          system_prompt: string;
          tone: string | null;
          structure_template: string | null;
          dos_and_donts: Json | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          system_prompt: string;
          tone?: string | null;
          structure_template?: string | null;
          dos_and_donts?: Json | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          system_prompt?: string;
          tone?: string | null;
          structure_template?: string | null;
          dos_and_donts?: Json | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
