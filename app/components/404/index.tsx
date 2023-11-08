"use client"

import {MehOutlined} from "@ant-design/icons";
import {Button, Space} from "antd";
import Link from "next/link";
import BlankLine from "@/app/components/BlankLine";

export default function Page() {
    return (
        <div style={{
            width: '100vw',
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <Space><MehOutlined style={{fontSize: 50}}/> <span style={{fontSize: 50}}>404</span></Space>
            <BlankLine/>
            <Button type={"primary"}><Link href={'/about'}>点击回到主页</Link></Button>
        </div>
    )
}


