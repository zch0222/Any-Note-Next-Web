"use client"

import React from "react";
import {Row} from "antd";

interface HeaderProps {
    title: any
}

const Header: React.FC<HeaderProps> = ({
                                           title
                                       }) => {

    return (
        <div style={{width:'100%'}}>
            <Row style={{background:'rgb(239,239,239)',color:"grey",width:'100%',height:40}} justify={"center"} align={"middle"}>
                {title}
            </Row>
        </div>
    )
}

export default Header
