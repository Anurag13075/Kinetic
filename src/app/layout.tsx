import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KINETIC — Linear-Grade Visual API Workflow & Concurrency Stress Engine',
  description:
    'Visual node-based API workflow orchestrator, variable-chaining testbed, and high-concurrency load testing engine built with modern developer craft.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-[#fafafa] antialiased selection:bg-indigo-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
