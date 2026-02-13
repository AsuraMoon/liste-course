import "./app.css";

export const metadata = {
  title: "MiamListe",
  description: "Votre liste de courses moderne par AsuraMoon",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="app-root">
        <div className="page-wrapper">
          {children}

          <footer className="global-footer">
            <p>
              Made with ❤️ by AsuraMoon —{" "}
              <a
                href="https://github.com/AsuraMoon"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
