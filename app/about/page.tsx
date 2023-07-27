'use client'

import {Button} from "antd";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter()
    const startClick = () => {
        router.push('/dashboard')
    }
    return (
        <>
            <h1>
                首页
                <Button onClick={startClick}>进入学习随记</Button>
            </h1>
        </>
    )
}
