import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./providers";

export const metadata: Metadata = {
  title: "BioAdaptive Learning Platform",
  description: "AI-powered adaptive learning platform using biopsychosocial science to optimize your study performance and mental wellbeing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
