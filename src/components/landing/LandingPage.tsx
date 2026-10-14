"use client";

import React from 'react';
import {
  Activity,
  ArrowRight,
  Layers,
  Zap,
  ShieldCheck,
  Cpu,
  Flame,
  Terminal,
  ChevronRight,
  Check,
  Github,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchStudio }) => {
  return (
    <div className="min-h-screen bg-[#050507] text-[#fafafa] selection:bg-indigo-500/30 selection:text-white font-sans overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)]">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-mono font-bold text-sm tracking-tight text-white">
            KINETIC
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            v1.0.4-edge
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#comparison" className="hover:text-white transition-colors">
            Postman vs Kinetic
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/[0.08] text-xs font-mono text-zinc-300 mb-8 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real Live HTTP Network Execution (Zero Mock Data)</span>
          <ChevronRight className="w-3 h-3 text-zinc-500" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.08]">
          The Visual API Engine <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Built for High Concurrency.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Ditch sluggish electron tabs. Chain dynamic JWT tokens, orchestrate microservices on an infinite Bezier canvas, and stress-test endpoints with 500+ virtual users — all in your browser.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm font-semibold shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Workspace</span>
          </button>

          <a
            href="#features"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-mono text-sm transition-colors"
          >
            <span>Explore Capabilities</span>
          </a>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div
          onClick={onLaunchStudio}
          className="mt-16 w-full rounded-2xl border border-white/[0.1] bg-[#0c0d0e]/95 p-3 shadow-2xl relative group cursor-pointer overflow-hidden"
        >
          {/* Top Window Bar */}
          <div className="h-9 px-4 border-b border-zinc-800/60 flex items-center justify-between text-xs font-mono text-zinc-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-zinc-500">KINETIC Workspace · E-Commerce Flow</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="animate-pulse">●</span> Click to Open Live Studio
            </div>
          </div>

          {/* Canvas Illustration */}
          <div className="h-80 sm:h-96 w-full canvas-grid relative flex items-center justify-center p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
              {/* Node 1 */}
              <div className="w-64 p-3.5 rounded-lg bg-zinc-950/90 border border-indigo-500/50 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-medium">1. Real Auth Login</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  POST https://dummyjson.com/auth/login
                </div>
                <div className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  ➔ Extracts &#123;&#123;auth_token&#125;&#125;
                </div>
              </div>

              {/* Cable Arrow */}
              <div className="hidden sm:flex items-center text-indigo-400 font-mono text-xs">
                ────────►
              </div>

              {/* Node 2 */}
              <div className="w-64 p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-medium">2. Authenticated Profile</span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  GET https://dummyjson.com/auth/me
                </div>
                <div className="text-[10px] font-mono text-zinc-500">
                  Bearer &#123;&#123;auth_token&#125;&#125;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-white/[0.06] bg-zinc-950/60 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
          <div>
            <div className="text-3xl font-bold text-white tracking-tight">0.2ms</div>
            <div className="text-xs text-zinc-500 mt-1">Runtime State Resolution</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-400 tracking-tight">500+</div>
            <div className="text-xs text-zinc-500 mt-1">Virtual Concurrent Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400 tracking-tight">100%</div>
            <div className="text-xs text-zinc-500 mt-1">Real Live Network Data</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 tracking-tight">Zero</div>
            <div className="text-xs text-zinc-500 mt-1">CORS Friction (Edge Proxy)</div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Architected for Developer Craft
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Every component is engineered to eliminate context switching, latency, and clunky modal menus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white font-mono">
              Dynamic Variable Chaining
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Extract JSON fields like JWT tokens, order IDs, or cart counts from any response and pass them automatically into downstream nodes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white font-mono">
              Concurrency Stress Lab
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Run real-time parallel virtual user traffic directly against endpoints with 60fps throughput and p50/p90/p95/p99 latency waterfall charts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white font-mono">
              AI Security Pentesting
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesize adversarial payloads for SQLi auth bypasses, boundary float underflows, and double-spend race condition testing with 1-click canvas injection.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: Postman vs Kinetic */}
      <section id="comparison" className="py-20 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Postman vs KINETIC
          </h2>
          <p className="text-xs text-zinc-400">Why developers are switching to visual node-based execution.</p>
        </div>

        <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30 text-xs font-mono">
          <div className="grid grid-cols-3 p-3.5 bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold">
            <span>Capability</span>
            <span className="text-zinc-500">Postman / Insomnia</span>
            <span className="text-indigo-400">KINETIC Engine</span>
          </div>

          <div className="divide-y divide-zinc-800/60">
            <div className="grid grid-cols-3 p-3.5 items-center">
              <span className="text-zinc-300">Workflow Interface</span>
              <span className="text-zinc-500">20+ Cluttered Tabs</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> Infinite Bezier Canvas
              </span>
            </div>

            <div className="grid grid-cols-3 p-3.5 items-center">
              <span className="text-zinc-300">Variable Chaining</span>
              <span className="text-zinc-500">Complex pm.environment scripts</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> 1-Click JSON Path &#123;&#123;var&#125;&#125;
              </span>
            </div>

            <div className="grid grid-cols-3 p-3.5 items-center">
              <span className="text-zinc-300">Load Testing</span>
              <span className="text-zinc-500">Requires K6 / Locust CLI</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> Built-in 500 VU Lab
              </span>
            </div>

            <div className="grid grid-cols-3 p-3.5 items-center">
              <span className="text-zinc-300">Design Aesthetic</span>
              <span className="text-zinc-500">Heavy Electron App</span>
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" /> Linear-grade Carbon Dark
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 text-center border-t border-white/[0.06] bg-gradient-to-b from-transparent to-indigo-950/20">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-xl mx-auto font-mono">
          Ready to experience the fastest API testing workflow?
        </h2>
        <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          No sign up required. 100% free, browser-native, and runs with real public API data out of the box.
        </p>

        <button
          onClick={onLaunchStudio}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-sm font-semibold shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:scale-105"
        >
          <span>Open KINETIC Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-900 text-center text-xs font-mono text-zinc-500">
        KINETIC — Linear-Grade API Workflow & Concurrency Engine. Built with Next.js 14 & TypeScript.
      </footer>
    </div>
  );
};
