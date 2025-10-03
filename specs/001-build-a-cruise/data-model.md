# Data Model
**Feature**: Cruise Blog CMS with AI Content Generation
**Date**: 2025-10-01

## Entity Relationship Overview

```
┌─────────────┐       ┌─────────┐       ┌────────────┐
│   Ship      │◄──────┤ Review  │──────►│   Topic    │
└─────────────┘       └─────────┘       └────────────┘
      │                     │                   │
      │                     │                   │
      ▼                     ▼                   ▼
┌─────────────┐       ┌─────────┐       ┌────────────┐
│   Image     │       │ Article │──────►│ StyleGuide │
└─────────────┘       └─────────┘       └────────────┘
                            │
                            ▼
                      ┌──────────┐
                      │   User   │
                      │ (Admin)  │
                      └──────────┘
```

## Core Entities

### Ship
Represents a cruise vessel in the database.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `name` (string, required, indexed) - Ship name (e.g., "Norwegian Encore")
- `cruise_line` (string, required) - Operating cruise line (e.g., "Norwegian Cruise Line")
- `ship_class` (string, optional) - Ship class/series (e.g., "Breakaway Plus")
- `year_built` (integer, optional) - Year ship was built
- `capacity` (integer, optional) - Passenger capacity
- `description` (text, optional) - Brief ship description
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Has many Reviews
- Has many Images
- Has many Articles (through ship selection)

**Validation Rules**:
- Name must be unique
- Name length: 1-200 characters
- Year built: 1900-current year if provided

**Database Indexes**:
- Unique index on `name`
- Index on `cruise_line` for filtering

---

### Topic
Categories or themes for articles about ships (e.g., "Dining", "Entertainment", "Cabins").

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `name` (string, required, indexed) - Topic name
- `slug` (string, required, unique) - URL-friendly identifier
- `description` (text, optional) - Topic description
- `icon` (string, optional) - Icon identifier for UI
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Has many Reviews (topics associated with reviews)
- Has many Images (topics associated with images)
- Has many Articles (topic selection for article generation)

**Validation Rules**:
- Name must be unique
- Slug must be unique and URL-safe (lowercase, hyphens only)
- Name length: 1-100 characters

**Common Topics** (seed data examples):
- Dining & Restaurants
- Entertainment & Shows
- Cabins & Staterooms
- Pools & Water Features
- Kids & Family Activities
- Spa & Fitness
- Ports & Excursions
- Service & Staff

**Database Indexes**:
- Unique index on `name`
- Unique index on `slug`

---

### Review
User-generated content providing feedback or experiences about specific ships and topics.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `ship_id` (UUID, foreign key to Ship, required, indexed)
- `topic_id` (UUID, foreign key to Topic, optional, indexed) - Associated topic if applicable
- `author_name` (string, optional) - Reviewer name or anonymous
- `rating` (integer, optional) - Rating 1-5 if applicable
- `title` (string, optional) - Review title
- `content` (text, required) - Review text content
- `review_date` (date, optional) - Date of the cruise/experience
- `helpful_count` (integer, default 0) - Upvote/helpful counter
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Belongs to Ship
- Belongs to Topic (optional)
- Referenced in Articles (as source material)

**Validation Rules**:
- Content required, min 10 characters
- Rating 1-5 if provided
- Ship ID must exist

**Database Indexes**:
- Index on `ship_id`
- Index on `topic_id`
- Index on `created_at` for sorting

**Query Patterns**:
- Fetch reviews by ship + topic for article generation
- Sort by `helpful_count` or `created_at` for best/recent reviews

---

### Image
Photographs or visual content related to specific ships and topics.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `ship_id` (UUID, foreign key to Ship, required, indexed)
- `topic_id` (UUID, foreign key to Topic, optional, indexed) - Associated topic
- `url` (string, required) - Supabase Storage URL or external URL
- `storage_path` (string, optional) - Path in Supabase Storage bucket
- `caption` (text, optional) - Image description/caption
- `photographer_credit` (string, optional) - Photo credit
- `width` (integer, optional) - Image width in pixels
- `height` (integer, optional) - Image height in pixels
- `file_size` (integer, optional) - Size in bytes
- `mime_type` (string, optional) - e.g., "image/jpeg"
- `upload_date` (timestamp, auto) - When uploaded
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Belongs to Ship
- Belongs to Topic (optional)
- Referenced in Articles (embedded in generated content)

