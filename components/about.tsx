"use client"

import { BookOpen, Globe, Sparkles, Code, Heart, Mail, Lightbulb } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AboutNavbar } from "@/components/about-navbar"

export default function About() {
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
            About Daily Wisdom
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A minimalist publication delivering daily wisdom through AI-generated articles on Philosophy, Science, and History.
          </p>
        </div>

        <Separator className="my-8" />

        {/* Mission Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            In a world overflowing with information, Daily Wisdom offers a moment of clarity. 
            Each day, we deliver a article exploring timeless topics in philosophy, 
            science, and history. Our goal is to provide accessible, thought-provoking content that 
            enriches your understanding of the world and inspires deeper reflection.
          </p>
        </section>

        <Separator className="my-8" />

        {/* How It Works Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">How It Works</h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Daily Wisdom uses advanced artificial intelligence to generate fresh, insightful content every day:
            </p>
            <ul className="space-y-2 list-disc list-inside ml-4">
              <li>
                <strong>AI-Powered Generation:</strong> Articles are created using Google's Gemini AI, 
                which researches topics and synthesizes information from multiple sources.
              </li>
              <li>
                <strong>Source Citations:</strong> Every article includes references to credible sources, 
                grounded in real information from Google Search.
              </li>
              <li>
                <strong>Availability:</strong> Content is automatically generated at midnight UTC, 
                ensuring fresh wisdom is ready when you start your day.
              </li>
            </ul>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Multilingual Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">Available Worldwide</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Daily Wisdom is available in <strong>12 languages</strong>, making wisdom accessible to 
            readers around the globe. Our hybrid translation system combines DeepL's high-quality 
            translations with AI-powered fallback to ensure content is available in:
          </p>
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
          <h2 className="font-serif font-bold text-2xl">Built with Modern Technology</h2>
          <p className="text-muted-foreground leading-relaxed">
            Daily Wisdom is built with cutting-edge web technologies to ensure a fast, 
            reliable, and beautiful reading experience:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-4">
            <li><strong>Next.js</strong> - React framework for production</li>
            <li><strong>TypeScript</strong> - Type-safe development</li>
            <li><strong>PostgreSQL</strong> - Reliable data storage</li>
            <li><strong>Tailwind CSS</strong> - Beautiful, responsive design</li>
            <li><strong>Docker</strong> - Containerized deployment</li>
          </ul>
        </section>

        <Separator className="my-8" />

        {/* Future Plans Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">Future Plans</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We're constantly working to improve Daily Wisdom and add new features to enhance your reading experience. Here's what we're planning:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>Article Listing & Search:</strong> Browse through the archive of past articles with powerful search functionality to find specific topics or themes that interest you.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>Content Categories:</strong> Organize articles into categories like humor, quick passages, deep dives, and more, making it easier to find content that matches your mood.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>User Accounts:</strong> Create a personal account to save your favorite articles, add private notes, and track your reading history.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary mt-1">•</span>
              <div>
                <strong>In-Depth Analysis:</strong> Select any passage from an article to receive detailed explanations, historical context, or deeper philosophical analysis.
              </div>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground italic">
            Have ideas for other features? We'd love to hear your suggestions!
          </p>
        </section>

        <Separator className="my-8" />

        {/* AI Disclaimer */}
        <Alert>
          <AlertDescription className="text-sm">
            <strong>Important:</strong> All articles on Daily Wisdom are generated by artificial intelligence. 
            While we strive for accuracy and cite credible sources, AI-generated content may contain errors 
            or inaccuracies. Always verify important information from primary sources.
          </AlertDescription>
        </Alert>

        <Separator className="my-8" />

        {/* Open Source Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="font-serif font-bold text-2xl">Open Source & Support</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Daily Wisdom is an open-source project, built with passion and shared freely with the community. 
            The entire codebase is available on GitHub under the MIT License.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => window.open('https://github.com/dennervr/daily-wisdom', '_blank')}
            >
              <Code className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            <Button
              variant="default"
              onClick={() => window.open('https://buy.stripe.com/00w3cxdx5ekPdsC1Pk6oo00', '_blank')}
            >
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Sponsor this Project
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            If you find Daily Wisdom valuable, consider supporting its development. Your sponsorship 
            helps keep the project alive and enables continued improvements.
          </p>
        </section>

        <Separator className="my-8" />

        {/* Contact Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="font-serif font-bold text-2xl">Get in Touch</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Have questions, suggestions, or feedback? I'd love to hear from you.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = 'mailto:dennervrp@gmail.com'}
          >
            <Mail className="w-4 h-4 mr-2" />
            dennervrp@gmail.com
          </Button>
        </section>

        {/* Footer */}
        <div className="pt-8 text-center text-sm text-muted-foreground">
          <p>Made with care by <a href="https://github.com/dennervr" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">Denner</a></p>
          <p className="mt-2">© 2026 Daily Wisdom. Released under MIT License.</p>
        </div>
      </div>
    </div>
  )
}
