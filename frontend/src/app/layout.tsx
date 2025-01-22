import "./globals.css";

export const metadata = {
  title: "Homelab Dashboard",
  description: "A simple homelab dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-gray-400">
        <main className="flex min-h-screen items-center justify-center gap-2 bg-gray-800">
          {children}
        </main>
      </body>
    </html>
  );
}
