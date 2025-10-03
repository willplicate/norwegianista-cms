-- Cruise Blog CMS Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ships table
CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  cruise_line TEXT NOT NULL,
  year_built INTEGER CHECK (year_built >= 1900 AND year_built <= EXTRACT(YEAR FROM CURRENT_DATE)),
  capacity INTEGER CHECK (capacity > 0),
  gross_tonnage INTEGER,
  itineraries TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ships_name ON ships(name);
CREATE INDEX idx_ships_cruise_line ON ships(cruise_line);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  cruise_date DATE CHECK (cruise_date <= CURRENT_DATE),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  reviewer_name TEXT,
  review_text TEXT NOT NULL CHECK (char_length(review_text) >= 50),
  categories JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_ship_id ON reviews(ship_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID REFERENCES ships(id) ON DELETE CASCADE,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  credit TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CHECK (ship_id IS NOT NULL OR review_id IS NOT NULL)
);

CREATE INDEX idx_images_ship_id ON images(ship_id);
CREATE INDEX idx_images_review_id ON images(review_id);

-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_topics_slug ON topics(slug);

-- Articles table
CREATE TYPE article_status AS ENUM ('draft', 'published');

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK (char_length(title) <= 100),
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT CHECK (char_length(excerpt) <= 200),
  featured_image_id UUID REFERENCES images(id) ON DELETE SET NULL,
  status article_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_ship_id ON articles(ship_id);
CREATE INDEX idx_articles_topic_id ON articles(topic_id);
CREATE INDEX idx_articles_status ON articles(status);

-- Style Guides table
CREATE TABLE style_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  system_prompt TEXT NOT NULL CHECK (char_length(system_prompt) >= 100),
  tone TEXT,
  structure_template TEXT,
  dos_and_donts JSONB,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_style_guides_is_default ON style_guides(is_default);

-- Ensure only one default style guide
CREATE UNIQUE INDEX idx_style_guides_only_one_default ON style_guides(is_default) WHERE is_default = TRUE;

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_ships_updated_at BEFORE UPDATE ON ships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_style_guides_updated_at BEFORE UPDATE ON style_guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data inserts
INSERT INTO ships (name, cruise_line, year_built, capacity, gross_tonnage, itineraries)
VALUES
  ('Symphony of the Seas', 'Royal Caribbean', 2018, 6680, 228081, ARRAY['Caribbean', 'Mediterranean']),
  ('Wonder of the Seas', 'Royal Caribbean', 2022, 6988, 236857, ARRAY['Caribbean', 'Mediterranean']),
  ('Icon of the Seas', 'Royal Caribbean', 2024, 7600, 250800, ARRAY['Caribbean']);

-- Sample topics
INSERT INTO topics (name, slug, description)
VALUES
  ('Dining Experience', 'dining-experience', 'Restaurant reviews, food quality, and dining options'),
  ('Entertainment', 'entertainment', 'Shows, activities, and onboard entertainment'),
  ('Cabins & Suites', 'cabins-suites', 'Cabin reviews, room types, and accommodations');

-- Sample style guide
INSERT INTO style_guides (name, system_prompt, tone, structure_template, dos_and_donts, is_default)
VALUES (
  'Default Article Style',
  'You are a professional cruise travel writer. Write engaging, informative articles about cruise ships. Use active voice, include specific details from reviews, and maintain a balanced perspective. Focus on helping readers make informed decisions about their cruise vacations. Articles should be approximately 1200 words.',
  'Professional yet approachable',
  'Introduction (2-3 paragraphs), Main Topic Analysis (4-5 paragraphs with specific examples), Comparison or Context (2-3 paragraphs), Conclusion (1-2 paragraphs)',
  '{"dos": ["Use active voice", "Include specific examples from reviews", "Provide balanced perspectives", "Use descriptive language", "Include practical tips"], "donts": ["Avoid superlatives without evidence", "No marketing speak", "Do not make unsubstantiated claims", "Avoid repetition"]}',
  TRUE
);
