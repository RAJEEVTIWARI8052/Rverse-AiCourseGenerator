import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Rverse AI - Generate. Learn. Master.',
  description: 'Build AI-curated full courses from a single prompt. Get video lessons, transcriptions, study notes, and MCQs — all generated in seconds.',
  manifest: '/manifest.json',
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

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className={`${outfit.variable} font-sans antialiased`} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}