import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Manager',
  description: 'Premium restaurant management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
