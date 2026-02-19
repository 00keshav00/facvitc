import "./globals.css";
import SiteLayout from "@/components/SiteLayout";
import dbConnect from "@/lib/db";
import Setting from "@/models/Setting";

export async function generateMetadata() {
  const settings = await getSettings();
  
  return {
    title: settings.siteTitle || "Fine Arts Club - VIT Chennai",
    description: "A platform for creative minds to learn, share and exhibit.",
    icons: {
      icon: settings.favicon ? `${settings.favicon}?v=${Date.now()}` : '/favicon.ico',
      apple: settings.favicon ? `${settings.favicon}?v=${Date.now()}` : '/favicon.ico',
    },
  };
}

async function getSettings() {
  try {
    await dbConnect();
    const settings = await Setting.findOne().lean();
    return JSON.parse(JSON.stringify(settings || {}));
  } catch (error) {
    return {};
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
      </head>
      <body>
        <SiteLayout settings={settings}>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}
