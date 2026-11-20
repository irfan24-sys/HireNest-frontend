
import type { Metadata } from "next";
import "./globals.css";

import ReduxProvider from "../redux/provider";

export const metadata: Metadata = {
  title: "HireNest",
  description: "Find your next career opportunity with HireNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
