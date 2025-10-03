
# Implementation Plan: Local Development CMS with Static Deployment

**Branch**: `002-update-cruise-blog` | **Date**: 2025-10-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-update-cruise-blog/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a cruise blog CMS that runs locally on admin's laptop for content generation, then deploys static HTML to shared hosting. Admin queries Supabase database for ship reviews/images, uses Claude API to generate 1200-word articles following style guides, previews/edits content, and publishes as optimized static site. All code backed up to GitHub for disaster recovery.

## Technical Context
**Language/Version**: TypeScript 5.x, Node.js 20.x
**Primary Dependencies**: Next.js 15 (static export mode), React 19, Supabase JS client, Anthropic SDK
**Storage**: Supabase (PostgreSQL cloud), Static file output for deployment
**Testing**: Vitest for unit tests, Playwright for integration tests
**Target Platform**: macOS/Windows for development, static HTML for production (shared hosting)
**Project Type**: Web application (local admin + static public site)
**Performance Goals**: Static site <1s page load, admin UI responsive (<100ms interactions)
**Constraints**: No server-side Node.js on production, works on shared hosting, single admin user
**Scale/Scope**: ~50-100 cruise ships, ~500 reviews, unlimited generated articles, deployment via FTP/rsync

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS (No constitution defined yet - project in initial setup phase)

**Constitutional Principles** (to be defined):
- TBD: Library-first architecture approach
- TBD: Test-driven development practices
- TBD: Code organization standards
- TBD: Documentation requirements

**Current Alignment**:
- ✅ Simple architecture: Local dev → static deployment
- ✅ Clear separation: Admin (local) vs Public (static)
- ✅ Disaster recovery via GitHub + cloud database
- ✅ No unnecessary complexity added

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
frontend/                      # Next.js application (runs locally)
├── app/                      # Next.js 15 app router
│   ├── admin/               # Admin CMS interface (local only)
│   │   ├── ships/          # Ship management
│   │   ├── reviews/        # Review management
│   │   ├── generate/       # Article generation UI
│   │   └── deploy/         # Deployment interface
│   ├── (public)/           # Public blog pages (static export)
│   │   ├── page.tsx       # Homepage
│   │   ├── [slug]/        # Article pages
│   │   └── ships/         # Ship listing
│   └── api/               # API routes (local dev only)
│       ├── supabase/      # Database queries
│       └── claude/        # AI generation
├── components/            # Shared React components
├── lib/                   # Utilities and helpers
│   ├── supabase.ts       # Supabase client
│   ├── claude.ts         # Claude API client
│   └── deploy.ts         # Deployment scripts
├── public/               # Static assets
└── tests/
    ├── unit/            # Component tests
    ├── integration/     # API integration tests
    └── e2e/            # End-to-end tests

scripts/
├── deploy.sh            # Deploy static site to hosting
├── db-setup.sql        # Supabase schema setup
└── seed-data.ts        # Sample data for testing
```

**Structure Decision**: Web application structure with Next.js App Router. Admin interface and public pages coexist in same app - admin routes only work locally (localhost), public pages export to static HTML for deployment.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Setup & Configuration** (5 tasks)
   - Next.js config for static export
   - Environment setup (.env, secrets)
   - Database schema deployment
   - Supabase/Claude client setup
   - GitHub repository initialization

2. **Data Layer** (6 tasks)
   - Database schema SQL execution [P]
   - TypeScript types from schema [P]
   - Supabase client utilities [P]
   - Sample data seed script
   - Database migration helpers
   - Data validation utilities

3. **Admin UI Components** (8 tasks)
   - Ship list/detail pages
   - Review display components
   - Article generation interface
   - Rich text editor integration
   - Image selector component
   - Draft/publish controls
   - Deployment dashboard
   - Style guide editor

4. **Article Generation** (4 tasks)
   - Claude API integration
   - Prompt engineering utilities
   - Streaming response handler
   - Article preview component

5. **Static Export** (3 tasks)
   - Public page templates
   - Build-time data fetching
   - Static asset optimization

6. **Deployment** (3 tasks)
   - rsync deployment script
   - Dry-run validation
   - Error handling & rollback

7. **Testing** (5 tasks)
   - Unit tests for utilities
   - Integration tests for API routes
   - E2E tests for admin workflow
   - Static build validation
   - Performance benchmarks

8. **Documentation** (2 tasks)
   - README with disaster recovery
   - Deployment guide

**Ordering Strategy**:
- Phase-based: Setup → Data → UI → Generation → Export → Deploy → Test → Docs
- TDD where applicable: Write tests → implement features
- Mark [P] for parallelizable tasks (independent implementations)
- Dependencies: Database before UI, UI before E2E tests

**Estimated Output**: ~36 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented (None - simple architecture) ✅

**Artifacts Generated**:
- [x] research.md - Technical decisions and stack validation ✅
- [x] data-model.md - Database schema and relationships ✅
- [x] contracts/api-spec.yaml - API contract specification ✅
- [x] quickstart.md - Validation and testing guide ✅
- [x] CLAUDE.md - Agent context updated ✅

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
