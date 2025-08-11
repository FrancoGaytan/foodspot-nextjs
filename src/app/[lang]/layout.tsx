import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import '@styles/main.scss';
import '@styles/globals.css';
import ToastContainer from '@components/UI/Toaster';
import { AuthProvider } from '@contexts/AuthContext';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodSpot-NextJs',
  description: 'FoodSpot es una aplicacion de gestion de eventos y usuarios',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function RootLayout(props: RootLayoutProps) {
  const localParams = await props.params;
  const lang = localParams.lang;

  return (
    <html lang={lang}>
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ToastContainer /> {props.children}
        </AuthProvider>
      </body>
    </html>
  );
}
