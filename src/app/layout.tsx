export const metadata = {
  title: 'THE ATLAS - Minimal',
  description: 'Test build',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}