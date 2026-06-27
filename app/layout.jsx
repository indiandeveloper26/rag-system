import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./componet/sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "AI Dashboard",
  description: "AI Application",
};



export default function RootLayout({ children }) {


  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >


      <body
        className="
                h-screen
                overflow-hidden
                bg-slate-950
                text-slate-100
                antialiased
                "
      >


        <div className="flex h-screen">


          {/* Sidebar */}

          <aside className="w-64 shrink-0">

            <Sidebar />

          </aside>




          {/* Page Content */}

          <main
            className="
                        flex-1
                        overflow-y-auto
                        "
          >

            {children}


          </main>



        </div>



      </body>


    </html>

  );

}