'use client'
import { FloatButton as AntdFloatButton } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";

import withThemeConfigProvider from "../hoc/withThemeConfigProvider";
import {RootState} from "@/app/store";
import {setTheme} from "@/app/store/theme/themeSlice";

function FloatButton() {
    const dispatch = useDispatch()
    const theme = useSelector((state: RootState) => state.theme)

    return (
        <AntdFloatButton.Group
          trigger="hover"
          icon={<MoreOutlined/>}
        >
            <AntdFloatButton
                type={"dark" === theme ? "primary" : "default"}
                icon={
                    <Image
                        src="https://anynote.obs.cn-east-3.myhuaweicloud.com/anynote_%20Shanghai/assets/moon.svg"
                        height={20}
                        width={20}
                        alt="moon"
                    />
                }
                onClick={() => {
                    if ("dark" === theme) {
                        dispatch(setTheme("light"))
                    }
                    else {
                        dispatch(setTheme("dark"))
                    }
                }}
            />
        </AntdFloatButton.Group>
    )
}


export default withThemeConfigProvider(FloatButton)
