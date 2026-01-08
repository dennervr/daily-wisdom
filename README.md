# Daily Wisdom

[![Sponsor](https://img.shields.io/badge/sponsor-dennervr-EA4AAA?logo=github-sponsors&style=flat-square)](https://github.com/sponsors/dennervr)

A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.

## Features

- Daily AI-generated articles on timeless topics
- Multi-language support with automated translation
- Clean, minimalist interface
- Source citations with grounding from Google Search

## Article Generation

### Automatic Generation

Articles are automatically generated daily at midnight UTC using a cron scheduler. The system:
1. Generates an English article using Gemini with Google Search grounding
2. Automatically translates the article to all supported languages
3. Caches translations in the database for performance

### Manual Generation (CLI)

You can manually generate articles using the CLI command:

```bash
# Generate article for today
npm run generate

# Generate for specific date
npm run generate -- --date 2026-01-10

# Force regenerate even if exists
npm run generate -- --date 2026-01-10 --force

# Generate only translations (skip English)
npm run generate -- --date 2026-01-10 --translations-only

# Quiet mode (suppress non-error output)
npm run generate -- --date 2026-01-10 --quiet

# Verbose mode (detailed logs)
npm run generate -- --date 2026-01-10 --verbose

# Show help
npm run generate -- --help
```

#### CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--date <YYYY-MM-DD>` | `-d` | Date for article generation | Today |
| `--force` | `-f` | Regenerate even if exists | `false` |
| `--translations-only` | `-t` | Skip English, only translations | `false` |
| `--verbose` | `-v` | Show detailed logs | `false` |
| `--quiet` | `-q` | Suppress non-error output | `false` |
| `--help` | `-h` | Display help information | - |

#### Notes

- The CLI connects to the database using `DATABASE_URL` from your `.env` file
- Generation may take 1-2 minutes depending on AI API response time
- All supported languages are generated automatically unless `--translations-only` is used
- Use `--force` to regenerate articles that already exist in the database

## Translation Configuration

The application uses a hybrid translation approach:

### Primary: DeepL Translation
- High-quality translations when DeepL API key is configured
- Supports 11 languages: English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Japanese, Chinese, and Korean
- Automatic retry logic with exponential backoff

### Fallback: Gemini Translation
- When DeepL is unavailable or fails, the system automatically falls back to Gemini
- Ensures continuous service even if the primary translator is down

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Required for article generation and translation fallback
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - if not set, Gemini will be used for all translations
DEEPL_API_KEY=your_deepl_api_key_here

# Optional - defaults to free tier API
DEEPL_API_URL=https://api-free.deepl.com/v2

# Database URL for PostgreSQL (required)
DATABASE_URL=postgresql://dailywisdom:dailywisdom_password@postgres:5432/dailywisdom

# i18n Configuration (optional)
# Default locale (defaults to 'en' if not set)
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Enable i18n debug logging in development (optional)
NEXT_PUBLIC_I18N_DEBUG=false
```

## Internationalization (i18n)

The application includes a comprehensive i18n/l10n system supporting 11 languages with locale-aware formatting and automatic fallback. For complete documentation, usage examples, and implementation details, see [docs/i18n-guide.md](docs/i18n-guide.md).

## Getting Started

### Prerequisites

- Node.js 24+
- npm or pnpm
- PostgreSQL (for local development) or Docker

### Installation

#### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and PostgreSQL connection

# Generate Drizzle schema
npm run db:generate

# Apply database migrations
npm run db:push

# Start development server
npm run dev
```

#### Docker Development (Recommended)

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start all services (PostgreSQL + App)
docker compose up -d

# View logs
docker compose logs -f app

# Access Drizzle Studio (database GUI)
npm run db:studio
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Database Management

This project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL.

### Available Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Apply schema to database (development)
npm run db:push

# Run migrations (production)
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Schema Location

Database schema is defined in `lib/db/schema.ts` using Drizzle's TypeScript schema builder.

## Docker Deployment

### Quick Start

1. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   # DATABASE_URL is pre-configured for Docker PostgreSQL
   ```

2. **Start the application:**
   ```bash
   docker compose up -d
   ```

3. **Access:**
   - Application: http://localhost:3000
   - Database: localhost:5432
   - Drizzle Studio: Run `npm run db:studio` locally

### Docker Services

- **postgres**: PostgreSQL 18 database
- **migrate**: Applies database schema on startup
- **app**: Next.js application

### Useful Commands

```bash
# View logs
docker compose logs -f app

# Restart services
docker compose restart

# Stop services
docker compose down

# Stop and remove all data
docker compose down -v
```

## Support

If you find this project helpful, consider supporting its development:

<iframe src="https://github.com/sponsors/dennervr/button" title="Sponsor dennervr" height="32" width="114" style="border: 0; border-radius: 6px;"></iframe>

Or visit [GitHub Sponsors](https://github.com/sponsors/dennervr) to learn more.


## License

MIT
