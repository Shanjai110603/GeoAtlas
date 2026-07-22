import type { Metadata } from 'next';
import { Inter, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  variable: '--font-noto',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GeoAtlas — Global Geographic Knowledge Platform',
  description: 'Wikipedia for geography: open, structured administrative and spatial knowledge platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${notoSansTamil.variable}`}>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <footer className="w-full border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>© GeoAtlas Knowledge Base — Open Data Platform</p>
              <p className="text-slate-400">
                Data sources: OpenStreetMap (ODbL) • GeoNames (CC-BY) • Wikidata (CC0) • World Bank (CC-BY 4.0)
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
