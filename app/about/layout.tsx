import '../styles/globals.css'
import {Inter} from 'next/font/google'
import Header from "@/app/components/AboutHeader/AboutHeader";
import Footer from "@/app/components/AboutFooter/AboutFooter"
import React from "react";

const inter = Inter({subsets: ['latin']})
export const metadata = {
    title: '学习随记',
    description: 'Generated by Next.js',
}
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        // <html lang="en">
        // <head>
        //     <link rel="icon"
        //           href="/icons/LOGO.png"
        //           type="image"
        //           sizes="any"/>
        // </head>
        // <body className={inter.className}>
        // <AntdRegistry>
        //     <ConfigProvider theme={theme}>
        <div style={{display:"flex",flexDirection:"column"}}>
            <Header/>
            <div>
                {children}
            </div>
            <Footer/>
        </div>
        //     </ConfigProvider>
        // </AntdRegistry>
        // </body>
        // </html>
    )
}
