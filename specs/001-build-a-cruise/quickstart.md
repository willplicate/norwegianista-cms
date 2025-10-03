# Quickstart Guide
**Feature**: Cruise Blog CMS with AI Content Generation
**Date**: 2025-10-01

## Overview
This guide walks through setting up and validating the cruise blog CMS from scratch. Follow these steps to verify all functionality works end-to-end.

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Anthropic API key (Claude)
- Git

## Setup Steps

### 1. Environment Setup

```bash
# Clone repository (if applicable)
git clone <repository-url>
cd norwegianista

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-your-key

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or apply migrations manually from data-model.md
# Copy SQL from specs/001-build-a-cruise/data-model.md
# and run in Supabase SQL Editor
```

### 4. Seed Database

```bash
# Run seed script to populate initial data
npm run db:seed

# This creates:
# - Sample ships (3-5 cruise ships)
# - Topics (8 categories: Dining, Entertainment, etc.)
# - Reviews (20-30 reviews across ships/topics)
# - Images (15-20 images)
# - Default style guide
# - Test admin user
```

### 5. Start Development Server

```bash
# Start Next.js development server
npm run dev

# Server starts at http://localhost:3000
# API available at http://localhost:3000/api
```

### 6. Access Admin CMS

```bash
# Navigate to admin interface
open http://localhost:3000/admin

# Login with test credentials (from seed)
# Email: admin@norwegianista.com
# Password: (check seed output or .env)
```

## Validation Scenarios

### Scenario 1: View Ships and Topics

**Test**:
1. Navigate to http://localhost:3000/admin/ships
2. Verify ship list displays with:
   - Ship names
   - Cruise lines
   - Year built
   - Capacity
3. Click on a ship to view details
4. Navigate to http://localhost:3000/admin/topics
5. Verify all 8 topics are listed

**Expected**:
- ✅ Ships table populated with seed data
- ✅ Ship details page shows reviews and images count
- ✅ Topics list shows all categories with icons

---

### Scenario 2: Generate Article (Happy Path)

**Test**:
1. Navigate to http://localhost:3000/admin/articles/new
2. Select a ship from dropdown (e.g., "Norwegian Encore")
3. Select a topic (e.g., "Dining & Cuisine")
4. Click "Preview Content" to see available reviews/images
5. Verify reviews and images are displayed
6. Click "Generate Article"
7. Wait for generation (progress indicator should show)
8. Verify article appears with:
   - Auto-generated title (e.g., "Dining & Cuisine on Norwegian Encore")
   - ~1200 words of content
   - Embedded images
   - Quoted reviews
9. Review content quality and style adherence

**Expected**:
- ✅ Generation completes in 10-30 seconds
- ✅ Article contains approximately 1200 words
- ✅ Content incorporates reviews from database
- ✅ Images are embedded in article
- ✅ Writing style matches default style guide
- ✅ Article status = "generated"

---

### Scenario 3: Edit Generated Article

**Test**:
1. From generated article (Scenario 2), click "Edit"
2. Modify the title (e.g., add "The Ultimate Guide to")
3. Edit a paragraph in the rich-text editor
4. Add formatting (bold, italic, headings)
5. Insert an additional image from gallery
6. Click "Save Draft"
7. Verify changes are preserved
8. Refresh page and verify edits persisted

**Expected**:
- ✅ Rich-text editor loads with article content
- ✅ Title field is editable
- ✅ Text formatting works (bold, italic, headings, lists)
- ✅ Image insertion from gallery works
- ✅ Save updates `manual_edits_made = true`
- ✅ Changes persist after reload
- ✅ Version number increments

---

### Scenario 4: Preview Article

**Test**:
1. From edited article, click "Preview"
2. Verify preview modal/page shows:
   - Final formatted article
   - Hero image
   - Title
   - Byline (author, date, read time)
   - Full content with formatting
   - Embedded images
