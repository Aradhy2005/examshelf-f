import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import Script from "next/script";
import PageWrapper from "@/components/PageWrapper";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
  default: "ExamShelf – University Notes, PYQs & Exam Preparation",
  template: "%s | ExamShelf",
},
  description:
    "Access structured university notes, solved PYQs, important questions, and exam-focused study material for college students. Prepare smarter with ExamShelf.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  keywords: [
    "university notes",
    "previous year questions",
    "college exam preparation",
    "semester notes",
    "important questions",
    "engineering notes",
  ],
};

// Next.js 16 Viewport Configuration
export const viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = "G-XWC58P4H20"; // Centralized ID

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-[#0f172a] text-gray-100 antialiased overflow-x-hidden relative isolate selection:bg-purple-500/30 selection:text-white`}
      >
        {/* Skip to Content for Accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only fixed top-4 left-4 z-[999] bg-purple-600 px-4 py-2 rounded-lg font-bold">
          Skip to content
        </a>

        {/* Razorpay SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
        {/* Google AdSense Verification */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8776404324538637"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* ===== PREMIUM BACKGROUND ENGINE ===== */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
          {/* Main Center Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[420px] h-[420px] md:w-[900px] md:h-[900px] bg-purple-600/15 rounded-full blur-[120px] md:blur-[220px] will-change-[filter,transform]" />
          </div>

          {/* Bottom Accent Glow */}
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[200px] md:w-[800px] md:h-[400px] bg-indigo-500/10 blur-[100px] rounded-full will-change-[filter,transform]" />
        </div>

        {/* 🔔 Premium Toast Provider */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            className: "glass-toast", // You can define this in globals.css
            style: {
              background: "rgba(2, 6, 23, 0.8)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
          }}
        />

        <AuthProvider>
          <Navbar />
          {/* Main ID for Accessibility skip-link */}
          <main id="main-content">
            <PageWrapper>{children}</PageWrapper>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}