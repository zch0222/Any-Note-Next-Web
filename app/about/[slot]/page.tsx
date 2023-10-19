'use client'

import {Button} from "antd";
import {useRouter} from "next/navigation";
import {Auth} from "@/app/components/Auth/Auth";

function Page() {
    const router = useRouter()

    const startClick = () => {
        router.push('/dashboard/slot')
    }
    return (
        <>
            <h1>
                首页
                {/*<Button onClick={startClick}>进入学习随记</Button>*/}
            </h1>
        </>
    )
}

export default Page
