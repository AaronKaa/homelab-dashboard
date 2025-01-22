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
      <body className="bg-white text-gray-600 antialiased dark:bg-gray-900 dark:text-gray-400">
        <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
          {children}
        </main>
      </body>
    </html>
  );
}
