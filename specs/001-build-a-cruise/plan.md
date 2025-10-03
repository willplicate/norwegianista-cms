
# Implementation Plan: Cruise Blog CMS with AI Content Generation

**Branch**: `001-build-a-cruise` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-build-a-cruise/spec.md`

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
Build a CMS that enables administrators to generate cruise blog articles by combining Supabase database content (reviews, images) with Claude AI-generated prose (~1200 words). Admins select ship + topic, preview/edit generated content, and publish to a static site. The system includes configurable editorial style guides, rich-text editing, and article lifecycle management (publish/unpublish/delete).

## Technical Context
**Language/Version**: NEEDS CLARIFICATION (likely Node.js/TypeScript or Python)
**Primary Dependencies**: Supabase SDK, Anthropic Claude API, Rich-text editor library, Static site generator
**Storage**: Supabase (PostgreSQL-based) - reviews, images, articles, style guides, ships, topics
**Testing**: NEEDS CLARIFICATION (depends on language choice - Jest/Vitest for JS/TS, pytest for Python)
**Target Platform**: Web application (admin CMS) + static site deployment
**Project Type**: web (backend API + frontend CMS interface)
**Performance Goals**: Claude API response <30s for article generation, UI responsiveness <200ms for interactions
**Constraints**: Claude API rate limits, Supabase free tier considerations, static site build time acceptable (minutes)
**Scale/Scope**: Single/small team of admins, moderate article volume (~10-100 articles/month), database ~1000s of reviews/images

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: Constitution file contains template placeholders. Applying standard development principles:

- ✅ **Modularity**: Separate concerns (data access, AI generation, CMS UI, static site publishing)
- ✅ **Testing**: Contract tests for API, integration tests for user flows, unit tests for business logic
- ✅ **Simplicity**: Use existing services (Supabase, Claude API) rather than building from scratch
- ✅ **Documentation**: Clear API contracts, data model documentation, quickstart guide
- ⚠️ **External Dependencies**: Multiple third-party services (Supabase, Claude API, static site platform) - acceptable for MVP given requirements

**Initial Assessment**: PASS with notes on external dependency management

## Project Structure

### Documentation (this feature)
```
specs/001-build-a-cruise/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
backend/
├── src/
│   ├── models/          # Data models (Article, Ship, Review, Image, Topic, StyleGuide)
│   ├── services/        # Business logic (ArticleGenerator, ContentRetriever, Publisher)
│   ├── api/             # REST API endpoints (articles, ships, topics, generation)
│   └── db/              # Supabase client setup, migrations
└── tests/
    ├── contract/        # API contract tests
    ├── integration/     # End-to-end user flow tests
    └── unit/            # Service and model unit tests

frontend/
├── src/
│   ├── components/      # UI components (ShipSelector, TopicSelector, ArticleEditor, Preview)
│   ├── pages/           # CMS pages (ArticleList, ArticleCreate, ArticleEdit, StyleGuideConfig)
│   ├── services/        # API client, authentication
│   └── lib/             # Rich-text editor integration, utilities
└── tests/
    ├── e2e/             # End-to-end UI tests
    └── unit/            # Component unit tests

static-site/
├── generator/           # Static site build logic
├── templates/           # Article templates for static site
└── public/              # Generated static site output
```

**Structure Decision**: Web application structure with separate backend (API + business logic) and frontend (CMS admin interface). Backend handles Supabase data access and Claude API integration. Frontend provides admin UI for article management. Static site generator is separate component that consumes published articles.

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
1. **Load template**: Start with `.specify/templates/tasks-template.md` as base structure
2. **Extract from design artifacts**:
   - `data-model.md`: 8 core entities + 2 join tables = 10 model creation tasks
   - `api-spec.yaml`: 25+ API endpoints = contract test tasks + implementation tasks
   - `design-system.md`: Component styles extracted = 15+ UI component tasks
   - `quickstart.md`: 12 validation scenarios = integration test tasks

3. **Task categories**:
   - **Setup tasks** (5): Project initialization, environment, database migrations
   - **Model tasks** (10): TypeScript types for all entities, Supabase client setup [P]
   - **API contract tests** (12): Test files for each endpoint group [P]
   - **API implementation** (12): Route handlers, service layer, business logic
   - **UI component tasks** (15): Header, Hero, ArticleCard, Editor, etc. [P]
   - **Page tasks** (8): Homepage, Article detail, Admin pages
   - **Integration tests** (12): Based on quickstart scenarios
   - **Static site tasks** (5): Generator, templates, build pipeline
   - **Polish tasks** (5): Error handling, loading states, responsive fixes

4. **Each task includes**:
   - Clear description with acceptance criteria
   - File paths to create/modify (from project structure)
   - Dependencies (which tasks must complete first)
   - Parallel marker [P] for independent tasks
   - Test requirements (what tests must pass)
   - Reference to design spec (which section to follow)

**Ordering Strategy**:
1. **Phase 1: Foundation** (Tasks 1-15)
   - Setup and configuration
   - Database migrations
   - TypeScript types [P]
   - Supabase client setup

2. **Phase 2: Backend** (Tasks 16-40)
   - API contract tests [P]
   - Model implementations [P]
   - Service layer (ArticleGenerator, ContentRetriever)
   - API route handlers
   - Authentication middleware

3. **Phase 3: Frontend Components** (Tasks 41-65)
   - UI components [P]
   - Rich-text editor integration
   - Form components
   - Layout components

4. **Phase 4: Pages & Features** (Tasks 66-80)
   - Admin CMS pages
   - Public site pages
   - Article generation flow
   - Style guide management

5. **Phase 5: Integration & Validation** (Tasks 81-90)
   - Integration tests from quickstart.md
   - E2E test scenarios
   - Performance optimization
   - Bug fixes and polish

**Dependency Management**:
- Models before services (services depend on types)
- Contract tests before implementations (TDD)
- Backend API before frontend consumers
- Components before pages (pages use components)
- Core features before polish tasks

**Parallel Execution**:
- Mark with [P] for tasks that can run simultaneously:
  - All model type definitions (independent files)
  - All API contract tests (independent test files)
  - All UI components (isolated components)
  - Documentation tasks

**Estimated Output**: 85-95 numbered, ordered tasks in tasks.md

**Task Template Example**:
```
### Task 42: Create ArticleCard Component [P]
**Status**: Not started
**Dependencies**: Task 15 (TypeScript types), Task 41 (Card base component)
**Files**: `frontend/src/components/ArticleCard.tsx`, `frontend/src/components/ArticleCard.test.tsx`
**References**: `design-system.md` (Article Cards section)

**Description**:
Create ArticleCard component matching design specifications with image, category badge, title, excerpt, and metadata row.

**Acceptance Criteria**:
- [ ] Component renders with all props (article, onClick)
- [ ] Image displays with 16:9 aspect ratio
- [ ] Hover state applies transform and shadow
- [ ] Category badge positioned correctly
- [ ] Metadata shows author, date, read time
- [ ] Responsive on mobile (full width)
- [ ] Unit tests pass (render, props, hover behavior)
- [ ] Matches design-system.md specifications exactly

**Test Command**: `npm test ArticleCard.test.tsx`
```

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
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (no violations introduced)
- [x] All NEEDS CLARIFICATION resolved (via research.md)
- [x] Complexity deviations documented (none - external dependencies justified)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
