import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-ag",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimGizi",
  description: "Sistem Informasi & Simulasi Gizi",
  icons: {
    icon: "/images/Logo-SimGizi.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: set theme before React hydrates so user never sees wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('simgizi-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var d = document.documentElement;
                  d.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    d.classList.add('dark');
                  } else {
                    d.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f9fa] dark:bg-[#0B0F14] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {children}
        <Toaster position="bottom-right" visibleToasts={4} />
      </body>
    </html>
  );
}
