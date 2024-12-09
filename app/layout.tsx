import type { Metadata } from "next";
import "./globals.css";
import Providers from "./provider";
import NavigationBar from "./component/NavbarComponents/NavigationBar";
import Footer from "./component/FooterComponents/Footer";
import { Poppins } from "next/font/google";
import Script from 'next/script';


export const metadata: Metadata = {
  title: "Outread",
  description: "Read Summarised Research Articles",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(process.env.NORMAL)

  return (
    <html className="" lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-01BTJ0QS38"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-01BTJ0QS38');
          `}
        </Script>

        <Script id="hotjar">
          {`
             (function(h,o,t,j,a,r){
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
          h._hjSettings={hjid:5146863,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}

        </Script>

        <Script id='gtag'>
          {`
          (function(w,d,s,l,i){
            w[l] = w[l] || [];
          w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-5Z7KK8B9');
            `}
        </Script>
        <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
      </head>
      <body >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5Z7KK8B9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Providers>
          <NavigationBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}