3. Check responsive design (resize browser)
4. Close preview

**Expected**:
- ✅ Preview renders article as it will appear on public site
- ✅ Images load correctly
- ✅ Formatting preserved (headings, lists, quotes)
- ✅ Layout matches design-system.md specifications
- ✅ Responsive on mobile/tablet/desktop

---

### Scenario 5: Publish Article to Static Site

**Test**:
1. From previewed article, click "Publish"
2. Confirm publish action in modal
3. Verify:
   - Article status changes to "published"
   - `published_at` timestamp set
   - Success notification appears
4. Navigate to public site: http://localhost:3000/blog/[article-slug]
5. Verify article appears on public site
6. Check homepage for article card in grid
7. Verify article URL is correct (slugified)

**Expected**:
- ✅ Article status = "published"
- ✅ Article visible at /blog/dining-cuisine-norwegian-encore
- ✅ Article appears in homepage article grid
- ✅ Article card shows thumbnail, title, excerpt
- ✅ Clicking card navigates to full article
- ✅ Static site generation triggered (if applicable)

---

### Scenario 6: Unpublish Article

**Test**:
1. From published article (Scenario 5), click "Unpublish"
2. Confirm unpublish action
3. Verify:
   - Article status changes to "unpublished"
   - `unpublished_at` timestamp set
4. Navigate to public site article URL
5. Verify article returns 404 or "Not Published" page
6. Check homepage - article should not appear in grid
7. Verify article still exists in CMS admin

**Expected**:
- ✅ Article status = "unpublished"
- ✅ Article removed from public site
- ✅ Article no longer in homepage grid
- ✅ Direct URL returns 404
- ✅ Article still accessible in admin CMS
- ✅ Can be re-published

---

### Scenario 7: Generate Article with Missing Content (Edge Case)

**Test**:
1. Navigate to http://localhost:3000/admin/articles/new
2. Select a ship + topic combination with NO reviews (manually ensure via Supabase)
3. Attempt to generate article
4. Verify warning appears: "No reviews found for this combination"
5. Confirm generation
6. Wait for generation
7. Verify article is generated but notes missing content

**Expected**:
- ✅ Warning modal displays before generation
- ✅ Generation proceeds despite warning
- ✅ Article generated without review quotes
- ✅ Article still ~1200 words (general content about topic)
- ✅ No broken references or errors

---

### Scenario 8: Manage Style Guides

**Test**:
1. Navigate to http://localhost:3000/admin/style-guides
2. View default style guide
3. Click "Create New Style Guide"
4. Fill in form:
   - Name: "Casual & Friendly"
   - Tone: "Conversational and approachable"
   - System Prompt: "Write in a casual, friendly tone as if chatting with a friend about cruise experiences. Use contractions, casual language, and personal anecdotes."
   - Target Word Count: 1000
5. Save style guide
6. Set as default (toggle switch)
7. Generate a new article
8. Verify new style guide is applied (tone is casual)

**Expected**:
- ✅ Style guide created successfully
- ✅ Style guide appears in list
- ✅ Can be set as default (replaces previous default)
- ✅ Articles generated with new guide use casual tone
- ✅ Word count target is ~1000 words

---

### Scenario 9: Delete Article

**Test**:
1. Navigate to article list in admin
2. Select an article (any status)
3. Click "Delete" (trash icon or button)
4. Confirm deletion in modal
5. Verify article removed from list
6. Check Supabase database - record should be deleted
7. If article was published, verify it's removed from public site

**Expected**:
- ✅ Confirmation modal appears before delete
- ✅ Article permanently deleted from database
- ✅ Article removed from admin list
- ✅ If published, removed from public site
- ✅ No orphaned data (cascade deletes work)

---

### Scenario 10: Concurrent Article Generation

