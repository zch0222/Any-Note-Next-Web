"use client"

import {Button} from "antd";
import {useRouter} from "next/navigation";

export default function PageName() {
    const router = useRouter()
    return (
        <>
            <h1>出错了</h1>
            <Button onClick={()=> router.push('/about/slot')}>点击回到首页</Button>
        </>
    )
}
