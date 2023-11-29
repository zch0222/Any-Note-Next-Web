'use client'

import {NextUIProvider} from '@nextui-org/react'
import { ThemeProvider } from "next-themes";
import AntdRegistry from "@/app/lib/AntdRegistry";
import { Provider } from 'react-redux'
import store from "@/app/store"
import { ThemeProviderProps } from "next-themes/dist/types";
import React from "react";
import { ConfigProvider } from "antd";
import {theme} from "@/app/config/theme";


export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    return (
        <Provider store={store}>
            <NextUIProvider>
                <AntdRegistry>
                    <ThemeProvider {...themeProps}>
                        <ConfigProvider theme={theme}>
                            {children}
                        </ConfigProvider>
                    </ThemeProvider>
                </AntdRegistry>
            </NextUIProvider>
        </Provider>


    )
}
