import { Badge } from '@vera/web-ui/badge';
import { Button } from '@vera/web-ui/button';
import {
  Navbar,
  HeroSection,
  MarqueeBanner,
  StatsBar,
  TechStackSection,
  HowItWorksSection,
  FeaturesSection,
  CodePreview,
  TestimonialsSection,
  FaqSection,
  Footer,
} from './_components';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── Marquee feature strip ─────────────────────────────────── */}
        <MarqueeBanner />

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <div className="relative border-b border-border overflow-hidden">
          <div
            className="bg-stripes pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
          />
          <div className="relative bg-muted/30 py-14">
            <StatsBar />
          </div>
        </div>

        {/* ── Tech Stack Cloud ──────────────────────────────────────── */}
        <div className="border-b border-border/60">
          <TechStackSection />
        </div>

        {/* ── How it works ──────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-28">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 font-mono text-xs rounded-full px-4"
            >
              Getting Started
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-lg font-light">
              Three steps from zero to a fully working monorepo.
            </p>
          </div>
          <HowItWorksSection />
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <div className="relative border-t border-border overflow-hidden">
          <div
            className="bg-stripes pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-muted/40"
            aria-hidden="true"
          />
          <section className="relative max-w-7xl mx-auto px-6 py-28">
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="mb-4 font-mono text-xs rounded-full px-4"
              >
                Features
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto text-lg font-light">
                A carefully chosen stack that works together seamlessly.
              </p>
            </div>
            <FeaturesSection />
          </section>
        </div>

        {/* ── Code Preview ──────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-28 border-t border-border/60">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 font-mono text-xs rounded-full px-4"
            >
              Code
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              See what you&apos;re working with
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Real patterns you&apos;ll use every day — server, client, and API.
            </p>
          </div>
          <CodePreview />
        </section>

        {/* ── Testimonials ──────────────────────────────────────────── */}
        <div className="relative border-t border-border overflow-hidden py-28">
          <div className="text-center mb-16 px-6">
            <Badge
              variant="outline"
              className="mb-4 font-mono text-xs rounded-full px-4"
            >
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Loved by developers
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Don&apos;t take our word for it.
            </p>
          </div>
          <TestimonialsSection />
        </div>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="relative rounded-3xl bg-foreground text-background overflow-hidden px-8 py-28 text-center flex flex-col items-center gap-6">
            {/* Interactive grid inside the dark card */}
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }}
              />
            </div>
            {/* Radial highlight at top */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.1), transparent)',
              }}
            />

            <Badge className="relative z-10 font-mono text-xs bg-background/10 text-background border-background/20 rounded-full px-4">
              Open Source
            </Badge>
            <h2 className="relative z-10 text-5xl md:text-6xl font-bold tracking-tight max-w-lg leading-[1.05]">
              Your next project starts here.
            </h2>
            <p className="relative z-10 text-background/60 max-w-sm text-lg font-light">
              Get your monorepo up and running in minutes, not days. Free for
              individuals, scalable for teams.
            </p>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Button
                size="lg"
                className="px-10 h-12 text-base rounded-xl bg-background text-foreground hover:bg-background/90 shadow-lg shadow-black/20"
              >
                Get Started for Free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="px-10 h-12 text-base rounded-xl text-background/70 hover:text-background hover:bg-background/10"
              >
                Read the Docs →
              </Button>
            </div>
            <p className="relative z-10 text-xs text-background/40">
              No credit card required · MIT licensed
            </p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto px-6 py-28 border-t border-border/60">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 font-mono text-xs rounded-full px-4"
            >
              FAQ
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Common questions
            </h2>
            <p className="text-muted-foreground text-lg font-light">
              Everything you wanted to know before hitting clone.
            </p>
          </div>
          <FaqSection />
        </section>

        <Footer />
      </main>
    </>
  );
}
