// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My AYP Portal",
  description: "Employee portal take-home test",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-nav">
            <div className="app-logo">
              <div className="app-logo-mark" />
              <div>
                <div className="app-logo-text-main">AYP Portal</div>
                <div className="app-logo-text-sub">Gen-Z Employee Console</div>
              </div>
            </div>
            <div className="chips-row">
              <span className="chip">Next.js · TypeScript</span>
              <span className="chip">Laravel 11 · JWT</span>
            </div>
          </header>
          <main className="app-main">
            <div className="app-container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
