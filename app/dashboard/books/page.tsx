'use client'

import './page.scss'
import {Button, Card, Input, List, Modal, Space, FloatButton} from "antd";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import {useState} from "react";

const {TextArea} = Input;

interface DataType {
    id: string;
    cover: string;
    className: string;
    teacherName: string;
    time: string;
}

const data: DataType[] = [
    {
        id: '1',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'C语言程序设计',
        teacherName: '虞歌',
        time: '3-16周'
    },
    {
        id: '2',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'Java',
        teacherName: '滕国栋',
        time: '3-16周'
    },
    {
        id: '1',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'C语言程序设计',
        teacherName: '虞歌',
        time: '3-16周'
    },
    {
        id: '2',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'Java',
        teacherName: '滕国栋',
        time: '3-16周'
    },
    {
        id: '3',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'C语言程序设计',
        teacherName: '虞歌',
        time: '3-16周'
    },
    {
        id: '4',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        className: 'Java',
        teacherName: '滕国栋',
        time: '3-16周'
    },
];

export default function Personal() {
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };


    return (
        <div className={"app_container app-book"}>
            <div className={"title"}>知识库</div>
            <div className={"flex_middle"} style={{justifyContent: "start"}}>
                <Card style={{borderRadius: "20px", background: '#01B96B'}}
                      bodyStyle={{display: 'flex', padding: '10px 20px 10px 10px'}}
                      hoverable
                      onClick={showModal}>
                    <PlusOutlined style={{fontSize: 20, color: "white", marginRight: 8}}/>
                    <div className={'function_title'}>添加新的知识库</div>
                </Card>
            </div>

            <div className={"main"}>
                <List
                    grid={{
                        column: 4,
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                    }}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={<img alt={item.className} src={item.cover}/>}
                            >
                                <Meta title={item.className} description={item.teacherName}/>
                                <div>{item.time}</div>
                            </Card>
                        </List.Item>
                    )}/>

                <Modal
                    title="新建知识库"
                    open={open}
                    onOk={hideModal}
                    onCancel={hideModal}
                    footer={null}
                    okText="确认"
                    cancelText="取消"
                    width={400}
                >
                    <Space.Compact block style={{marginTop:25}}>
                        <InboxOutlined style={{fontSize: 24, marginRight: 5}}/><Input placeholder={"知识库名称"}/>
                    </Space.Compact>

                    <TextArea placeholder={'知识库简介 (选填)'} rows={10} style={{margin: '20px 0'}}></TextArea>

                    <Button style={{width:'100%',background:'#22D187',color:"white",margin:'10px 0'}}>新建</Button>
                </Modal>
            </div>

            <FloatButton style={{width:50,height:50}} icon={<PlusOutlined/>} type={"primary"}/>
        </div>
    )
}
