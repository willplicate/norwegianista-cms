# Research & Technical Decisions
**Feature**: Cruise Blog CMS with AI Content Generation
**Date**: 2025-10-01

## Technology Stack Selection

### Language & Runtime
**Decision**: TypeScript with Node.js 20+

**Rationale**:
- Unified language across frontend and backend reduces context switching
- Excellent Supabase SDK support with TypeScript types
- Anthropic Claude SDK has official TypeScript support
- Rich ecosystem for web applications and static site generation
- Strong typing helps catch errors early with complex API interactions

**Alternatives Considered**:
- Python: Good AI/ML library support but would split stack (Python backend + JS frontend)
- Go: Fast but less mature ecosystem for Supabase/Claude integrations

### Backend Framework
**Decision**: Next.js API Routes (or standalone Express.js if separation preferred)

**Rationale**:
- Next.js provides unified full-stack framework with API routes
- Built-in TypeScript support and excellent developer experience
- Can also serve frontend, simplifying deployment
- If strict separation desired, Express.js is lightweight alternative

**Alternatives Considered**:
- Fastify: Faster but Next.js integration benefits outweigh raw performance needs
- NestJS: More structure but overkill for this scope

### Frontend Framework
**Decision**: Next.js 14+ with React

**Rationale**:
- Modern React framework with App Router for intuitive routing
- Server components can reduce client bundle size
- Built-in optimization for images (important for cruise image galleries)
- Can export static site easily if CMS becomes static admin tool

**Alternatives Considered**:
- SvelteKit: Lighter but smaller ecosystem for admin UI components
- Remix: Good alternative but Next.js has broader adoption

### Rich-Text Editor
**Decision**: Tiptap (or Lexical as alternative)

**Rationale**:
- Modern, headless editor with React integration
- Extensible with custom nodes for embedding images/reviews
- Good TypeScript support
- Active development and community

**Alternatives Considered**:
- Quill: Older but stable, less flexible for custom content
- Draft.js: Meta-maintained but development slowed
- Lexical: Meta's modern editor, good alternative if Tiptap insufficient

### Database & Authentication
**Decision**: Supabase (as specified in requirements)

**Rationale**:
- Requirement specified Supabase for reviews and images
- Provides PostgreSQL database with real-time subscriptions
- Built-in authentication (resolves FR-010 authentication requirement)
- Row-level security for admin access control
- File storage for images with CDN

**Implementation Notes**:
- Use Supabase Auth for admin authentication
- Row-level security policies to restrict CMS access to authenticated admins
- Database tables: ships, topics, reviews, images, articles, style_guides
- Supabase Storage for image hosting with public URLs

### AI Content Generation
**Decision**: Anthropic Claude API (Claude 3.5 Sonnet or Opus)

**Rationale**:
- Requirement specified Claude API
- Excellent long-form content generation (~1200 words)
- Strong instruction following for style guide adherence
- 200K context window can incorporate many reviews/images

**Implementation Notes**:
- Use system prompt containing configurable style guide
- Include relevant reviews and image descriptions in user prompt
- Target 1200 words with explicit instruction
- Rate limiting: implement queue for generation requests
- Cost consideration: ~$15 per 1M tokens (Sonnet), estimate $0.10-0.30 per article

### Static Site Generation
**Decision**: Next.js Static Export (or Astro as alternative)

**Rationale**:
- Next.js can generate static HTML from published articles
- Markdown/MDX for article storage enables various SSG options
- Can deploy to Vercel, Netlify, or any static host
- If separation desired, Astro excels at content-focused static sites

**Alternatives Considered**:
- Gatsby: Older, slower build times
- Hugo: Fast but Go templates less flexible
- 11ty: Good but smaller ecosystem

**Implementation Notes**:
- Articles stored as Markdown in Supabase or filesystem
- Publish action triggers static site rebuild
- Unpublish removes article file and rebuilds
- Can use incremental static regeneration for faster builds

### Testing Framework
**Decision**: Vitest + React Testing Library + Playwright

**Rationale**:
- Vitest: Fast, Vite-native test runner with Jest-compatible API
- React Testing Library: User-centric component testing
- Playwright: Reliable E2E testing across browsers

**Test Strategy**:
- Contract tests: Validate API request/response schemas with Zod
- Integration tests: Test article generation flow end-to-end with mocked APIs
- Unit tests: Services (ArticleGenerator, ContentRetriever) and utilities
- E2E tests: Critical user journeys (create article, edit, publish)

## Architectural Patterns

### API Design
**Decision**: RESTful JSON API with typed contracts