**Validation Rules**:
- URL required and valid
- Ship ID must exist
- Supported mime types: image/jpeg, image/png, image/webp

**Database Indexes**:
- Index on `ship_id`
- Index on `topic_id`

**Query Patterns**:
- Fetch images by ship + topic for article generation
- Filter by quality (width/height for hi-res images)

---

### Article
Generated blog content created by the CMS combining database content with AI-written prose.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `ship_id` (UUID, foreign key to Ship, required, indexed)
- `topic_id` (UUID, foreign key to Topic, required, indexed)
- `title` (string, required) - Auto-generated or editable article title
- `slug` (string, required, unique, indexed) - URL-friendly identifier
- `content` (text, required) - Article HTML/Markdown content
- `content_format` (enum, default 'html') - 'html' | 'markdown'
- `word_count` (integer, optional) - Calculated word count
- `status` (enum, required, indexed) - 'draft' | 'generated' | 'published' | 'unpublished'
- `generated_at` (timestamp, optional) - When AI generation completed
- `published_at` (timestamp, optional) - When first published
- `unpublished_at` (timestamp, optional) - When unpublished
- `style_guide_id` (UUID, foreign key to StyleGuide, optional) - Style guide used
- `generation_prompt` (text, optional) - Prompt sent to Claude API (for debugging)
- `manual_edits_made` (boolean, default false) - Whether admin edited generated content
- `version` (integer, default 1) - Version number for optimistic locking
- `created_by` (UUID, foreign key to User, required) - Admin who created article
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Belongs to Ship
- Belongs to Topic
- Belongs to StyleGuide (optional)
- Belongs to User (creator)
- Has many ArticleReviewReference (join table)
- Has many ArticleImageReference (join table)

**State Transitions**:
```
draft → generated → published → unpublished → published (re-publish)
                   ↓
                 deleted (permanent)
```

**Validation Rules**:
- Title required, 1-200 characters
- Slug unique and URL-safe
- Content required (min 100 characters)
- Status must be valid enum value
- Ship and Topic must exist

**Derived Fields** (computed, not stored):
- `url` - Constructed from slug for static site
- `excerpt` - First 200 characters of content for listings

**Database Indexes**:
- Unique index on `slug`
- Index on `status` for filtering
- Index on `ship_id`
- Index on `topic_id`
- Index on `created_by`
- Index on `published_at` for sorting

**Query Patterns**:
- List articles by status (admin dashboard)
- Fetch published articles for static site generation
- Find articles by ship or topic
- Sort by published date (descending)

---

### StyleGuide
Admin-configurable style guide that controls article generation tone and style.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `name` (string, required) - Style guide name (e.g., "Default Editorial Voice")
- `description` (text, optional) - Purpose/usage description
- `system_prompt` (text, required) - Claude API system prompt with style instructions
- `example_output` (text, optional) - Example article demonstrating style
- `tone` (string, optional) - Tone descriptor (e.g., "Friendly and informative")
- `target_word_count` (integer, default 1200) - Target article length
- `is_active` (boolean, default true) - Whether style guide is currently active
- `is_default` (boolean, default false) - Default style guide for new articles
- `created_by` (UUID, foreign key to User, required)
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Belongs to User (creator)
- Has many Articles (articles using this style guide)

**Validation Rules**:
- Name required, unique
- System prompt required, min 50 characters
- Only one style guide can be `is_default = true` (enforce constraint)
- Target word count: 500-3000 words

**Database Constraints**:
- Unique index on `name`
- Unique partial index on `is_default` where `is_default = true`

**Query Patterns**:
- Fetch active style guides for selection
- Get default style guide for article generation

---

### User (Administrator)
Users who access the CMS to create and manage blog articles.

**Attributes**:
- `id` (UUID, primary key, from Supabase Auth)
- `email` (string, required, unique)
- `name` (string, optional) - Display name
- `role` (enum, default 'admin') - 'admin' | 'editor' (future: role-based permissions)
- `avatar_url` (string, optional)
- `last_login_at` (timestamp, optional)
- `created_at` (timestamp, auto)
- `updated_at` (timestamp, auto)

