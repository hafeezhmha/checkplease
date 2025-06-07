import type { Metadata } from "next";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CheckPlease! - Your Chess.com Receipt",
  description: "Generate a gamified receipt of your Chess.com stats and recent activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" 
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased
                       bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100
                       min-h-screen flex flex-col game-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeToggle />
          <main className="flex-1 pb-16 max-w-2xl mx-auto px-4 py-8 sm:py-16 w-full">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
