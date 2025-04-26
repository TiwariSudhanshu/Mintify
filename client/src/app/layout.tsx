import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/store/provider";
import {Toaster} from "sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mintify - Supply Chain Transparency with Blockchain",
  description: "Track products from source to destination with immutable blockchain records and NFT verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            <Navbar />
            {children}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  document.addEventListener('DOMContentLoaded', function() {
                    const navbar = document.querySelector('.navbar');
                    if (navbar) {
                      window.addEventListener('scroll', function() {
                        if (window.scrollY > 50) {
                          navbar.classList.add('navbar-scrolled');
                        } else {
                          navbar.classList.remove('navbar-scrolled');
                        }
                      });
                    }
                  });
                `,
              }}
            />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
