#!/usr/bin/env node

/**
 * CLI tool for manually generating Daily Wisdom articles
 * 
 * Usage:
 *   npm run generate                                    # Generate for today
 *   npm run generate -- --date 2026-01-10               # Generate for specific date
 *   npm run generate -- --date 2026-01-10 --force       # Force regenerate
 *   npm run generate -- --translations-only             # Only generate translations
 *   npm run generate -- --help                          # Show help
 */

import { Command } from 'commander';
import { format, isValid, parse } from 'date-fns';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
dotenv.config({ path: resolve(__dirname, '../.env') });

// Import the generation function
import { triggerManualGeneration } from '../lib/scheduler';
import { db } from '../lib/db';

const program = new Command();

program
  .name('generate-article')
  .description('Generate daily wisdom articles with AI-powered content')
  .version('1.0.0')
  .option('-d, --date <YYYY-MM-DD>', 'Date for article generation (default: today)', format(new Date(), 'yyyy-MM-dd'))
  .option('-f, --force', 'Regenerate article even if it already exists', false)
  .option('-t, --translations-only', 'Only generate translations, skip English article', false)
  .option('-v, --verbose', 'Show detailed logs', false)
  .option('-q, --quiet', 'Suppress non-error output', false)
  .action(async (options) => {
    const startTime = Date.now();
    
    try {
      // Validate date format
      const parsedDate = parse(options.date, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        console.error(`❌ Error: Invalid date format "${options.date}". Use YYYY-MM-DD format.`);
        console.error('   Example: 2026-01-10');
        process.exit(1);
      }

      const dateStr = format(parsedDate, 'yyyy-MM-dd');

      // Check database connection
      if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL environment variable is not set.');
        console.error('   Make sure your .env file is configured properly.');
        process.exit(1);
      }

      // Configure verbosity
      if (options.quiet) {
        // Suppress console.log but keep console.error
        const originalLog = console.log;
        console.log = () => {};
        // Restore on exit
        process.on('exit', () => {
          console.log = originalLog;
        });
      }

      if (!options.quiet) {
        console.log('🚀 Daily Wisdom Article Generator');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📅 Date: ${dateStr}`);
        console.log(`🔄 Force regenerate: ${options.force ? 'Yes' : 'No'}`);
        console.log(`🌐 Translations only: ${options.translationsOnly ? 'Yes' : 'No'}`);
        console.log(`📊 Verbose: ${options.verbose ? 'Yes' : 'No'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }

      // Generate the article
      if (!options.quiet) {
        console.log('⏳ Starting article generation...\n');
      }

      await triggerManualGeneration(dateStr, {
        force: options.force,
        translationsOnly: options.translationsOnly,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      if (!options.quiet) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Article generation completed successfully!`);
        console.log(`⏱️  Total time: ${duration}s`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }

      process.exit(0);

    } catch (error) {
      console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ Article generation failed!');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      if (options.verbose || !options.quiet) {
        console.error('Error details:');
        console.error(error);
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error: ${errorMessage}`);
        console.error('\nRun with --verbose flag for detailed error information.');
      }
      
      process.exit(1);

    } finally {
      // Always close database connection
      try {
        await db.$client.end();
      } catch (err) {
        // Ignore errors when closing connection
      }
    }
  });

// Parse command line arguments
program.parse();
