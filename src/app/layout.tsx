import '@/styles/global.css';

import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import Providers from '@/utils/providers';

export const metadata: Metadata = {
  title: 'Drfasttrack Admin',
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/drfasttrackfavicon.ico',
    },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="../../public/assets/drfasttrackfavicon.ico"
          sizes="any"
        />
      </head>
      <body>
        <Toaster position="top-center" richColors closeButton />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}

// Enable edge runtime but you are required to disable the `migrate` function in `src/libs/DB.ts`
// Unfortunately, this also means it will also disable the automatic migration of the database
// And, you will have to manually migrate it with `drizzle-kit push`
// export const runtime = 'edge';
