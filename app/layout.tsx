import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aura Agentic Commerce | Razorpay AI Growth Platform',
  description: 'Autonomous B2C & B2B AI Agent Commerce Platform with NPCI UAP/AP2 protocols, conversational checkout, revenue growth bundling, and bounded Razorpay test-mode payments.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
