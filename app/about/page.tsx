"use client"

import Image from "next/image";
import {Row} from "antd";
import {Auth} from "@/app/components/Auth/Auth";

function Page() {

    return (
        <>
            <Row justify={"center"}>
                <Image src={'/background/about_background.png'} alt={''} width={1587 / 3} height={2245 / 3}/>
            </Row>
        </>
    )
}

export default Page
