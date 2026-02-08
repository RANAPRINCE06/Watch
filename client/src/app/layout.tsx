import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { LoaderProvider } from '@/components/Loader';
import AppShell from '@/components/AppShell';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CHRONO | Luxury Timepieces',
  description: 'Premium Swiss-inspired luxury watches. Crafted for those who demand excellence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <body className="font-sans antialiased bg-luxury-black text-luxury-cream">
        <LoaderProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1a1a', color: '#f5f0e6', border: '1px solid #c9a962' },
            }}
          />
        </LoaderProvider>
      </body>
    </html>
  );
}
