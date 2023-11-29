import '../styles/globals.css'
import {Inter} from 'next/font/google'
import Header from "@/app/components/AboutHeader/AboutHeader";
import Footer from "@/app/components/AboutFooter/AboutFooter"
import React from "react";
import {Auth} from "@/app/components/Auth/Auth";

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
        <div style={{display: "flex", flexDirection: "column"}}>
            <Auth>
                <Header/>
                <div>
                    {children}
                </div>
                <Footer/>
            </Auth>
        </div>
    )
}
