'use client';

import * as React from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Button } from '@vera/web-ui/button';
import { Badge } from '@vera/web-ui/badge';
import { Avatar, AvatarFallback } from '@vera/web-ui/avatar';
import { Separator } from '@vera/web-ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@vera/web-ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@vera/web-ui/accordion';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@vera/web-ui/tooltip';
import { Kbd } from '@vera/web-ui/kbd';
import { cn } from '@vera/common-utils';
import { AuroraText } from '@vera/web-ui/aurora-text';
import { IconCloud } from '@vera/web-ui/icon-cloud';
import { InteractiveGridPattern } from '@vera/web-ui/interactive-grid-pattern';
import { Marquee } from '@vera/web-ui/marquee';
import {
  ZapIcon,
  ShieldCheckIcon,
  LayersIcon,
  RocketIcon,
  CodeIcon,
  GitBranchIcon,
  DatabaseIcon,
  PackageIcon,
  CheckIcon,
  CopyIcon,
  StarIcon,
  ExternalLinkIcon,
  Share2Icon,
  SparklesIcon,
  ArrowRightIcon,
  GlobeIcon,
  LockIcon,
  ServerIcon,
  WrenchIcon,
  Moon,
  Sun,
} from 'lucide-react';

// ─── Theme Toggle (next-themes aware + view-transition ripple) ────────────────

function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => setMounted(true), []);

  const toggle = React.useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const isDark = resolvedTheme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const vw = window.visualViewport?.width ?? window.innerWidth;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));

    if (typeof document.startViewTransition !== 'function') {
      setTheme(nextTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
  }, [resolvedTheme, setTheme]);

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={cn('h-9 w-9 rounded-lg border border-border/70', className)}
      />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      className={cn(
        'h-9 w-9 rounded-lg border border-border/70 flex items-center justify-center hover:bg-muted transition-colors',
        className,
      )}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