**Relationships**:
- Has many Articles (created articles)
- Has many StyleGuides (created style guides)

**Validation Rules**:
- Email required and valid format
- Email unique in system

**Authentication**:
- Managed by Supabase Auth
- JWT tokens for API authentication
- Row-level security policies enforce access control

**Row-Level Security Policies**:
- Users can read all articles
- Users can create/update/delete own articles
- Users can read all style guides
- Users can create/update/delete own style guides

---

## Join Tables / Associative Entities

### ArticleReviewReference
Tracks which reviews were used as source material for article generation.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `article_id` (UUID, foreign key to Article, required)
- `review_id` (UUID, foreign key to Review, required)
- `used_in_content` (boolean, default true) - Whether review quoted/referenced in article
- `created_at` (timestamp, auto)

**Indexes**:
- Composite unique index on (`article_id`, `review_id`)
- Index on `article_id`
- Index on `review_id`

---

### ArticleImageReference
Tracks which images are embedded in articles.

**Attributes**:
- `id` (UUID, primary key, auto-generated)
- `article_id` (UUID, foreign key to Article, required)
- `image_id` (UUID, foreign key to Image, required)
- `display_order` (integer, optional) - Order in article
- `created_at` (timestamp, auto)

**Indexes**:
- Composite unique index on (`article_id`, `image_id`)
- Index on `article_id`
- Index on `image_id`

---

## Database Schema Migrations

### Migration 001: Core Tables
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ships table
CREATE TABLE ships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL UNIQUE,
  cruise_line VARCHAR(200) NOT NULL,
  ship_class VARCHAR(100),
  year_built INTEGER CHECK (year_built >= 1900 AND year_built <= EXTRACT(YEAR FROM CURRENT_DATE)),
  capacity INTEGER CHECK (capacity > 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ships_cruise_line ON ships(cruise_line);

-- Topics table
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_topics_slug ON topics(slug);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  author_name VARCHAR(200),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(300),
  content TEXT NOT NULL CHECK (LENGTH(content) >= 10),
  review_date DATE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_ship_id ON reviews(ship_id);
CREATE INDEX idx_reviews_topic_id ON reviews(topic_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Images table
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  storage_path TEXT,
  caption TEXT,
  photographer_credit VARCHAR(200),
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type VARCHAR(50),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_images_ship_id ON images(ship_id);
CREATE INDEX idx_images_topic_id ON images(topic_id);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(200),
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  avatar_url TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Style guides table
CREATE TABLE style_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  system_prompt TEXT NOT NULL CHECK (LENGTH(system_prompt) >= 50),
  example_output TEXT,
  tone VARCHAR(100),
  target_word_count INTEGER DEFAULT 1200 CHECK (target_word_count BETWEEN 500 AND 3000),
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure only one default style guide
CREATE UNIQUE INDEX idx_style_guides_default ON style_guides(is_default) WHERE is_default = TRUE;

-- Articles table
CREATE TYPE article_status AS ENUM ('draft', 'generated', 'published', 'unpublished');
CREATE TYPE content_format AS ENUM ('html', 'markdown');

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ship_id UUID NOT NULL REFERENCES ships(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  content TEXT NOT NULL CHECK (LENGTH(content) >= 100),
  content_format content_format DEFAULT 'html',
  word_count INTEGER,
  status article_status NOT NULL DEFAULT 'draft',
  generated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  unpublished_at TIMESTAMP WITH TIME ZONE,
  style_guide_id UUID REFERENCES style_guides(id) ON DELETE SET NULL,
  generation_prompt TEXT,
  manual_edits_made BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_ship_id ON articles(ship_id);
CREATE INDEX idx_articles_topic_id ON articles(topic_id);
CREATE INDEX idx_articles_created_by ON articles(created_by);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- Article-Review join table
CREATE TABLE article_review_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  used_in_content BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, review_id)
);

CREATE INDEX idx_article_review_refs_article ON article_review_references(article_id);
CREATE INDEX idx_article_review_refs_review ON article_review_references(review_id);

-- Article-Image join table
CREATE TABLE article_image_references (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, image_id)
);

