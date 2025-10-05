import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import PageTransition from "@/components/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shivraj.online"), // !TODO: Replace with your domain
  title: {
    default: "Shivraj Soni - Software Developer",
    template: "%s | Shivraj Soni",
  },
  description: "The portfolio of Shivraj Soni, a software developer specializing in building modern web applications.",
  keywords: ["Shivraj Soni", "Software Developer", "Portfolio", "Next.js", "React", "TypeScript", "Rust"],
  authors: [{ name: "Shivraj Soni", url: "https://shivrajsoni.online" }], // !TODO: Replace with your domain
  creator: "Shivraj Soni",
  publisher: "Shivraj Soni",
  robots: "index, follow",
  icons: {
    icon: "/github_pfp.jpeg",
  },
  openGraph: {
    title: "Shivraj Soni - Software Developer",
    description: "The portfolio of Shivraj Soni, a software developer specializing in building modern web applications.",
    url: "https://shivraj.online", // !TODO: Replace with your domain
    siteName: "Shivraj Soni's Portfolio",
    images: [
      {
        url: "/github_pfp.jpeg", // !TODO: Add your OG image to the public directory
        width: 1200,
        height: 630,
        alt: "Shivraj Soni's Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivraj Soni - Software Developer",
    description: "The portfolio of Shivraj Soni, a software developer specializing in building modern web applications.",
    creator: "@_callmeXavier_", // !TODO: Replace with your Twitter handle
    images: ["/github_pfp.jpeg"], // !TODO: Add your OG image to the public directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shivraj Soni's Portfolio",
    "url": "https://shivrajsoni.com", // !TODO: Replace with your domain
    "author": {
      "@type": "Person",
      "name": "Shivraj Soni",
      "url": "https://shivrajsoni.com" // !TODO: Replace with your domain
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageTransition>{children}</PageTransition>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          key="website-structured-data"
        />
      </body>
    </html>
  );
}
