import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";
import image from "../public/images/background.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import titleImage from "@/public/images/final_logo_talkeys.ico";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Talkeys",
  description: "Talkeys",
};


// export icons: {
//   icon: titleImage.src,
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundImage: `url(${image.src})`,
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          width: "100%",
        }}
      >
          <Navbar />
          {children}
          <Footer />
      </body>
    </html>

  );
}