CREATE INDEX idx_article_image_refs_article ON article_image_references(article_id);
CREATE INDEX idx_article_image_refs_image ON article_image_references(image_id);

-- Trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_ships_updated_at BEFORE UPDATE ON ships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_style_guides_updated_at BEFORE UPDATE ON style_guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Migration 002: Row-Level Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE ships ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access to ships, topics (for article generation queries)
CREATE POLICY "Public read ships" ON ships FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);

-- Authenticated users (admins) can do everything with reviews, images
CREATE POLICY "Admins manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins manage images" ON images FOR ALL USING (auth.role() = 'authenticated');

-- Users can read own profile, admins can read all
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Style guides: read all, manage own
CREATE POLICY "Read all style guides" ON style_guides FOR SELECT USING (true);
CREATE POLICY "Create own style guides" ON style_guides FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Update own style guides" ON style_guides FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Delete own style guides" ON style_guides FOR DELETE USING (auth.uid() = created_by);

-- Articles: read all, manage own
CREATE POLICY "Read all articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Create own articles" ON articles FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Update own articles" ON articles FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Delete own articles" ON articles FOR DELETE USING (auth.uid() = created_by);
```

## TypeScript Type Definitions

```typescript
// Database types (generated from Supabase or manually defined)

export type ArticleStatus = 'draft' | 'generated' | 'published' | 'unpublished';
export type ContentFormat = 'html' | 'markdown';
export type UserRole = 'admin' | 'editor';

export interface Ship {
  id: string;
  name: string;
  cruise_line: string;
  ship_class?: string;
  year_built?: number;
  capacity?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  ship_id: string;
  topic_id?: string;
  author_name?: string;
  rating?: number;
  title?: string;
  content: string;
  review_date?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  ship_id: string;
  topic_id?: string;
  url: string;
  storage_path?: string;
  caption?: string;
  photographer_credit?: string;
  width?: number;
  height?: number;
  file_size?: number;
  mime_type?: string;
  upload_date: string;
  created_at: string;
  updated_at: string;
}

export interface StyleGuide {
  id: string;
  name: string;
  description?: string;
  system_prompt: string;
  example_output?: string;
  tone?: string;
  target_word_count: number;
  is_active: boolean;
  is_default: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  ship_id: string;
  topic_id: string;
  title: string;
  slug: string;
  content: string;
  content_format: ContentFormat;
  word_count?: number;
  status: ArticleStatus;
  generated_at?: string;
  published_at?: string;
  unpublished_at?: string;
  style_guide_id?: string;
  generation_prompt?: string;
  manual_edits_made: boolean;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar_url?: string;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface ArticleWithRelations extends Article {
  ship?: Ship;
  topic?: Topic;
  style_guide?: StyleGuide;
  reviews?: Review[];
  images?: Image[];
  author?: User;
}
```

---

## Query Examples

### Fetch content for article generation
```typescript
// Get ship with reviews and images for specific topic
const { data: ship } = await supabase
  .from('ships')
  .select(`
    *,
    reviews!inner(*, topic:topics(*)),
    images!inner(*, topic:topics(*))
  `)
  .eq('id', shipId)
  .eq('reviews.topic_id', topicId)
  .eq('images.topic_id', topicId)
  .single();
```

### Get published articles for static site
```typescript
const { data: articles } = await supabase
  .from('articles')
  .select(`
    *,
    ship:ships(*),
    topic:topics(*),
    images:article_image_references(image:images(*))
  `)
  .eq('status', 'published')
  .order('published_at', { ascending: false });
```

### Check for existing article (ship + topic combination)
```typescript
const { data: existing } = await supabase
  .from('articles')
  .select('id, status')
  .eq('ship_id', shipId)
  .eq('topic_id', topicId)
  .maybeSingle();
```

---

## Summary

Data model complete with:
- ✅ 8 core entities (Ship, Topic, Review, Image, Article, StyleGuide, User, 2 join tables)
- ✅ All attributes, types, and validation rules defined
- ✅ Relationships and foreign keys specified
- ✅ Database schema with migrations ready to execute
- ✅ Row-level security policies for access control
- ✅ TypeScript type definitions for type safety
- ✅ Query examples for common operations

Ready to proceed to API contract design.
