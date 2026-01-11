import "./globals.css";

export const metadata = {
  title: "Node.js Auth MVP",
  description: "A minimal authentication MVP built with Next.js, Express, and MongoDB.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
