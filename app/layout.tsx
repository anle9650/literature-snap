import NavBar from "@/components/NavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "@/components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Literature Snap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <NavBar />
          <main className="flex max-h-screen flex-col justify-between p-6">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
