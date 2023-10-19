'use client'

import {Button, Card, FloatButton, List, Modal, Select, Spin, Table} from "antd";
import './page.scss'
import {ContainerOutlined, EditOutlined, FileOutlined, FileTextOutlined, PlusOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import type {Note} from "@/app/config/types";
import {Book} from "@/app/config/types";
import {useEffect, useState} from "react";
import {addNote, getBooks, getNotesById, getPersonalBooks} from "@/app/api/note";
import Link from "next/link";
import {useRouter} from "next/navigation";
import "../../styles/globals.css"
import Loading from "@/app/components/Loading";

const columns: ColumnsType<Note> = [
    {
        title: 'Icon',
        dataIndex: 'icon',
        key: 'icon',
        align: "left",
        width: 50,
        render: (icon: any) => {
            const flag = icon == 1;
            return flag ? <FileOutlined style={{fontSize: 24}}/> : <FileTextOutlined style={{fontSize: 24}}/>
        },
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        align: "left",
        ellipsis: true,
        render: (title: any,record:any) => {
            return <Link href={'/components/MarkDownEdit/'+ record.id}>{title}</Link>
        }
    },
    {
        title: 'Time',
        dataIndex: 'updateTime',
        key: 'updateTime',
        align: "right",
        width: 200
    },
];


export default function Page() {

    const router = useRouter();
    const [notesData, setNotesData] = useState<Note[]>([])
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        const data = {
            page: '1',
            pageSize: '10'
        }

        await getNotesById({id: '2'}, data).then(res => {
            setLoading(true)
            setNotesData(res.data.data.rows)
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className={"app_container app-dashboard"}>
            {loading ? <>
                <div className={"title"}>开始</div>
                <FunctionGroup notesData={notesData}/>
                {/*<div className={'main'}>*/}
                {/*    <div className={'main_title'}>*/}
                {/*        笔记*/}
                {/*    </div>*/}
                {/*    <div className={'main_content'}>*/}
                {/*        /!*<SelectGroup/>*!/*/}
                {/*        <Table dataSource={notesData} rowKey={data => data.id} pagination={false} showHeader={false}*/}
                {/*               columns={columns}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <FloatButton style={{width: 50, height: 50}} icon={<PlusOutlined/>} type={"primary"}/>
            </> : <Loading/>
            }
        </div>
    )
}

function FunctionGroup(props: any) {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState<Note[]>(props.notesData);

    const [bookData, setBookData] = useState<Book[]>([]);
    const [personalBookData, setPersonalBookData] = useState<Book[]>([])

    console.log(props.notesData)
    const showModal = () => {
        getAllBooks()
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onLoadMore = () => {
    };

    const getAllBooks = async () => {
        const params = {
            page: '1',
            pageSize: '10'
        }
        await getBooks(params).then(res => {
            setBookData(res.data.data.rows);
        })

        await getPersonalBooks(params).then(res => {
            setPersonalBookData(res.data.data.rows);
        })
    }

    const addNewNote = (id: any) => {
        const data = {
            title: '无标题笔记',
            knowledgeBaseId: id
        }
        addNote(data).then(res => {
            console.log(res)
            if (res.data.code == "00000") {
                router.push('/components/MarkDownEdit/' + res.data.data);
            }
        })
    }


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
                <h4>组织知识库</h4>
                <List
                    dataSource={bookData}
                    renderItem={(item) => (
                        <List.Item onClick={() => addNewNote(item.id)} className={'hover'}>
                            <List.Item.Meta
                                avatar={<FileTextOutlined style={{fontSize: 24}}/>}
                                description={item.knowledgeBaseName}
                            />
                        </List.Item>
                    )}
                />
                <h4>非组织知识库</h4>
                <List
                    dataSource={personalBookData}
                    renderItem={(item) => (
                        <List.Item onClick={() => addNewNote(item.id)} className={'hover'}>
                            <List.Item.Meta
                                avatar={<FileTextOutlined style={{fontSize: 24}}/>}
                                description={item.knowledgeBaseName}
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            {/*<Card style={{border: '2px #01B96B solid'}} bodyStyle={{display: 'flex', padding: 10}} hoverable>*/}
            {/*    <ContainerOutlined style={{fontSize: 20}}/>*/}

            {/*    <div className={'function'}>*/}
            {/*        <div className={'function_title'}>新建知识库</div>*/}
            {/*        <div className={'function_content'}>文档、思维导图、视频</div>*/}
            {/*    </div>*/}
            {/*</Card>*/}
        </div>
    )
}

function SelectGroup() {
    return (
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
    )
}

