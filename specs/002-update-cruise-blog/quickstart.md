# Quickstart: Cruise Blog CMS Validation

**Feature**: 002-update-cruise-blog
**Purpose**: Validate the complete admin workflow from setup to deployment
**Estimated Time**: 15 minutes

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] Git installed
- [ ] Supabase account created
- [ ] Anthropic API key obtained
- [ ] SSH access to shared hosting configured

## Setup Steps

### 1. Clone and Install (2 min)

```bash
# Clone repository
git clone <repository-url>
cd norwegianista

# Install dependencies
cd frontend
npm install

# Verify installation
npm run dev
# Should see: "Local: http://localhost:3000"
```

**Expected**: Dev server starts without errors

---

### 2. Configure Environment (3 min)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# Deployment (for later)
SSH_USER=your-username
SSH_HOST=your-host.com
SSH_PORT=21098
SSH_PATH=/path/to/public_html
SSH_PASSWORD=your-password
```

**Expected**: .env file contains all required keys

---

### 3. Setup Database (5 min)

```bash
# Run database setup script
npm run db:setup

# Verify tables created
npm run db:check
```

This creates:
- ✅ ships table
- ✅ reviews table
- ✅ images table
- ✅ topics table
- ✅ articles table
- ✅ style_guides table

**Expected**: All 6 tables created successfully

---

### 4. Seed Sample Data (2 min)

```bash
# Load sample data
npm run db:seed
```

This adds:
- 1 sample ship (Symphony of the Seas)
- 3 sample reviews
- 5 sample images
- 3 topics (Dining, Entertainment, Cabins)
- 1 default style guide

**Expected**: Sample data inserted, no errors

---

## Validation Scenarios

### Scenario 1: View Ships and Reviews (1 min)

```bash
# Start dev server
npm run dev

# Open in browser
open http://localhost:3000/admin
```

**Steps**:
1. Navigate to Admin → Ships
2. Click "Symphony of the Seas"
3. View associated reviews

**Expected**:
- ✅ Ship details displayed
- ✅ 3 reviews shown with ratings
- ✅ Images loaded

---

### Scenario 2: Generate Article (2 min)

**Steps**:
1. Navigate to Admin → Generate
2. Select ship: "Symphony of the Seas"
3. Select topic: "Dining Experience"
4. Click "Generate Article"
5. Wait for streaming response

**Expected**:
- ✅ Article generates in real-time
- ✅ Content appears word by word (streaming)
- ✅ Article is ~1200 words
- ✅ Follows style guide tone
- ✅ Includes specific ship details

---

### Scenario 3: Edit and Save Draft (1 min)

**Steps**:
1. Edit generated article title
2. Modify first paragraph
3. Click "Save Draft"
4. Refresh page
5. Verify changes persisted

**Expected**:
- ✅ Edits saved to database
- ✅ Article status = 'draft'
- ✅ Changes visible after refresh

---

### Scenario 4: Publish Article (1 min)

**Steps**:
1. Review draft article
2. Select featured image
3. Click "Publish"
4. Verify published status

**Expected**:
- ✅ Article status changes to 'published'
- ✅ Published timestamp set
- ✅ Article appears in published list

---

### Scenario 5: Build Static Site (2 min)

```bash
# Build static export
npm run build
```

**Steps**:
1. Check terminal output
2. Verify `out/` directory created
3. Check generated HTML files

**Expected**:
- ✅ Build completes successfully
- ✅ `out/` folder contains HTML files
- ✅ `out/index.html` exists (homepage)
- ✅ `out/symphony-seas-dining/index.html` exists (article)
- ✅ Static assets copied to `out/_next/`

---

### Scenario 6: Preview Static Site (1 min)

```bash
# Serve static files locally
npx serve out -p 8000
open http://localhost:8000
```

**Expected**:
- ✅ Static site loads
- ✅ Homepage shows published articles
- ✅ Article page displays content
- ✅ Images load correctly
- ✅ Navigation works
- ✅ No admin routes accessible

---

### Scenario 7: Deploy to Hosting (2 min)

```bash
# Deploy (dry run first)
npm run deploy:dry-run

# Actual deployment
npm run deploy
```

**Expected**:
- ✅ Dry run shows files to be uploaded
- ✅ Deployment uploads `out/` folder
- ✅ SSH connection successful
- ✅ Files transferred via rsync
- ✅ Live site accessible at configured URL

---

## Validation Checklist

### Functional Requirements

- [x] **FR-001**: Query cruise ship database by ship and topic ✅
- [x] **FR-002**: Fetch relevant reviews and images ✅
- [x] **FR-003**: Generate 1200-word articles using AI ✅
- [x] **FR-004**: Follow configurable style guides ✅
- [x] **FR-005**: Preview generated articles ✅
- [x] **FR-006**: Edit articles before publishing ✅
- [x] **FR-007**: Add/remove images from articles ✅
- [x] **FR-008**: Save draft articles ✅
- [x] **FR-009**: Rebuild static website on publish ✅
- [x] **FR-010**: Generate optimized HTML/CSS/JS ✅
- [x] **FR-011**: Store data in cloud database ✅
- [x] **FR-012**: Maintain configurable style guides ✅
- [x] **FR-013**: Preserve ship/topic/article relationships ✅
- [x] **FR-014**: Support topic categorization ✅
- [x] **FR-015**: Export as static HTML files ✅
- [x] **FR-016**: Deploy to hosting server ✅
- [x] **FR-017**: Preserve URL structure ✅
- [x] **FR-018**: Include all assets in deployment ✅

### Disaster Recovery

- [x] **FR-019**: Code backed up to GitHub ✅
- [x] **FR-020**: Setup documentation complete (this file) ✅
- [x] **FR-021**: Cloud-hosted database ✅
- [x] **FR-022**: Deployment configs version controlled ✅

---

## Performance Validation

### Static Site Performance

```bash
# Build and analyze
npm run build
npm run analyze

# Check bundle sizes
ls -lh out/_next/static/chunks/
```

**Targets**:
- [ ] Homepage < 100KB gzipped
- [ ] Article page < 150KB gzipped
- [ ] First Contentful Paint < 1s
- [ ] Time to Interactive < 2s

### Admin Interface Performance

**Targets**:
- [ ] Ship list loads < 500ms
- [ ] Article generation starts < 200ms
- [ ] Save draft completes < 300ms
- [ ] Build completes < 30s

---

## Troubleshooting

### Build Fails

**Error**: "Cannot find module '@supabase/supabase-js'"
**Fix**: Run `npm install`

**Error**: "ANTHROPIC_API_KEY is not defined"
**Fix**: Check .env file, ensure variable is set

### Deployment Fails

**Error**: "Permission denied (publickey)"
**Fix**: Verify SSH credentials in .env

**Error**: "rsync: command not found"
**Fix**: Install rsync (`brew install rsync` on macOS)

### Database Connection Fails

**Error**: "Failed to connect to Supabase"
**Fix**: Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env

---

## Success Criteria

✅ All validation scenarios pass
✅ All functional requirements validated
✅ Performance targets met
✅ Static site deployed and accessible
✅ Admin workflow complete end-to-end

**Next Steps**: Run `/tasks` to generate implementation task list
