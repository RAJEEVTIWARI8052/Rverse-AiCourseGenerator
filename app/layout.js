import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Rverse AI - Generate. Learn. Master.',
  description: 'Build AI-curated full courses from a single prompt. Get video lessons, transcriptions, study notes, and MCQs — all generated in seconds.',
  manifest: '/manifest.json',
  themeColor: '#060612',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rverse AI',
  },
};

export const viewport = {
  themeColor: '#060612',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import CursorEffect from '../components/CursorEffect';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
          <CursorEffect />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}