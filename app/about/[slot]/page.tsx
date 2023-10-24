'use client'

import {useRouter} from "next/navigation";
import Image from "next/image";
import {Row, Space} from "antd";

function Page() {
    const router = useRouter()

    const startClick = () => {
        router.push('/dashboard/slot')
    }
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
