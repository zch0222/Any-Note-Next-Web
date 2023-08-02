'use client'

import {Button, Card, List, Modal, Select, Table} from "antd";
import './page.scss'
import {ContainerOutlined, EditOutlined, FileOutlined, FileTextOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {useState} from "react";

interface DataType {
    id: string;
    icon: number;
    name: string;
    time: string;
    type: string;
    from: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Icon',
        dataIndex: 'icon',
        key: 'icon',
        align: "right",
        width: 50,
        render: (icon: any, record: DataType, index) => {
            const flag = icon == 1;
            return flag ? <FileOutlined style={{fontSize: 24}}/> : <FileTextOutlined style={{fontSize: 24}}/>
        },
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        ellipsis: true
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        align: "center",
        width: 100
    },
    {
        title: 'From',
        dataIndex: 'from',
        key: 'From',
        align: "center",
        width: 200
    },
];

const data: DataType[] = [
    {
        id: '1',
        icon: 1,
        name: 'C语言程序设计',
        time: '2023/7/28',
        type: '文档',
        from: 'C语言程序设计',
    },
    {
        id: '2',
        icon: 2,
        name: '安卓真难啊',
        time: '2023/7/28',
        type: '思维导图',
        from: 'Android移动开发',
    },
];

export default function Page() {
    const [open, setOpen] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState(data);

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onLoadMore = () => {
    };

    const loadMore =
        !initLoading && !loading ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>loading more</Button>
            </div>
        ) : null;

    return (
        <div className={"app_container app-dashboard"}>
            <div className={"title"}>开始</div>
            <div className={"flex_middle"} style={{justifyContent: "start"}}>
                <Card style={{border: '2px #01B96B solid', marginRight: 20}} bodyStyle={{display: 'flex', padding: 10}}
                      hoverable onClick={showModal}>
                    <EditOutlined style={{fontSize: 20}}/>

                    <div className={'function'}>
                        <div className={'function_title'}>新建笔记</div>
                        <div className={'function_content'}>文档、思维导图、视频</div>
                    </div>
                </Card>

                <Modal
                    title="新建笔记"
                    open={open}
                    onOk={hideModal}
                    onCancel={hideModal}
                    footer={null}
                    okText="确认"
                    cancelText="取消"
                >
                    <div>选择一个知识库</div>
                    <List
                        loading={initLoading}
                        loadMore={loadMore}
                        dataSource={listData}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={item.icon == 1 ? <FileOutlined style={{fontSize: 24}}/> :
                                        <FileTextOutlined style={{fontSize: 24}}/>}
                                    description={item.name}
                                />
                            </List.Item>
                        )}
                    />
                </Modal>

                <Card style={{border: '2px #01B96B solid'}} bodyStyle={{display: 'flex', padding: 10}} hoverable>
                    <ContainerOutlined style={{fontSize: 20}}/>

                    <div className={'function'}>
                        <div className={'function_title'}>新建知识库</div>
                        <div className={'function_content'}>文档、思维导图、视频</div>
                    </div>
                </Card>
            </div>

            <div className={'main'}>
                <div className={'main_title'}>
                    笔记
                </div>
                <div className={'main_content'}>
                    <div className={'content_classify'}>
                        <div className={'classify_type'}>
                            <Select
                                defaultValue="1"
                                style={{width: 120}}
                                bordered={false}
                                options={[
                                    {value: '1', label: '文档'},
                                    {value: '2', label: '思维导图'},
                                ]}
                            />
                        </div>
                        <div className={'classify_from'}>
                            <Select
                                defaultValue="1"
                                style={{width: 120}}
                                bordered={false}
                                options={[
                                    {value: '1', label: 'C语言程序设计'},
                                    {value: '2', label: 'Android移动开发'},
                                ]}
                            />
                        </div>
                    </div>
                    <Table pagination={false} showHeader={false} columns={columns} dataSource={data}/>
                </div>
            </div>
        </div>
    )
}
