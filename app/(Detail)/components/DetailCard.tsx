"use client"

import React from "react";
import {Card, Space} from "antd";

const DetailCard = ({
                        children,
                        title,
                        width
                    }: {
    children: React.ReactNode,
    title: any,
    width: any
}) => {

    return (
        <Card style={{minWidth:width}}>
            <Space><h4 style={{marginTop: 0}}>{title}</h4></Space>
            <div style={{minHeight: 30}}>
                {children}
            </div>
        </Card>
    )
}

export default DetailCard
