# Research: Local Development CMS with Static Deployment

**Feature**: 002-update-cruise-blog
**Date**: 2025-10-03
**Status**: Complete

## Technical Decisions

### 1. Next.js Static Export Configuration

**Decision**: Use Next.js 15 with `output: 'export'` configuration

**Rationale**:
- Next.js App Router supports static export mode
- Generates pure HTML/CSS/JS files suitable for any hosting
- Maintains React component development experience
- Supports dynamic routes via `generateStaticParams`
- Image optimization works with static export

**Implementation**:
```typescript
// next.config.ts
const config = {
  output: 'export',
  images: {
    unoptimized: true // Required for static export
  }
}
```

**Alternatives Considered**:
- Gatsby: Rejected - more complex, slower builds, less active development
- Astro: Rejected - would require learning new framework
- Manual HTML generation: Rejected - loses component reusability

### 2. Local-Only Admin vs Static Public Pages

**Decision**: Use Next.js middleware and build-time filtering

**Rationale**:
- Admin pages protected by checking if running on localhost
- Static export only includes public pages (admin excluded)
- Single codebase, clear separation of concerns
- No authentication needed (local-only access)

**Implementation**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.hostname !== 'localhost') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}
```

**Alternatives Considered**:
- Separate admin app: Rejected - duplicates code, complex sync
- Environment variables: Rejected - still builds admin pages unnecessarily
- Basic auth on admin: Rejected - not needed for local-only use

### 3. Supabase Integration Strategy

**Decision**: Direct client-side Supabase calls for admin, pre-fetched data for static pages

**Rationale**:
- Admin (local): Real-time queries to Supabase from browser
- Public (static): Data fetched at build time, embedded in HTML
- Row Level Security (RLS) not needed (local access only)
- Supabase client library handles connection management

**Implementation**:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For static pages
export async function getStaticProps() {
  const { data } = await supabase.from('articles').select('*')
  return { props: { articles: data } }
}
```

**Alternatives Considered**:
- Server-side API: Rejected - adds unnecessary complexity
- GraphQL: Rejected - Supabase REST API sufficient
- Local database: Rejected - defeats cloud backup purpose

### 4. Claude API Integration

**Decision**: Use Anthropic SDK with streaming responses

**Rationale**:
- Official SDK provides type safety
- Streaming allows real-time preview during generation
- System prompts can encode style guides
- Temperature control for consistency

**Implementation**:
```typescript
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateArticle(prompt: string, styleGuide: string) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4',
    max_tokens: 4096,
    system: styleGuide,
    messages: [{ role: 'user', content: prompt }]
  })

  return stream
}
```

**Alternatives Considered**:
- OpenAI: Rejected - Claude better at following style guidelines
- Local LLM: Rejected - quality insufficient for 1200-word articles
- REST API: Rejected - SDK provides better streaming support

### 5. Deployment Strategy

**Decision**: rsync over SSH with sshpass for automation

**Rationale**:
- Works with any shared hosting (FTP/SSH)
- Preserves file permissions and timestamps
- Incremental uploads (only changed files)
- Can be automated via npm script

**Implementation**:
```bash
# scripts/deploy.sh
#!/bin/bash

# Build static site
npm run build

# Deploy to shared hosting
sshpass -p "$SSH_PASSWORD" rsync -avz --delete \
  -e "ssh -p $SSH_PORT -o StrictHostKeyChecking=no" \
  out/ $SSH_USER@$SSH_HOST:$SSH_PATH/
```

**Alternatives Considered**:
- FTP: Rejected - slower, no incremental uploads
- Git deployment: Rejected - shared hosting doesn't support
- Vercel/Netlify: Rejected - user wants existing hosting

### 6. Disaster Recovery Architecture

**Decision**: GitHub for code + Supabase for data + README for setup

**Rationale**:
- GitHub free tier sufficient for private repo
- Supabase hosted in cloud (AWS) with automated backups
- Comprehensive README enables setup on new machine
- .env.example documents required environment variables

**Implementation**:
- Private GitHub repository with all code
- .gitignore excludes .env, node_modules, out/
- .env.example lists all required secrets
- README.md includes step-by-step setup guide
- Supabase connection string in environment variables only

**Alternatives Considered**:
- GitLab/Bitbucket: Rejected - GitHub more familiar
- Self-hosted Git: Rejected - defeats cloud backup purpose
- Dropbox/Drive: Rejected - no version control

### 7. Testing Strategy

**Decision**: Vitest for unit, Playwright for E2E, no contract tests needed

**Rationale**:
- Vitest: Fast, TypeScript native, works with React components
- Playwright: Tests admin workflow and static site generation
- No backend API = no need for contract tests
- Focus on critical paths: generation, preview, deploy

**Test Coverage Goals**:
- Unit: Supabase client, Claude client, utilities (80%+)
- Integration: Article generation flow (100%)
- E2E: Admin workflow end-to-end (happy path + errors)

**Alternatives Considered**:
- Jest: Rejected - Vitest faster and better for Vite/Next.js
- Cypress: Rejected - Playwright more modern
- No tests: Rejected - too risky for data/deployment operations

## Resolved Unknowns

All technical context items were specified - no NEEDS CLARIFICATION items to resolve.

**Confirmed Technical Stack**:
- ✅ Next.js 15 with App Router and static export
- ✅ React 19 with TypeScript 5
- ✅ Supabase (PostgreSQL) for database
- ✅ Anthropic Claude API for content generation
- ✅ Vitest + Playwright for testing
- ✅ rsync deployment to shared hosting
- ✅ GitHub for version control and disaster recovery

## Key Implementation Notes

1. **Environment Variables Required**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `SSH_USER`, `SSH_HOST`, `SSH_PORT`, `SSH_PATH`, `SSH_PASSWORD` (for deployment)

2. **Build Process**:
   - Development: `npm run dev` (runs on localhost with admin access)
   - Production: `npm run build` (generates static site in `out/` folder)
   - Deploy: `npm run deploy` (uploads `out/` to hosting)

3. **Data Flow**:
   - Admin queries Supabase → displays ships/reviews
   - Admin selects content → sends to Claude API
   - Claude generates article → displays in preview
   - Admin edits/approves → saves to Supabase
   - Build command fetches all published articles → generates static pages
   - Deploy command uploads static pages to hosting

4. **Constraints Addressed**:
   - ✅ No server-side Node.js on production (static HTML only)
   - ✅ Works on shared hosting (standard HTML/CSS/JS)
   - ✅ Single admin user (localhost-only admin interface)
   - ✅ Disaster recovery (GitHub + cloud database)
   - ✅ Fast page loads (static files, optimized builds)

## References

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Anthropic SDK](https://docs.anthropic.com/en/api/client-sdks)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