export function Navbar() {
  const [copied, setCopied] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npx create-vera-app@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/95 backdrop-blur-md shadow-md'
            : 'border-b border-transparent bg-background/70 backdrop-blur-sm',
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-bold tracking-tight">vera.</span>
            <Badge
              variant="secondary"
              className="text-[10px] h-5 px-2 font-mono rounded-full"
            >
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              beta
            </Badge>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Docs', tip: 'Read the documentation' },
              { label: 'Pricing', tip: 'Simple, transparent pricing' },
              { label: 'Blog', tip: 'Tips, guides, and updates' },
            ].map(({ label, tip }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    {label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{tip}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-mono text-xs rounded-lg border-border/70"
                  onClick={handleCopyInstall}
                >
                  {copied ? (
                    <CheckIcon className="size-3 text-green-500" />
                  ) : (
                    <CopyIcon className="size-3" />
                  )}
                  <span className="hidden sm:inline">npx create-vera-app</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy install command</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ThemeToggleButton />
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
            <Button size="sm" className="rounded-lg">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

export function HeroSection() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx create-vera-app@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Interactive grid background */}
      <InteractiveGridPattern
        width={40}
        height={40}
        squares={[40, 20]}
        className="[mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_20%,transparent_75%)] opacity-50"
        squaresClassName="stroke-foreground/5 hover:fill-indigo-500/10"
      />

      {/* Indigo radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[600px] w-[1000px] rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)',
        }}
      />

      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 flex flex-col items-center text-center gap-8">
        <Badge
          variant="secondary"
          className="text-xs tracking-wider uppercase gap-2 px-4 py-1.5 rounded-full border border-border/60"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          Now in Beta — Free forever for solo devs
        </Badge>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.92]">
          <span className="bg-linear-to-b from-foreground via-foreground/85 to-foreground/50 bg-clip-text text-transparent">
            Build faster.
          </span>
          <br />
          <AuroraText
            colors={['#6366f1', '#8b5cf6', '#0ea5e9', '#a78bfa', '#38bdf8']}
            speed={0.8}
          >
            Ship smarter.
          </AuroraText>
        </h1>

        <p className="text-muted-foreground text-xl max-w-lg leading-relaxed font-light">
          A full-stack monorepo starter with NX, Elysia, Next.js, Drizzle, and
          Shadcn UI — wired up and ready to go.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            size="lg"
            className="px-10 h-12 text-base rounded-xl shadow-md gap-2"
          >
            Start Building
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-10 h-12 text-base rounded-xl gap-2 border-border/70 font-mono text-sm"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckIcon className="size-3.5 text-green-500" />
            ) : (
              <CopyIcon className="size-3.5" />
            )}
            npx create-vera-app@latest
          </Button>
        </div>

        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          Press
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          to open command palette
        </p>
      </section>
    </div>
  );
}

// ─── Marquee Banner ──────────────────────────────────────────────────────────

const featureHighlights = [
  { icon: ZapIcon, text: 'Bun Runtime' },
  { icon: CodeIcon, text: 'End-to-end Type Safety' },
  { icon: RocketIcon, text: 'Turbopack HMR' },
  { icon: DatabaseIcon, text: 'Drizzle ORM' },
  { icon: GitBranchIcon, text: 'NX Smart Caching' },
  { icon: LayersIcon, text: 'React Server Components' },
  { icon: ShieldCheckIcon, text: 'Built-in Auth' },
  { icon: PackageIcon, text: 'Zero Config Setup' },
  { icon: Share2Icon, text: 'Shared Libraries' },
  { icon: GlobeIcon, text: 'Deploy Anywhere' },
  { icon: LockIcon, text: 'Type-safe APIs' },
  { icon: ServerIcon, text: 'Elysia API Layer' },
  { icon: SparklesIcon, text: 'Shadcn UI' },
  { icon: WrenchIcon, text: 'Full TypeScript' },
];

function FeatureChip({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/70 bg-card/60 backdrop-blur-sm text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0">
      <Icon className="size-3.5 shrink-0 text-indigo-500/70" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

export function MarqueeBanner() {
  const half = Math.ceil(featureHighlights.length / 2);
  const row1 = featureHighlights.slice(0, half);
  const row2 = featureHighlights.slice(half);

  return (
    <div className="relative border-y border-border/60 overflow-hidden py-4 bg-muted/20">
      <div className="flex flex-col gap-3">
        <Marquee
          pauseOnHover
          repeat={4}
          style={{ '--duration': '35s' } as React.CSSProperties}
          className="p-0"
        >
          {row1.map((f) => (
            <FeatureChip key={f.text} icon={f.icon} text={f.text} />
          ))}
        </Marquee>
        <Marquee
          pauseOnHover
          reverse
          repeat={4}
          style={{ '--duration': '35s' } as React.CSSProperties}
          className="p-0"
        >
          {row2.map((f) => (
            <FeatureChip key={f.text} icon={f.icon} text={f.text} />
          ))}
        </Marquee>
      </div>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}

// ─── Stats Counter ──────────────────────────────────────────────────────────

const stats = [
  { target: 2400, suffix: '+', label: 'Repos scaffolded', prefix: '' },
  { target: 10, suffix: 'x', label: 'Faster than manual setup', prefix: '' },
  { target: 100, suffix: '%', label: 'Type coverage', prefix: '' },
  { target: 4, suffix: ' min', label: 'To first deployment', prefix: '~' },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ stat }: { stat: (typeof stats)[0] }) {
  const { count, ref } = useCountUp(stat.target);
  return (
    <div ref={ref} className="flex flex-col items-center gap-1.5">
      <span className="text-4xl font-bold tabular-nums tracking-tight">
        {stat.prefix}
        {count}
        {stat.suffix}
      </span>
      <span className="text-sm text-muted-foreground text-center">
        {stat.label}
      </span>
    </div>
  );
}

export function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
      {stats.map((stat, i) => (
        <StatItem key={i} stat={stat} />
      ))}
    </div>
  );
}

// ─── Tech Stack Cloud ────────────────────────────────────────────────────────

const TECH_IMAGES = [
  'https://cdn.simpleicons.org/nextdotjs/000000',
  'https://cdn.simpleicons.org/react/000000',
  'https://cdn.simpleicons.org/typescript/000000',
  'https://cdn.simpleicons.org/tailwindcss/000000',
  'https://cdn.simpleicons.org/bun/000000',
  'https://cdn.simpleicons.org/postgresql/000000',
  'https://cdn.simpleicons.org/vercel/000000',
  'https://cdn.simpleicons.org/github/000000',
  'https://cdn.simpleicons.org/docker/000000',
  'https://cdn.simpleicons.org/nodedotjs/000000',
  'https://cdn.simpleicons.org/pnpm/000000',
  'https://cdn.simpleicons.org/eslint/000000',
  'https://cdn.simpleicons.org/prettier/000000',
  'https://cdn.simpleicons.org/vitest/000000',
];

const techStack = [
  { label: 'Next.js 16', tip: 'App Router, RSC, Turbopack' },
  { label: 'Elysia', tip: 'End-to-end type-safe API with Bun' },
  { label: 'NX', tip: 'Monorepo build system with caching' },
  { label: 'Drizzle', tip: 'Type-safe SQL ORM' },
  { label: 'Shadcn UI', tip: 'Accessible, composable components' },
  { label: 'TypeScript', tip: 'Strict mode across the stack' },
];

export function TechStackSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-6">
          <Badge
            variant="outline"
            className="w-fit font-mono text-xs rounded-full px-4"
          >
            Powered by
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
            Built on a{' '}
            <AuroraText
              colors={['#6366f1', '#8b5cf6', '#0ea5e9', '#a78bfa']}
              speed={0.7}
            >
              modern
            </AuroraText>{' '}
            foundation.
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
            Every piece of the stack was handpicked for performance, type
            safety, and exceptional developer experience. No bloat, no
            compromises.
          </p>

          <TooltipProvider>
            <div className="flex flex-wrap gap-2">
              {techStack.map(({ label, tip }) => (
                <Tooltip key={label}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-default px-3 py-1.5 text-xs font-mono hover:bg-muted transition-colors rounded-lg border-border/70"
                    >
                      {label}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>{tip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>

          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="outline"
              className="rounded-xl gap-2 border-border/70"
            >
              View full stack
              <ArrowRightIcon className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Right: 3D icon cloud */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Subtle glow behind the cloud */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
              }}
            />
            {/* CSS invert for dark mode: black icons → white */}
            <div className="relative dark:invert dark:brightness-90">
              <IconCloud images={TECH_IMAGES} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    icon: PackageIcon,
    title: 'Clone the template',
    description:
      'Run a single command to scaffold the entire monorepo with all dependencies pre-configured and ready.',
    code: 'npx create-vera-app@latest',
  },
  {
    number: '02',
    icon: CodeIcon,
    title: 'Configure your stack',
    description:
      'Set your database connection string, environment variables, and customize apps to fit your project.',
    code: null,
  },
  {
    number: '03',
    icon: RocketIcon,
    title: 'Deploy anywhere',
    description:
      'Push to your platform of choice. Vercel, Railway, Fly.io, or any Docker-compatible host.',
    code: null,
  },
];

