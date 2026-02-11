import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

export const metadata = {
  title: "College Art Club",
  description: "A platform for creative minds to learn, share and exhibit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
      </head>
      <body>
        <SiteLayout>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}
