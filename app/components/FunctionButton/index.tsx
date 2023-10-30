import {Card, Space} from "antd";
import React from "react";
import './styles.scss'
import BlankLine from "@/app/components/BlankLine";


interface FunctionButtonProps {
    title: any,
    content?: any,
    clickEvent: any,
    icon: any
}

const FunctionButton: React.FC<FunctionButtonProps> = ({
                                                           title,
                                                           content,
                                                           clickEvent,
                                                           icon
                                                       }) => {

    return (
        <div>
            <Space>
                <Card style={{border: '2px #01B96B solid', marginRight: 20}} bodyStyle={{display: 'flex', padding: '5px 10px'}}
                      hoverable onClick={clickEvent}>
                    {icon}

                    <div className={'function'}>
                        <div className={'function_title'}>{title}</div>
                        <div className={'function_content'}>{content}</div>
                    </div>
                </Card>
            </Space>
            <BlankLine/>
        </div>
    )
}
export default FunctionButton
