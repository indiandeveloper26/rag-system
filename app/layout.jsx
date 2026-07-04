import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./componet/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Dashboard",
  description: "AI Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">

        {/* Main Application Wrapper */}
        <div className="flex h-screen w-screen overflow-hidden relative">

          {/* Responsive Sidebar */}
          <Sidebar />

          {/* Page Content Viewport - Ab yeh full space lega */}
          <main className="flex-1 h-full overflow-y-auto min-w-0 relative bg-slate-950 flex flex-col">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}