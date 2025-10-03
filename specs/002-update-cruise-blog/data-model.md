# Data Model: Cruise Blog CMS

**Feature**: 002-update-cruise-blog
**Date**: 2025-10-03
**Database**: Supabase (PostgreSQL)

## Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   ships     │──────<│   reviews    │>──────│   images     │
└─────────────┘       └──────────────┘       └──────────────┘
       │                      │
       │                      │
       └──────────────────────┘
                 │
                 ▼
          ┌─────────────┐
          │  articles   │
          └─────────────┘
                 │
                 ▼
          ┌─────────────┐
          │   topics    │
          └─────────────┘

┌──────────────────┐
│  style_guides    │
└──────────────────┘
```

## Entities

### 1. ships

Represents cruise ships in the database.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `name` (TEXT, required): Ship name (e.g., "Symphony of the Seas")
- `cruise_line` (TEXT, required): Cruise line name (e.g., "Royal Caribbean")
- `year_built` (INTEGER): Year the ship was built
- `capacity` (INTEGER): Total passenger capacity
- `gross_tonnage` (INTEGER): Ship size in gross tons
- `itineraries` (TEXT[]): Common cruise routes
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Indexes**:
- `idx_ships_name` on `name`
- `idx_ships_cruise_line` on `cruise_line`

**Validation**:
- `name` must be unique
- `year_built` between 1900 and current year
- `capacity` > 0

**Relationships**:
- One ship has many reviews (one-to-many)
- One ship has many articles (one-to-many)

---

### 2. reviews

User-submitted reviews of cruise ships.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `ship_id` (UUID, foreign key → ships.id, required): Associated ship
- `cruise_date` (DATE): Date of cruise
- `rating` (INTEGER, required): Overall rating 1-5
- `reviewer_name` (TEXT): Reviewer's name
- `review_text` (TEXT, required): Review content
- `categories` (JSONB): Category ratings (dining, entertainment, etc.)
  ```json
  {
    "dining": 4,
    "entertainment": 5,
    "cabins": 3,
    "service": 5
  }
  ```
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Indexes**:
- `idx_reviews_ship_id` on `ship_id`
- `idx_reviews_rating` on `rating`

**Validation**:
- `rating` between 1 and 5
- `review_text` minimum 50 characters
- `cruise_date` not in future

**Relationships**:
- Many reviews belong to one ship (many-to-one)
- One review has many images (one-to-many)

---

### 3. images

Photos related to ships or reviews.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `ship_id` (UUID, foreign key → ships.id): Associated ship (optional)
- `review_id` (UUID, foreign key → reviews.id): Associated review (optional)
- `url` (TEXT, required): Image URL (Supabase Storage or external)
- `caption` (TEXT): Image description
- `credit` (TEXT): Photo credit
- `created_at` (TIMESTAMP): Record creation time

**Indexes**:
- `idx_images_ship_id` on `ship_id`
- `idx_images_review_id` on `review_id`

**Validation**:
- `url` must be valid HTTP(S) URL
- At least one of `ship_id` or `review_id` must be set

**Relationships**:
- Many images belong to one ship (many-to-one, optional)
- Many images belong to one review (many-to-one, optional)

---

### 4. topics

Content categories for articles.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `name` (TEXT, required): Topic name (e.g., "Dining Experience")
- `slug` (TEXT, required): URL-friendly slug (e.g., "dining-experience")
- `description` (TEXT): Topic description
- `created_at` (TIMESTAMP): Record creation time

**Indexes**:
- `idx_topics_slug` on `slug` (unique)

**Validation**:
- `name` must be unique
- `slug` must be unique and lowercase with hyphens only

**Relationships**:
- One topic has many articles (one-to-many)

---

### 5. articles

Generated blog posts.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `ship_id` (UUID, foreign key → ships.id, required): Featured ship
- `topic_id` (UUID, foreign key → topics.id, required): Article topic
- `title` (TEXT, required): Article title
- `slug` (TEXT, required): URL slug (e.g., "symphony-seas-dining")
- `content` (TEXT, required): Article body (markdown)
- `excerpt` (TEXT): Short summary (first 160 chars)
- `featured_image_id` (UUID, foreign key → images.id): Main article image
- `status` (ENUM, required): 'draft', 'published'
- `published_at` (TIMESTAMP): Publication date
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Indexes**:
- `idx_articles_slug` on `slug` (unique)
- `idx_articles_ship_id` on `ship_id`
- `idx_articles_topic_id` on `topic_id`
- `idx_articles_status` on `status`

**Validation**:
- `slug` must be unique
- `content` minimum 800 words (for 1200-word target)
- `title` maximum 100 characters
- `excerpt` maximum 200 characters

**Relationships**:
- Many articles belong to one ship (many-to-one)
- Many articles belong to one topic (many-to-one)
- One article has one featured image (one-to-one, optional)

**State Transitions**:
```
draft → published (via admin publish action)
published → draft (via admin unpublish action)
```

---

### 6. style_guides

Editorial guidelines for AI content generation.

**Fields**:
- `id` (UUID, primary key): Unique identifier
- `name` (TEXT, required): Guide name (e.g., "Default Article Style")
- `system_prompt` (TEXT, required): Claude system prompt
- `tone` (TEXT): Tone description (e.g., "Professional yet approachable")
- `structure_template` (TEXT): Article structure guidelines
- `dos_and_donts` (JSONB): Style rules
  ```json
  {
    "dos": ["Use active voice", "Include specific examples"],
    "donts": ["Avoid superlatives", "No marketing speak"]
  }
  ```
- `is_default` (BOOLEAN): Whether this is the default guide
- `created_at` (TIMESTAMP): Record creation time
- `updated_at` (TIMESTAMP): Last update time

**Indexes**:
- `idx_style_guides_is_default` on `is_default`

**Validation**:
- Only one guide can have `is_default = true`
- `system_prompt` minimum 100 characters

**Relationships**:
- No direct relationships (used as reference during generation)

---

## Database Schema (SQL)

```sql
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
```

## Sample Data

```sql
-- Sample ship
INSERT INTO ships (name, cruise_line, year_built, capacity, gross_tonnage)
VALUES ('Symphony of the Seas', 'Royal Caribbean', 2018, 6680, 228081);

-- Sample topic
INSERT INTO topics (name, slug, description)
VALUES ('Dining Experience', 'dining-experience', 'Restaurant reviews, food quality, and dining options');

-- Sample style guide
INSERT INTO style_guides (name, system_prompt, tone, is_default)
VALUES (
  'Default Article Style',
  'You are a professional cruise travel writer. Write engaging, informative articles about cruise ships. Use active voice, include specific details, and maintain a balanced perspective.',
  'Professional yet approachable',
  TRUE
);
```

## Relationships Summary

- **ships** → reviews (1:N)
- **ships** → articles (1:N)
- **ships** → images (1:N, optional)
- **reviews** → images (1:N, optional)
- **topics** → articles (1:N)
- **articles** → images (1:1, optional, featured)
- **style_guides** → (standalone, referenced during generation)