export function HowItWorksSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center shrink-0">
              <step.icon className="size-4 text-muted-foreground" />
            </div>
            <span className="text-3xl font-bold text-foreground/10 tabular-nums leading-none select-none">
              {step.number}
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
          {step.code && (
            <code className="text-xs font-mono bg-muted px-3 py-2 rounded-lg text-muted-foreground inline-block border border-border/60">
              {step.code}
            </code>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Features ───────────────────────────────────────────────────────────────

const allFeatures = [
  {
    icon: CodeIcon,
    title: 'End-to-end Type Safety',
    description:
      'Share types between your API and frontend. No codegen, no drift.',
    tag: 'DX',
  },
  {
    icon: GitBranchIcon,
    title: 'Monorepo First',
    description:
      'NX workspace with smart caching, affected task runs, and CI optimization.',
    tag: 'DX',
  },
  {
    icon: PackageIcon,
    title: 'Zero Config Setup',
    description:
      'Everything wired — auth, database, UI, API — one command away.',
    tag: 'DX',
  },
  {
    icon: ZapIcon,
    title: 'Bun Runtime',
    description:
      'API layer runs on Bun — the fastest JavaScript runtime available.',
    tag: 'Performance',
  },
  {
    icon: RocketIcon,
    title: 'Turbopack Dev Server',
    description:
      'Near-instant HMR. Start iterating from the very first keystroke.',
    tag: 'Performance',
  },
  {
    icon: LayersIcon,
    title: 'RSC by Default',
    description:
      'React Server Components eliminate unnecessary client JS bundles.',
    tag: 'Performance',
  },
  {
    icon: DatabaseIcon,
    title: 'Drizzle ORM',
    description:
      "Lightweight, type-safe SQL with migrations that won't slow you down.",
    tag: 'Scale',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Built-in Auth',
    description:
      'Session management and role-based access control out of the box.',
    tag: 'Scale',
  },
  {
    icon: Share2Icon,
    title: 'Shared Libraries',
    description:
      'UI, utils, and hooks as workspace packages shared across all apps.',
    tag: 'Scale',
  },
];

export function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {allFeatures.map((f) => (
        <div
          key={f.title}
          className="group p-6 rounded-2xl border border-border bg-card hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="w-9 h-9 rounded-lg bg-muted/70 border border-border/60 flex items-center justify-center group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
              <f.icon className="size-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 bg-muted/60 px-2 py-0.5 rounded-full border border-border/40">
              {f.tag}
            </span>
          </div>
          <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Code Preview ───────────────────────────────────────────────────────────

const codeExamples = {
  server: `// app/page.tsx — React Server Component
import { db } from '@vera/db'
import { users } from '@vera/db/schema'

export default async function Page() {
  const data = await db.select().from(users).limit(10)
  return <UserList users={data} />
}`,
  client: `// components/counter.tsx — Client Component
"use client"
import { useState } from 'react'
import { Button } from '@vera/web-ui/button'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </Button>
  )
}`,
  api: `// apps/api/src/routes/users.ts — Elysia route
import { Elysia, t } from 'elysia'
import { db } from '@vera/db'

export const usersRoute = new Elysia()
  .get('/users', async () => {
    return db.select().from(users)
  })
  .post('/users', async ({ body }) => {
    return db.insert(users).values(body)
  }, { body: t.Object({ name: t.String() }) })`,
};

export function CodePreview() {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(
      codeExamples[key as keyof typeof codeExamples],
    );
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-2xl">
      <Tabs defaultValue="server" className="w-full">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
          <TabsList>
            <TabsTrigger value="server">Server</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="api">API Route</TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="font-mono text-xs rounded-full">
            TypeScript
          </Badge>
        </div>

        {(Object.keys(codeExamples) as (keyof typeof codeExamples)[]).map(
          (key) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="relative bg-[oklch(0.13_0_0)]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500/60" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
                    <span className="h-3 w-3 rounded-full bg-green-500/60" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleCopy(key)}
                    className="h-6 w-6 text-white/30 hover:text-white/70 hover:bg-white/10"
                  >
                    {copied === key ? (
                      <CheckIcon className="size-3 text-green-400" />
                    ) : (
                      <CopyIcon className="size-3" />
                    )}
                  </Button>
                </div>
                <pre className="p-6 text-xs leading-relaxed overflow-x-auto text-white/65 font-mono">
                  <code>{codeExamples[key]}</code>
                </pre>
              </div>
            </TabsContent>
          ),
        )}
      </Tabs>
    </div>
  );
}

// ─── Testimonials (Marquee) ──────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Engineering Lead',
    content:
      'Vera completely changed how our team ships features. The NX setup alone saved us weeks of configuration.',
    avatar: 'SK',
    color: 'from-violet-500 to-purple-600',
    stars: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Full Stack Dev',
    content:
      "The monorepo setup is a dream. Shadcn + NX + Elysia is the perfect combo. I've never moved this fast.",
    avatar: 'MT',
    color: 'from-blue-500 to-cyan-600',
    stars: 5,
  },
  {
    name: 'Anika R.',
    role: 'Product Engineer',
    content:
      'From zero to production in record time. End-to-end type safety without the ceremony. This is the future.',
    avatar: 'AR',
    color: 'from-emerald-500 to-teal-600',
    stars: 5,
  },
  {
    name: 'Jin L.',
    role: 'Backend Engineer',
    content:
      "Elysia's Eden client is witchcraft. Full type inference from server to browser, zero codegen. Vera ships this by default.",
    avatar: 'JL',
    color: 'from-orange-500 to-red-500',
    stars: 5,
  },
  {
    name: 'Priya M.',
    role: 'Startup CTO',
    content:
      'We migrated our entire stack to this template. Three months of setup work gone in an afternoon. 10/10.',
    avatar: 'PM',
    color: 'from-pink-500 to-rose-500',
    stars: 5,
  },
  {
    name: 'Diego R.',
    role: 'Indie Hacker',
    content:
      'Drizzle + Bun is insanely fast. My API response times dropped by 40% vs the old Express setup.',
    avatar: 'DR',
    color: 'from-indigo-500 to-blue-600',
    stars: 5,
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="relative w-72 p-5 rounded-2xl border border-border bg-card flex flex-col gap-3 shrink-0">
      <div className="flex gap-0.5">
        {Array.from({ length: t.stars }).map((_, i) => (
          <StarIcon key={i} className="size-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {t.content}
      </p>
      <div className="flex items-center gap-3 pt-2 mt-auto border-t border-border/60">
        <Avatar className="h-7 w-7">
          <AvatarFallback
            className={cn('text-[10px] text-white bg-linear-to-br', t.color)}
          >
            {t.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs font-medium">{t.name}</p>
          <p className="text-[11px] text-muted-foreground">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const row1 = testimonials.slice(0, 3);
  const row2 = testimonials.slice(3);

  return (
    <div className="relative overflow-hidden">
      <div className="flex flex-col gap-4">
        <Marquee
          pauseOnHover
          repeat={3}
          style={{ '--duration': '45s' } as React.CSSProperties}
          className="p-0"
        >
          {row1.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee
          pauseOnHover
          reverse
          repeat={3}
          style={{ '--duration': '45s' } as React.CSSProperties}
          className="p-0"
        >
          {row2.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
      {/* Edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'What is Vera?',
    a: 'Vera is a full-stack monorepo starter that wires together Next.js, Elysia, Drizzle, NX, and Shadcn UI so you can go from idea to production without the setup tax.',
  },
  {
    q: 'Do I need to know NX to use it?',
    a: "No. Vera uses NX under the hood for build caching and task orchestration, but you interact with familiar npm scripts. NX knowledge helps but isn't required to get started.",
  },
  {
    q: 'Can I use it with an existing database?',
    a: "Yes. Drizzle ORM supports PostgreSQL, MySQL, and SQLite. Point it at your existing connection string and run migrations — Vera doesn't lock you in.",
  },
  {
    q: 'Is it production-ready?',
    a: 'Vera is in beta. The core architecture is solid and used in real projects, but APIs may shift before v1. Pin your version and read the changelog between updates.',
  },
  {
    q: 'How does end-to-end type safety work?',
    a: 'The Elysia API layer exports its type signature via the Eden treaty client. Your Next.js app imports that client — no codegen, no OpenAPI schemas, just TypeScript all the way through.',
  },
];

export function FaqSection() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
          <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-5">
            {faq.q}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
            {faq.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight">vera.</span>
              <Badge
                variant="outline"
                className="font-mono text-[10px] h-4 px-1 rounded-full"
              >
                v0.1.0
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A full-stack monorepo starter built for modern teams who value
              speed, type safety, and great DX.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Resources
            </p>
            {['Documentation', 'Changelog', 'Roadmap', 'GitHub'].map((link) => (
              <button
                key={link}
                className="text-sm text-muted-foreground hover:text-foreground text-left transition-colors w-fit"
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Community
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon-sm" className="rounded-lg">
                <ExternalLinkIcon className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" className="rounded-lg">
                <Share2Icon className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with Next.js + Elysia
            </p>
          </div>
        </div>

        <Separator className="mb-8 opacity-60" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Vera. All rights reserved.</span>
          <div className="flex gap-5">
            <button className="hover:text-foreground transition-colors">
              Privacy
            </button>
            <button className="hover:text-foreground transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
