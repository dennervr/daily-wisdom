/**
 * Next.js Instrumentation Hook
 * 
 * This file is automatically called by Next.js when the server starts.
 * Perfect for initializing services, logging startup info, etc.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server-side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { runMigrations } = await import('./lib/migrate');
    const { initializeTranslationService } = await import('./lib/translation/translationService');
    const { validateEnvironmentVariables } = await import('./lib/validation');
    
    console.log('\n🚀 Daily Wisdom Application Starting...\n');
    
    // Validate environment variables first (fail fast if config is wrong)
    try {
      validateEnvironmentVariables();
    } catch (error) {
      console.error('\n❌ Application startup failed - Invalid configuration\n');
      console.error(error);
      process.exit(1);
    }
    
    // Run migrations first (before any DB operations)
    await runMigrations();
    
    // Initialize translation service and log provider status
    await initializeTranslationService();
    
    console.log('\n✅ Application initialization complete\n');
  }
}
