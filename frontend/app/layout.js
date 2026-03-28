import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata = {
  title: "Divya Gyan Dhara | Coming Soon",
  description: "Divya Gyan Dhara is a concept-based learning ecosystem for Classes 5–12. Future-ready education launching soon in Dehradun and Uttarakhand.",
  keywords: ["Divya Gyan Dhara", "concept-based learning", "education Dehradun", "Uttarakhand tutoring", "Classes 5-12", "future-ready education"],
  openGraph: {
    title: "Divya Gyan Dhara | Coming Soon",
    description: "Divya Gyan Dhara is a concept-based learning ecosystem for Classes 5–12. Future-ready education launching soon in Dehradun and Uttarakhand.",
    url: "https://divyagyandhara.com",
    siteName: "Divya Gyan Dhara",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-primary-bg text-surface-light transition-colors duration-500">
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StoreProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </body>
    </html>
  );
}
