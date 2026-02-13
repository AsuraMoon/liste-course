import "./app.css";

export const metadata = {
  title: "MiamListe",
  description: "Votre liste de courses moderne",
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#2563eb"
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="app-root">{children}</body>
    </html>
  );
}