**Endpoints**:
- `GET /api/ships` - List all ships
- `GET /api/topics` - List all topics
- `GET /api/reviews?ship_id=X&topic_id=Y` - Get reviews for ship/topic
- `GET /api/images?ship_id=X&topic_id=Y` - Get images for ship/topic
- `POST /api/articles/generate` - Generate article (async, returns job ID)
- `GET /api/articles/:id` - Get article by ID
- `PUT /api/articles/:id` - Update article content
- `POST /api/articles/:id/publish` - Publish article to static site
- `POST /api/articles/:id/unpublish` - Unpublish article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/style-guides` - Get style guide configuration
- `PUT /api/style-guides` - Update style guide

### Article Generation Flow
**Pattern**: Asynchronous job processing

**Rationale**:
- Claude API calls can take 10-30 seconds for 1200-word articles
- Async pattern prevents HTTP timeout and improves UX
- Allows progress tracking and cancellation

**Implementation**:
1. Admin submits generation request (ship + topic)
2. API creates job record in database with status "pending"
3. Background worker fetches reviews/images from Supabase
4. Worker calls Claude API with style guide + content
5. Worker saves generated article to database with status "generated"
6. Frontend polls job status and displays preview when complete

**Alternatives**:
- Webhooks: More complex, polling acceptable for admin tool
- Server-Sent Events: Good alternative for real-time updates

### State Management
**Decision**: React Context + Server State Management (TanStack Query)

**Rationale**:
- Context for global UI state (selected ship/topic, current article)
- TanStack Query for server state (caching, refetching, optimistic updates)
- Avoids Redux complexity for this scope

### Static Site Publishing
**Pattern**: Build trigger on publish action

**Implementation**:
1. Admin publishes article in CMS
2. Article marked "published" in database
3. Trigger static site rebuild via webhook or CI/CD
4. Static site queries published articles from Supabase
5. Generates HTML pages with article content
6. Deploys to CDN/hosting platform

**Alternative**: File-based - write Markdown files on publish, commit to Git, CI builds

## Performance Considerations

### Claude API Rate Limits
- Anthropic rate limits: ~50 requests/min (tier 1), ~1000 requests/min (tier 2)
- Implementation: Request queue with rate limiting
- Estimated need: <10 articles/hour for admin use case = well within limits

### Supabase Free Tier Limits
- 500MB database storage
- 1GB file storage
- 50,000 monthly active users
- Adequate for MVP, may need upgrade at scale

### Caching Strategy
- Cache ship/topic lists (rarely change)
- Cache style guide (fetch once per session)
- No caching for article generation (always fresh)
- Cache published articles on static site (CDN)

## Security Considerations

### Authentication & Authorization
- Supabase Auth for admin login (email/password or magic link)
- JWT tokens for API authentication
- Row-level security policies in Supabase
- No public API endpoints (all require authentication)

### API Key Management
- Claude API key stored in environment variables
- Never exposed to frontend
- Server-side only access

### Content Safety
- Input validation on ship/topic selection (ensure IDs exist)
- Sanitize HTML from rich-text editor before storage
- Rate limiting on generation endpoint to prevent abuse
- CORS configured to only allow frontend origin

## Development Workflow

### Local Development Setup
1. Node.js 20+ installed
2. Supabase project created (or local Supabase instance)
3. Environment variables configured (.env.local):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `ANTHROPIC_API_KEY`
4. Database migrations applied
5. Seed data loaded (sample ships, topics, reviews, images)
6. `npm run dev` to start Next.js dev server

### Database Schema Migration
- Use Supabase migrations for schema changes
- Version-controlled SQL files
- Applied via Supabase CLI or dashboard

### Deployment
- Frontend + Backend: Deploy Next.js to Vercel (or Docker container)
- Static Site: Separate deployment (Netlify, Vercel, or S3+CloudFront)
- Database: Supabase hosted
- CI/CD: GitHub Actions for automated testing and deployment

## Risk Mitigation

### Claude API Availability
**Risk**: API downtime prevents article generation
**Mitigation**: Graceful error handling, retry logic, manual editing fallback

### Claude API Costs
**Risk**: Unexpected high usage increases costs
**Mitigation**: Usage tracking, rate limiting, cost alerts

### Static Site Build Failures
**Risk**: Build fails, published articles don't appear
**Mitigation**: Build status monitoring, rollback capability, manual republish

### Image Storage Limits
**Risk**: Supabase storage fills up
**Mitigation**: Monitor storage usage, implement cleanup for unused images, upgrade plan

## Open Questions Resolved

### Q: Authentication method for admins?
**A**: Supabase Auth with email/password or magic link

### Q: Static site deployment mechanism?
**A**: Webhook/CI trigger on publish → static site rebuild → deploy to CDN

### Q: Database schema for reviews/images/topics?
**A**: See data-model.md (Phase 1 output)

### Q: How to handle concurrent editing?
**A**: Optimistic locking with version numbers or "last write wins" for MVP (complex conflict resolution deferred)

### Q: Article word count enforcement?
**A**: Target guideline (1200 words) in Claude prompt, not strict validation (allow ±20% variance)

### Q: API rate limiting strategy?
**A**: Simple in-memory queue for MVP, Redis-based queue for production scale

## Summary

All NEEDS CLARIFICATION items from Technical Context resolved:
- ✅ Language: TypeScript + Node.js 20+
- ✅ Testing: Vitest + React Testing Library + Playwright
- ✅ Authentication: Supabase Auth
- ✅ Static site publishing: Webhook-triggered rebuild with Next.js static export or Astro

Technology stack selected prioritizes:
1. Type safety (TypeScript across stack)
2. Developer experience (Next.js unified framework)
3. Existing service integration (Supabase, Claude API)
4. Deployment simplicity (Vercel or similar platforms)
5. Cost efficiency (free tiers for MVP)

Ready to proceed to Phase 1: Design & Contracts.