**Test**:
1. Open two browser tabs to admin CMS
2. In Tab 1: Start generating Article A (Ship 1 + Topic 1)
3. Immediately in Tab 2: Start generating Article B (Ship 2 + Topic 2)
4. Monitor both generations
5. Verify both complete successfully
6. Check both articles have correct content (not mixed)

**Expected**:
- ✅ Both generation jobs run concurrently
- ✅ Both articles generate successfully
- ✅ No content mixing between articles
- ✅ Rate limiting respected (if applicable)
- ✅ Job queue handles multiple requests

---

### Scenario 11: Authentication & Authorization

**Test**:
1. Logout of admin CMS
2. Navigate to http://localhost:3000/admin
3. Verify redirect to login page
4. Attempt to access API directly: `curl http://localhost:3000/api/articles`
5. Verify 401 Unauthorized response
6. Login with admin credentials
7. Verify API requests now succeed

**Expected**:
- ✅ Unauthenticated users redirected to login
- ✅ API requires authentication (returns 401)
- ✅ After login, full admin access granted
- ✅ JWT token stored in browser
- ✅ Token included in API requests

---

### Scenario 12: Responsive Design Validation

**Test**:
1. Open public site homepage
2. Use browser dev tools to test responsive layouts:
   - Desktop (1920px)
   - Laptop (1280px)
   - Tablet (768px)
   - Mobile (375px)
3. Verify at each breakpoint:
   - Navigation collapses to hamburger menu (mobile)
   - Article grid adjusts (3 → 2 → 1 columns)
   - Hero section scales properly
   - Images remain properly sized
   - Text remains readable

**Expected**:
- ✅ Layout adapts smoothly at all breakpoints
- ✅ No horizontal scrolling on mobile
- ✅ Images scale correctly
- ✅ Navigation functional on mobile (hamburger menu)
- ✅ Cards stack vertically on mobile
- ✅ Text sizes appropriate for each screen

---

## Performance Validation

### Article Generation Performance
```bash
# Measure generation time
time curl -X POST http://localhost:3000/api/articles/generate \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ship_id": "uuid-here",
    "topic_id": "uuid-here"
  }'

# Expected: <30 seconds for 1200-word article
```

### API Response Times
```bash
# Test API endpoints
time curl http://localhost:3000/api/ships
time curl http://localhost:3000/api/topics
time curl http://localhost:3000/api/articles?status=published

# Expected: <200ms for read operations
```

### Database Query Performance
```sql
-- Run in Supabase SQL Editor
EXPLAIN ANALYZE
SELECT * FROM articles
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 20;

-- Verify indexes are used (no seq scans on large tables)
```

## Troubleshooting

### Generation Fails
- Check Anthropic API key is valid
- Verify API rate limits not exceeded
- Check Claude API status page
- Review generation_prompt in article record for debugging

### Images Not Displaying
- Verify Supabase Storage bucket is public
- Check CORS settings in Supabase
- Verify image URLs in database are accessible

### Authentication Issues
- Clear browser cookies/localStorage
- Check Supabase Auth settings (allowed domains)
- Verify JWT token expiration settings
- Check RLS policies in Supabase

### Slow Performance
- Check database indexes (see data-model.md)
- Enable query performance monitoring
- Review Next.js build for optimization
- Check Supabase connection pooling

## Success Criteria

✅ All 12 validation scenarios pass
✅ Article generation completes in <30 seconds
✅ API responses in <200ms
✅ Responsive design works on all breakpoints
✅ Authentication prevents unauthorized access
✅ Published articles appear on public site
✅ Admin CMS is intuitive and functional

## Next Steps

After quickstart validation:
1. Run full test suite: `npm test`
2. Run integration tests: `npm run test:integration`
3. Run E2E tests: `npm run test:e2e`
4. Review generated articles for quality
5. Tune style guide prompts if needed
6. Set up production deployment
7. Configure CI/CD pipeline
8. Set up monitoring and logging

---

**Quickstart Complete**
All core functionality validated and ready for development.
