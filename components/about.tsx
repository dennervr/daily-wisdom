"use client"

import { BookOpen, Globe, Sparkles, Code, Heart, Mail, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AboutNavbar } from "@/components/about-navbar"
import { useTranslation } from "@/lib/i18n"

export default function About() {
  const t = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AboutNavbar />
      
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 pt-24">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BookOpen className="w-16 h-16 text-primary" />
          </div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl tracking-tight">
            {t('about.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <Separator className="my-8" />

        {/* Mission Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">{t('about.mission.title')}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.mission.content')}
          </p>
        </section>

        <Separator className="my-8" />

        {/* How It Works Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">{t('about.howItWorks.title')}</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {t('about.howItWorks.intro')}
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>
                <strong>{t('about.howItWorks.aiGeneration')}</strong> {t('about.howItWorks.aiGenerationDesc')}
              </li>
              <li>
                <strong>{t('about.howItWorks.sourceCitations')}</strong> {t('about.howItWorks.sourceCitationsDesc')}
              </li>
              <li>
                <strong>{t('about.howItWorks.availability')}</strong> {t('about.howItWorks.availabilityDesc')}
              </li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Multilingual Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">{t('about.worldwide.title')}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: t('about.worldwide.content') }} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div>🇺🇸 English</div>
            <div>🇪🇸 Spanish</div>
            <div>🇫🇷 French</div>
            <div>🇩🇪 German</div>
            <div>🇧🇷 Portuguese</div>
            <div>🇮🇹 Italian</div>
            <div>🇳🇱 Dutch</div>
            <div>🇷🇺 Russian</div>
            <div>🇯🇵 Japanese</div>
            <div>🇨🇳 Chinese</div>
            <div>🇰🇷 Korean</div>
            <div>🇸🇦 Arabic</div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Technology Section */}
        <section className="space-y-4">
          <h2 className="font-serif font-bold text-2xl">{t('about.technology.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.technology.content')}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-4">
            <li><strong>{t('about.technology.nextjs')}</strong> - {t('about.technology.nextjsDesc')}</li>
            <li><strong>{t('about.technology.typescript')}</strong> - {t('about.technology.typescriptDesc')}</li>
            <li><strong>{t('about.technology.postgresql')}</strong> - {t('about.technology.postgresqlDesc')}</li>
            <li><strong>{t('about.technology.tailwind')}</strong> - {t('about.technology.tailwindDesc')}</li>
            <li><strong>{t('about.technology.docker')}</strong> - {t('about.technology.dockerDesc')}</li>
          </ul>
        </section>

        <Separator className="my-8" />

        {/* Future Plans Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">{t('about.futurePlans.title')}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.futurePlans.intro')}
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>{t('about.futurePlans.articleSearch')}</strong> {t('about.futurePlans.articleSearchDesc')}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>{t('about.futurePlans.categories')}</strong> {t('about.futurePlans.categoriesDesc')}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>{t('about.futurePlans.userAccounts')}</strong> {t('about.futurePlans.userAccountsDesc')}
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>{t('about.futurePlans.inDepthAnalysis')}</strong> {t('about.futurePlans.inDepthAnalysisDesc')}
              </div>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            {t('about.futurePlans.suggestions')}
          </p>
        </section>

        <Separator className="my-8" />

        {/* AI Disclaimer */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>{t('about.aiDisclaimer.title')}</strong> {t('about.aiDisclaimer.content')}
          </AlertDescription>
        </Alert>

        <Separator className="my-8" />

        {/* Open Source Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="font-serif font-bold text-2xl">{t('about.openSource.title')}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.openSource.content')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => window.open('https://github.com/dennervr/daily-wisdom', '_blank')}
            >
              <Code className="w-4 h-4 mr-2" />
              {t('about.openSource.github')}
            </Button>
            <Button
              variant="default"
              onClick={() => window.open('https://buy.stripe.com/00w3cxdx5ekPdsC1Pk6oo00', '_blank')}
            >
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              {t('about.openSource.sponsor')}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('about.openSource.supportText')}
          </p>
        </section>

        <Separator className="my-8" />

        {/* Contact Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">{t('about.contact.title')}</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.contact.content')}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = `mailto:${t('about.contact.email')}`}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('about.contact.email')}
          </Button>
        </section>

        {/* Footer */}
        <div className="pt-8 text-center text-sm text-muted-foreground">
          <p>{t('about.footer.madeBy')} <a href="https://github.com/dennervr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Denner</a></p>
          <p className="mt-2">{t('about.footer.license')}</p>
        </div>
      </div>
    </div>
  )
}
