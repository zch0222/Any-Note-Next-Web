'use client'

import {useRouter} from "next/navigation";
import Image from "next/image";
import {Row, Space} from "antd";
import { notFound } from 'next/navigation'

function Page() {
    const router = useRouter()
    // notFound()
    return (
        <>
            {/*<h1>*/}
            {/*    首页*/}
            {/*    /!*<Button onClick={startClick}>进入学习随记</Button>*!/*/}
            {/*</h1>*/}

            <Row justify={"center"}>
                <Image src={'/background/about_background.png'} alt={''} width={1587/3} height={2245/3}/>
            </Row>
        </>
    )
}

export default Page
