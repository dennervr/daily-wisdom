# Daily Wisdom

[![Sponsor](https://img.shields.io/badge/sponsor-dennervr-EA4AAA?logo=github-sponsors&style=flat-square)](https://github.com/sponsors/dennervr)

A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.

The purpose of this application is to provide quick and useful content on a daily basis that contributes to personal development in a distraction-free environment without advertisements. 

## Features

- Daily AI-generated articles on timeless topics
- Multi-language support with automated translation
- Clean, minimalist interface
- Source citations with grounding from Google Search

## Future plans
- Listing and searching for articles.
- Create article categories, such as humor and quick passages.
- User account for saving favorite articles and notes.
- Explanation/in-depth analysis of text selections.

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
```

#### CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--date <YYYY-MM-DD>` | `-d` | Date for article generation | Today |
| `--force` | `-f` | Regenerate even if exists | `false` |
| `--verbose` | `-v` | Show detailed logs | `false` |
| `--quiet` | `-q` | Suppress non-error output | `false` |
| `--help` | `-h` | Display help information | - |


## Translation Configuration

The application uses a hybrid translation approach:

### Primary: DeepL Translation
- High-quality translations when DeepL API key is configured
- Supports 11 languages: English, Spanish, French, German, Portuguese, Italian, Dutch, Russian, Japanese, Chinese, and Korean
- Automatic retry logic with exponential backoff

### Fallback: Gemini Translation
- When DeepL is unavailable or fails, the system automatically falls back to Gemini
- Ensures continuous service even if the primary translator is down

## Internationalization (i18n)

The application includes a comprehensive i18n/l10n system supporting 11 languages with locale-aware formatting and automatic fallback. For complete documentation, usage examples, and implementation details, see [docs/i18n-guide.md](docs/i18n-guide.md).

## Getting Started

### Prerequisites

- Node.js 24+
- Pnpm
- Docker and Docker compose

### Installation

#### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and PostgreSQL connection

# Generate Drizzle schema
pnpm db:generate

# Apply database migrations
pnpm db:push

# Start development server
pnpm dev
```

#### Docker Development (Recommended)

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start all services (PostgreSQL + App)
docker compose up -d

# Access Drizzle Studio (database GUI)
pnpm db:studio
```

**Access:**
- Application: http://localhost:3000
- Database: localhost:5432
- Drizzle Studio: Run `pnpm db:studio` locally

### Docker Services

- **postgres**: PostgreSQL 18 database
- **app**: Next.js application

## License
MIT
