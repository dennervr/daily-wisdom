# Daily Wisdom

A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.

## Features

- Daily AI-generated articles on timeless topics
- Multi-language support with automated translation
- Clean, minimalist interface
- Source citations with grounding from Google Search

## Article Generation

Articles are automatically generated daily at midnight UTC using a cron scheduler. The system:
1. Generates an English article using Gemini with Google Search grounding
2. Automatically translates the article to all supported languages
3. Caches translations in the database for performance

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

# Database URL for Prisma
DATABASE_URL=file:./dev.db

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

- Node.js 22+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Docker Deployment

### Quick Start

1. **Setup environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and ensure DATABASE_URL uses PostgreSQL
   ```

2. **Start the application:**
   ```bash
   docker-compose up -d
   ```

3. **Access:**
   - Application: http://localhost:3000
   - Database: localhost:5432


## License

MIT
