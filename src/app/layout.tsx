import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { clsx } from 'clsx';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Noticrm | Modern B2B SaaS CRM',
  description: 'The minimalist AI CRM for High-Growth Teams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
