import '../styles/globals.css'
import type {Metadata} from 'next'

export const metadata: Metadata = {
    title: '登录',
    description: 'Generated by create next app',
}

export default function LoginLayout({
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
        // <body>
        // <AntdRegistry>
        //     <ConfigProvider theme={theme}>
        <section>
            {children}
        </section>
        //     </ConfigProvider>
        // </AntdRegistry>
        // </body>
        // </html>
    )
}
