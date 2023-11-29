'use client'
import { ConfigProvider, theme as antdTheme } from "antd";
import React, {ComponentType, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {RootState} from "@/app/store";
import {useTheme} from "next-themes";

export default function withThemeConfigProvider(Component: ComponentType<any>) {
    return function AntdComponent(props: any) {
        const globalTheme = useSelector((state: RootState) => state.theme)
        const {theme, setTheme} = useTheme()
        const dispatch = useDispatch()

        useEffect(() => {
            setTheme(globalTheme)
        }, [globalTheme])

        return (
            <ConfigProvider
                theme={{
                    algorithm: globalTheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
                }}
            >
                <Component {...props}/>
            </ConfigProvider>
        )
    }
}
