import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Muhammad Afzal Soomro - Portfolio AI Assistant',
  description: 'Explore verified developer projects and technical experience with an interactive, grounded AI assistant for Muhammad Afzal Soomro.',
  openGraph: {
    title: 'Muhammad Afzal Soomro - Portfolio AI Assistant',
    description: 'Explore verified developer projects and technical experience with an interactive, grounded AI assistant for Muhammad Afzal Soomro.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Afzal Soomro - Portfolio AI Assistant',
    description: 'Explore verified developer projects and technical experience with an interactive, grounded AI assistant for Muhammad Afzal Soomro.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
