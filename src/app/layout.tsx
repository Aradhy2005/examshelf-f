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
  title: "ExamShelf – University Notes, PYQs & Exam Preparation",
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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[#0f172a] text-gray-100 antialiased overflow-x-hidden relative isolate scroll-smooth selection:bg-purple-500/30 selection:text-white`}
      >
        {/* Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Google Analytics */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XWC58P4H20');
  `}
</Script>


        {/* ===== SAFE PREMIUM BACKGROUND GLOW ===== */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

          {/* Main Center Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[420px] h-[420px] md:w-[900px] md:h-[900px] bg-purple-600/20 rounded-full blur-[140px] md:blur-[200px]" />
          </div>

          {/* Bottom Accent Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] md:w-[600px] md:h-[300px] bg-indigo-500/10 blur-[100px] rounded-full" />

        </div>
        {/* ======================================== */}

        {/* 🔔 Premium Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#020617",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "12px 16px",
            },
          }}
        />

        <AuthProvider>
          <Navbar />

          <PageWrapper>
            {children}
          </PageWrapper>

          <Footer />
        </AuthProvider>


      </body>
    </html>
  );
}
