import '../styles/globals.css'
import {ConfigProvider, Layout} from "antd";
import {dashboardSiderTheme} from "@/app/config/theme";
import DashboardSider from "@/app/components/DashboardSider/DashboardSider";

export const metadata = {
    title: '工作台 · 学习随记',
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
        //     <title>工作台 · 学习随记</title>
        // </head>
        // <body>
        // <AntdRegistry>
        //     <ConfigProvider theme={theme}>
        <section>
            <div style={{minHeight: '100vh', display: "flex"}}>
                <ConfigProvider theme={dashboardSiderTheme}>
                    <DashboardSider/>
                </ConfigProvider>
                <Layout style={{minHeight: '100vh', background: 'white', padding: 30}}>
                    {children}
                </Layout>
            </div>
        </section>
        //     </ConfigProvider>
        // </AntdRegistry>
        // </body>
        // </html>
    )
}
