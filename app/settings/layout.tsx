import '../styles/globals.css'
import {ConfigProvider, Layout} from "antd";
import AntdRegistry from "@/app/lib/AntdRegistry";
import {dashboardSiderTheme, theme} from "@/app/config/theme";
import DashboardSider from "@/app/components/DashboardSider/DashboardSider";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import SettingsSider from "@/app/components/SettingsSider/SettingsSider";

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
        <html lang="en">
        <head>
            <link rel="icon"
                  href="/icons/LOGO.png"
                  type="image"
                  sizes="any"/>
            <title>工作台 · 学习随记</title>
        </head>
        <body>
        <AntdRegistry>
            <ConfigProvider theme={theme}>
                <div style={{minHeight: '100vh', display: "flex"}}>
                    <ConfigProvider theme={dashboardSiderTheme}>
                        <SettingsSider/>
                    </ConfigProvider>
                    <Layout style={{minHeight: '100vh', background: '#FBFBFB', padding: 30}}>
                        {children}
                    </Layout>
                </div>
            </ConfigProvider>
        </AntdRegistry>
        </body>
        </html>
    )
}
