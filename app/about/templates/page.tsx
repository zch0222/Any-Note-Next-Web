import {Row} from "antd";
import Image from "next/image";

export default function Personal() {
    return (
        <>
            <Row justify={"center"}>
                <Image src={'/background/templates_background.png'} alt={''} width={1587 / 3} height={2245 / 3}/>
            </Row>
        </>
    )
}
