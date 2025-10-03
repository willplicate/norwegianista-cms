# Cruise Blog CMS

A Next.js-based content management system for generating AI-powered cruise blog articles. The admin interface runs locally on your laptop, queries a Supabase database for ship reviews and images, uses Claude API to generate 1200-word articles, and deploys a static HTML site to shared hosting.

## Architecture

- **Local Development**: Admin CMS runs on localhost for content generation
- **Cloud Database**: Supabase (PostgreSQL) stores ships, reviews, articles, and images
- **AI Generation**: Claude API generates articles based on reviews and style guides
- **Static Export**: Next.js builds optimized HTML/CSS/JS for production
- **Deployment**: rsync uploads static files to shared hosting via SSH

## Quick Start

### 1. Prerequisites

- Node.js 20+ installed
- Supabase account with project created
- Anthropic API key (Claude)
- SSH access to shared hosting (for deployment)

### 2. Installation

```bash
# Clone repository
git clone <your-repo-url>
cd Norwegianista/frontend

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env` file in the `frontend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# Deployment (SSH)
SSH_USER=your-username
SSH_HOST=your-host.com
SSH_PORT=21098
SSH_PATH=/path/to/public_html
SSH_PASSWORD=your-password
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the contents of `../scripts/db-setup.sql`
4. Verify all 6 tables were created (ships, reviews, images, topics, articles, style_guides)

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin interface.

## Usage

### Generating Articles

1. Navigate to `/admin/generate`
2. Select a ship from the database
3. Choose a topic (Dining, Entertainment, Cabins, etc.)
4. Optionally select a style guide
5. Click "Generate Article"
6. Watch the article stream in real-time
7. Edit the generated content
8. Save as draft or publish immediately

### Publishing Workflow

1. Review/edit article in admin interface
2. Select a featured image
3. Click "Publish"
4. Article becomes available for static export

### Deploying to Production

```bash
# Build static site
npm run build

# Dry run (see what would be deployed)
npm run deploy:dry-run

# Deploy to server
npm run deploy
```

The deployment script automatically:
- Builds the static site (`out/` folder)
- Uploads files to your server via rsync
- Overwrites old files with new ones

## Project Structure

```
frontend/
├── app/
│   ├── admin/          # Admin CMS (local only)
│   │   ├── ships/      # Ship management
│   │   ├── generate/   # Article generation
│   │   └── deploy/     # Deployment interface
│   ├── (public)/       # Public blog pages (static export)
│   │   ├── page.tsx    # Homepage
│   │   └── [slug]/     # Article pages
│   └── api/            # API routes (local dev only)
├── components/         # React components
├── lib/
│   ├── supabase.ts    # Supabase client
│   ├── claude.ts      # Claude API client
│   ├── queries.ts     # Database queries
│   └── types.ts       # TypeScript types
└── public/            # Static assets

scripts/
├── deploy.sh          # Deployment script
├── deploy-dry-run.sh  # Dry-run deployment
└── db-setup.sql       # Database schema
```

## Database Schema

- **ships**: Cruise ships (Symphony of the Seas, Wonder of the Seas, etc.)
- **reviews**: User reviews with ratings and categories
- **images**: Photos of ships and from reviews
- **topics**: Article categories (Dining, Entertainment, Cabins)
- **articles**: Generated blog posts (draft or published)
- **style_guides**: Editorial guidelines for AI generation

## Disaster Recovery

### If Your Laptop Fails

1. **Code Backup**: All code is backed up to GitHub
2. **Database**: Supabase database is cloud-hosted (no data loss)
3. **Static Site**: Production site continues running (static files)

### Restoring on New Machine

```bash
# 1. Install Node.js 20+
# 2. Clone from GitHub
git clone <your-repo-url>
cd Norwegianista/frontend
npm install

# 3. Copy .env file (from secure backup)
# 4. Verify database connection
npm run dev

# 5. Access admin at http://localhost:3000/admin
```

All your ships, reviews, and articles are safe in Supabase. Just reconnect with your credentials.

## Troubleshooting

### Build Fails

**Error**: "ANTHROPIC_API_KEY is not defined"
- Check `.env` file exists in `frontend/` directory
- Verify all required environment variables are set

### Deployment Fails

**Error**: "Permission denied (publickey)"
- Verify SSH credentials in `.env`
- Test SSH connection manually: `ssh -p 21098 user@host`

**Error**: "rsync: command not found"
- Install rsync: `brew install rsync` (macOS) or `apt-get install rsync` (Linux)

### Database Connection Issues

**Error**: "Failed to connect to Supabase"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Ensure database tables exist (run `db-setup.sql`)

## Development

### Adding New Topics

```sql
INSERT INTO topics (name, slug, description)
VALUES ('New Topic', 'new-topic', 'Description here');
```

### Creating Style Guides

```sql
INSERT INTO style_guides (name, system_prompt, tone, is_default)
VALUES (
  'My Style',
  'You are a professional writer...',
  'Professional and engaging',
  FALSE
);
```

### Modifying Database Schema

1. Make changes in Supabase SQL Editor
2. Update `scripts/db-setup.sql`
3. Update TypeScript types in `lib/types.ts` and `lib/database.types.ts`
4. Commit changes to GitHub

## Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **Language**: TypeScript 5.x
- **UI**: React 19, Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (claude-sonnet-4)
- **Deployment**: rsync over SSH

## Support

For issues or questions, refer to:
- Feature specification: `/specs/002-update-cruise-blog/spec.md`
- Implementation plan: `/specs/002-update-cruise-blog/plan.md`
- Task list: `/specs/002-update-cruise-blog/tasks.md`
