import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
// import {Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BaseLayout } from "@/components/app/layout";
import { App } from "antd";
import { SessionProvider } from "next-auth/react";

import { ReactQueryProvider } from "@/context/ReactQueryProvider";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({


//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Create a client

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>
            <App>
              <ReactQueryProvider>
                <BaseLayout>
                  {children}
                </BaseLayout>
              </ReactQueryProvider>
            </App>
          </AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
