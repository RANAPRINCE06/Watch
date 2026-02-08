'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const HIDE_FOOTER = ['/admin'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith('/admin');

  return (
    <>
      {!pathname?.startsWith('/admin') && <Header />}
      <main className={pathname?.startsWith('/admin') ? '' : 'min-h-screen pt-20'}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </>
  );
}
