import '@vera-common/styles/globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Vera — Build faster. Ship smarter.',
  description:
    'A full-stack monorepo starter with NX, Elysia, Next.js, Drizzle, and Shadcn UI — wired up and ready to go.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
