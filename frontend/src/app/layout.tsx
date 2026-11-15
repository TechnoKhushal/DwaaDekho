import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers';

export const metadata: Metadata = {
  title: 'DwaaDekho — Care, closer',
  description: 'Search the DwaaDekho medicine catalogue and find verified pharmacies near you.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
