import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MindGuide Directory Demo',
  description: 'Custom mental health professional directory with subscription billing demo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
