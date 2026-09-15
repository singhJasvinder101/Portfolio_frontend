import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "portfolio",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="pf">
          <Nav />
          {children}
          <footer>built with Go-brain &amp; late-night coffee · © 2026 jasvinder</footer>
        </div>
      </body>
    </html>
  );
}
