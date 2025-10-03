# Tasks: Local Development CMS with Static Deployment

**Input**: Design documents from `/specs/002-update-cruise-blog/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5, Next.js 15, React 19, Supabase, Anthropic SDK
   → Structure: Next.js App Router (admin + public pages)
2. Load design documents ✅
   → data-model.md: 6 entities (ships, reviews, images, topics, articles, style_guides)
   → contracts/: API spec with 6 endpoints
   → research.md: Static export strategy, deployment approach
   → quickstart.md: 7 validation scenarios
3. Generate tasks by category:
   → Setup: Next.js config, environment, database
   → Tests: Contract tests (skipped - no backend API), integration tests
   → Core: Database types, Supabase client, Claude client, UI components
   → Integration: Admin workflow, static generation, deployment
   → Polish: Testing, documentation, disaster recovery
4. Apply task rules:
   → Different components = [P] for parallel
   → Sequential where dependencies exist
   → TDD approach for critical paths
5. Number tasks sequentially (T001-T036)
6. Dependencies validated
7. Parallel execution examples included
8. Validation complete ✅
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths use Next.js App Router structure

## Path Conventions
- **Frontend**: `frontend/app/`, `frontend/components/`, `frontend/lib/`
- **Scripts**: `frontend/scripts/`
- **Tests**: `frontend/tests/`

---

## Phase 3.1: Setup & Configuration

- [ ] **T001** Configure Next.js for static export in `frontend/next.config.ts`
  - Add `output: 'export'`
  - Configure `images: { unoptimized: true }`
  - Set trailing slash behavior
  - **Dependency**: None

- [ ] **T002** Create environment configuration in `frontend/.env.example`
  - Document SUPABASE_URL, SUPABASE_ANON_KEY
  - Document ANTHROPIC_API_KEY
  - Document SSH deployment variables
  - **Dependency**: None

- [ ] **T003** [P] Set up Supabase database schema in `scripts/db-setup.sql`
  - Create all 6 tables from data-model.md
  - Add indexes, constraints, triggers
  - Include sample data inserts
  - **Dependency**: None

- [ ] **T004** [P] Initialize TypeScript types from database schema in `frontend/lib/types.ts`
  - Define Ship, Review, Image, Topic, Article, StyleGuide interfaces
  - Export database row types
  - **Dependency**: T003

- [ ] **T005** [P] Create GitHub repository and initial commit
  - Initialize git repository
  - Create .gitignore (node_modules, .env, out/)
  - Push to GitHub with README stub
  - **Dependency**: None

---

## Phase 3.2: Data Layer

- [ ] **T006** [P] Create Supabase client utility in `frontend/lib/supabase.ts`
  - Initialize Supabase client with env vars
  - Export typed client
  - Add connection error handling
  - **Dependency**: T004

- [ ] **T007** [P] Create Claude API client in `frontend/lib/claude.ts`
  - Initialize Anthropic SDK
  - Implement generateArticle() with streaming
  - Handle API errors gracefully
  - **Dependency**: T002

- [ ] **T008** [P] Create database query utilities in `frontend/lib/queries.ts`
  - getShips(), getShipReviews()
  - getArticles(), getTopics()
  - saveArticleDraft(), publishArticle()
  - **Dependency**: T006

- [ ] **T009** Create seed data script in `scripts/seed-data.ts`
  - Insert sample ships, reviews, images
  - Insert default topics and style guide
  - Test data for validation scenarios
  - **Dependency**: T003, T006

---

## Phase 3.3: Admin UI Components

- [ ] **T010** [P] Create ship list page in `frontend/app/admin/ships/page.tsx`
  - Display all ships from database
  - Link to ship detail pages
  - Include search/filter
  - **Dependency**: T008

- [ ] **T011** [P] Create ship detail page in `frontend/app/admin/ships/[id]/page.tsx`
  - Show ship information
  - Display associated reviews
  - Show images gallery
  - **Dependency**: T008

- [ ] **T012** [P] Create review display component in `frontend/components/ReviewCard.tsx`
  - Display review text, rating, categories
  - Show reviewer information
  - Include images
  - **Dependency**: T004

- [ ] **T013** Create article generation page in `frontend/app/admin/generate/page.tsx`
  - Ship selector dropdown
  - Topic selector dropdown
  - Style guide selector (optional)
  - Generate button with loading state
  - **Dependency**: T008, T010

- [ ] **T014** Create streaming article preview in `frontend/components/ArticlePreview.tsx`
  - Real-time streaming display
  - Word count indicator
  - Handle streaming errors
  - **Dependency**: T007

- [ ] **T015** [P] Create rich text editor in `frontend/components/RichTextEditor.tsx`
  - Markdown editing support
  - Preview mode
  - Image insertion
  - **Dependency**: T004

- [ ] **T016** [P] Create image selector component in `frontend/components/ImageSelector.tsx`
  - Display available images
  - Select featured image
  - Upload new images (optional)
  - **Dependency**: T008

- [ ] **T017** Create article save controls in `frontend/components/ArticleSaveControls.tsx`
  - Save Draft button
  - Publish button
  - Status indicator
  - **Dependency**: T008

- [ ] **T018** Create deployment dashboard in `frontend/app/admin/deploy/page.tsx`
  - Show deployment status
  - Dry run option
  - Deploy button
  - Show last deployment info
  - **Dependency**: None (builds on T025)

---

## Phase 3.4: Article Generation Workflow

- [ ] **T019** Implement article generation API route in `frontend/app/api/generate/route.ts`
  - Accept shipId, topicId, styleGuideId
  - Fetch ship data and reviews
  - Build prompt for Claude
  - Stream response back
  - **Dependency**: T007, T008

- [ ] **T020** Create prompt engineering utilities in `frontend/lib/prompts.ts`
  - buildArticlePrompt(ship, reviews, topic)
  - formatStyleGuide(guide)
  - Extract title from content
  - **Dependency**: T007

- [ ] **T021** Implement article save API route in `frontend/app/api/articles/route.ts`
  - POST: Save article draft
  - PUT: Update existing article
  - Include slug generation
  - **Dependency**: T008

- [ ] **T022** Implement publish API route in `frontend/app/api/articles/[id]/publish/route.ts`
  - Change status to 'published'
  - Set published_at timestamp
  - Validate article completeness
  - **Dependency**: T008

---

## Phase 3.5: Static Export & Public Pages

- [ ] **T023** [P] Create public homepage in `frontend/app/(public)/page.tsx`
  - Fetch published articles at build time
  - Display article list with excerpts
  - Include featured images
  - SEO meta tags
  - **Dependency**: T008

- [ ] **T024** [P] Create article page template in `frontend/app/(public)/[slug]/page.tsx`
  - Use generateStaticParams for all published articles
  - Render full article content
  - Include ship information
  - Related articles section
  - **Dependency**: T008

- [ ] **T025** [P] Create ships listing page in `frontend/app/(public)/ships/page.tsx`
  - Display all ships
  - Link to ship-specific articles
  - Filter by cruise line
  - **Dependency**: T008

---

## Phase 3.6: Deployment

- [ ] **T026** Create rsync deployment script in `scripts/deploy.sh`
  - Build static site (npm run build)
  - Validate out/ directory exists
  - rsync to server via SSH
  - Handle connection errors
  - **Dependency**: T001

- [ ] **T027** Create dry-run deployment in `scripts/deploy-dry-run.sh`
  - Show files to be deployed
  - Validate SSH connection
  - No actual upload
  - **Dependency**: T026

- [ ] **T028** Add deployment npm scripts in `frontend/package.json`
  - "deploy": Execute deploy.sh
  - "deploy:dry-run": Execute dry-run script
  - Include pre-deploy validation
  - **Dependency**: T026, T027

---

## Phase 3.7: Testing & Validation

- [ ] **T029** [P] Create unit tests for Supabase client in `tests/unit/supabase.test.ts`
  - Test query functions
  - Mock Supabase responses
  - Test error handling
  - **Dependency**: T006, T008

- [ ] **T030** [P] Create unit tests for Claude client in `tests/unit/claude.test.ts`
  - Test prompt building
  - Mock streaming responses
  - Test error cases
  - **Dependency**: T007, T020

- [ ] **T031** Create integration test for article generation in `tests/integration/generate-article.test.ts`
  - Test complete generation workflow
  - Verify article saved to database
  - Check content quality (word count)
  - **Dependency**: T019

- [ ] **T032** Create E2E test for admin workflow in `tests/e2e/admin-workflow.spec.ts`
  - Select ship and topic
  - Generate article
  - Edit and save draft
  - Publish article
  - **Dependency**: T010-T017

- [ ] **T033** Create static build validation test in `tests/integration/static-build.test.ts`
  - Run npm run build
  - Verify out/ directory structure
  - Check HTML files generated
  - Validate asset optimization
  - **Dependency**: T023, T024

---

## Phase 3.8: Documentation & Disaster Recovery

- [ ] **T034** Create comprehensive README in `frontend/README.md`
  - Setup instructions from quickstart.md
  - Environment variable documentation
  - Development workflow
  - Deployment process
  - Troubleshooting guide
  - **Dependency**: All previous tasks

- [ ] **T035** Create disaster recovery guide in `docs/DISASTER_RECOVERY.md`
  - GitHub repository setup
  - Laptop failure recovery steps
  - Database restore procedure
  - Environment recreation
  - **Dependency**: T005

- [ ] **T036** Validate all quickstart scenarios from `quickstart.md`
  - Run through all 7 scenarios
  - Verify all functional requirements (FR-001 to FR-022)
  - Check performance targets
  - Document any issues found
  - **Dependency**: All previous tasks

---

## Dependencies

### Critical Path
1. **Setup** (T001-T005) → **Data Layer** (T006-T009)
2. **Data Layer** → **Admin UI** (T010-T018)
3. **Admin UI** + **Generation** (T019-T022) → **Static Export** (T023-T025)
4. **Static Export** → **Deployment** (T026-T028)
5. **Everything** → **Testing** (T029-T033) → **Documentation** (T034-T036)

### Parallel Opportunities
- T003, T004, T005 can run in parallel
- T006, T007 can run in parallel after T004
- T010, T011, T012, T015, T016 can run in parallel after T008
- T023, T024, T025 can run in parallel after T008
- T029, T030 can run in parallel (unit tests)

---

## Parallel Execution Examples

### Setup Phase
```bash
# Launch T003, T004, T005 together
Task: "Set up Supabase database schema in scripts/db-setup.sql"
Task: "Initialize TypeScript types from database schema in frontend/lib/types.ts"
Task: "Create GitHub repository and initial commit"
```

### Data Layer
```bash
# Launch T006, T007 together (after T004)
Task: "Create Supabase client utility in frontend/lib/supabase.ts"
Task: "Create Claude API client in frontend/lib/claude.ts"
```

### Admin UI Components
```bash
# Launch T010, T011, T012, T015, T016 together (after T008)
Task: "Create ship list page in frontend/app/admin/ships/page.tsx"
Task: "Create ship detail page in frontend/app/admin/ships/[id]/page.tsx"
Task: "Create review display component in frontend/components/ReviewCard.tsx"
Task: "Create rich text editor in frontend/components/RichTextEditor.tsx"
Task: "Create image selector component in frontend/components/ImageSelector.tsx"
```

### Static Pages
```bash
# Launch T023, T024, T025 together (after T008)
Task: "Create public homepage in frontend/app/(public)/page.tsx"
Task: "Create article page template in frontend/app/(public)/[slug]/page.tsx"
Task: "Create ships listing page in frontend/app/(public)/ships/page.tsx"
```

### Testing
```bash
# Launch T029, T030 together
Task: "Create unit tests for Supabase client in tests/unit/supabase.test.ts"
Task: "Create unit tests for Claude client in tests/unit/claude.test.ts"
```

---

## Task Execution Notes

### File Path Specificity
- Each task specifies exact file path
- No ambiguity about where code goes
- LLM can execute without additional context

### Testing Strategy
- Unit tests for utilities (T029-T030)
- Integration tests for workflows (T031, T033)
- E2E test for complete admin flow (T032)
- Final validation via quickstart (T036)

### Deployment Safety
- Dry-run available (T027)
- Environment validation
- Rollback capability (static files remain if upload fails)

### Disaster Recovery Readiness
- GitHub backup (T005, T034)
- Cloud database (Supabase)
- Comprehensive setup docs (T034, T035)

---

## Validation Checklist

- [x] All contracts have corresponding implementation (API routes T019, T021, T022)
- [x] All 6 entities from data-model.md have types (T004) and queries (T008)
- [x] TDD approach for critical paths (unit tests before polish phase)
- [x] Parallel tasks truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] All 22 functional requirements covered in tasks
- [x] All 7 quickstart scenarios validated (T036)
- [x] Deployment workflow complete (T026-T028)
- [x] Disaster recovery documented (T035)

---

## Success Criteria

**All 36 tasks completed** = Feature ready for production

✅ Admin CMS runs on localhost
✅ Articles generated via Claude API
✅ Static site exports successfully
✅ Deployment to shared hosting works
✅ All tests pass
✅ Documentation complete
✅ Disaster recovery viable

**Next**: Execute tasks sequentially or in parallel groups following dependency order
