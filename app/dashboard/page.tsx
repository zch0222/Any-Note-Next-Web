'use client'

import {Button, Form, Input, List, message, Modal, notification, Select, Upload, UploadProps} from "antd";
import './page.scss'
import {ContainerOutlined, EditOutlined, FileOutlined, FileTextOutlined, PlusOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import type {Note} from "@/app/config/types";
import {Book} from "@/app/config/types";
import {useEffect, useState} from "react";
import {addBook, addNote, getBooks, getNotesById, getPersonalBooks} from "@/app/api/note";
import Link from "next/link";
import {useRouter} from "next/navigation";
import "../styles/globals.css"
import Loading from "@/app/components/Loading";
import {getAnnouncementsApi, redAnnouncementsApi} from "@/app/api/system";
import FunctionButton from "@/app/components/FunctionButton";
import TextArea from "antd/es/input/TextArea";
import {ls} from "@/app/utils/storage";
import withThemeConfigProvider from "@/app/components/hoc/withThemeConfigProvider";
import {nanoid} from "nanoid";

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
        render: (title: any, record: any) => {
            return <Link href={'/components/MarkDownEdit/' + record.id}>{title}</Link>
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


function Page() {

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

    const getAnnouncements = () => {

        getAnnouncementsApi().then(res => {

            if (res.data.data.hasUnReadAnnouncement == 1) {
                const announcement = res.data.data.announcement

                notification.open({
                    message: announcement.title,
                    description: <div dangerouslySetInnerHTML={{__html: announcement.content}}/>,
                    placement: "top",
                    btn: <Button onClick={() => handleConfirm(announcement.id)}>确定</Button>,
                    onClose: () => handleConfirm(announcement.id)
                });
            }
        })
    }

    const handleConfirm = (id: any) => {
        const data = {
            announcementId: id
        }

        redAnnouncementsApi(data).then(res => {
            notification.destroy()
        })
    }

    useEffect(() => {
        getAnnouncements()
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
                {/*<FloatButton style={{width: 50, height: 50}} icon={<PlusOutlined/>} type={"primary"}/>*/}
            </> : <Loading/>
            }
        </div>
    )
}

function FunctionGroup(props: any) {

    const router = useRouter();
    const token = ls.get('accessToken');
    const [open, setOpen] = useState(false);
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ addBookLoading, setAddBookLoading] = useState(false);
    const [listData, setListData] = useState<Note[]>(props.notesData);
    const [bookFormOpen, setBookFormOpen] = useState(false);

    const [bookForm, setBookForm] = useState({
        name: "",
        detail: "",
        cover: "",
        type: 0
    })

    const uploadProps: UploadProps = {
        name: 'image',
        action: `${process.env.NEXT_PUBLIC_BASE_URL}/api/note/bases/covers`,
        headers: {
            'accessToken': token
        },
        data: {
            "uploadId": nanoid()
        },
        listType: "picture-card",
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if (info.file.response.code == '00000') {
                    console.log(info.file.response.data)
                    setBookForm((prevState: any) => ({
                        ...prevState,
                        ["cover"]: info.file.response.data.url,
                    }))
                } else {
                    message.error(info.file.response.msg)
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 导入失败！`);
            }
        },
    };

    const [bookData, setBookData] = useState<Book[]>([]);
    const [personalBookData, setPersonalBookData] = useState<Book[]>([])

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };


    const showModal = () => {
        getAllBooks()
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onLoadMore = () => {
    };

    const resetBookForm = () => {
        setBookForm({
            name: "",
            detail: "",
            cover: "",
            type: 0
        })
    }

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

    const onBookFormChange = (e: any) => {
        const {name, value} = e.target;
        setBookForm((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
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

    const addNewBook = () => {
        setAddBookLoading(true)
        addBook(bookForm).then(res => {
            setAddBookLoading(false)
            if (res.data.code == "00000") {
                message.success("新增知识库成功！")
                router.push('/dashboard/bookDetail/' + res.data.data.id)
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
            <FunctionButton title={'新建笔记'} content={'文档'} clickEvent={showModal}
                            icon={<EditOutlined style={{fontSize: 20}}/>}/>
            <FunctionButton title={'新建知识库'} content={'知识库'} clickEvent={() => {
                setBookFormOpen(true)
            }}
                            icon={<ContainerOutlined style={{fontSize: 20}}/>}/>

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
                {/*<h4>组织知识库</h4>*/}
                {/*<List*/}
                {/*    dataSource={bookData}*/}
                {/*    renderItem={(item) => (*/}
                {/*        <List.Item onClick={() => addNewNote(item.id)} className={'hover'}>*/}
                {/*            <List.Item.Meta*/}
                {/*                avatar={<FileTextOutlined style={{fontSize: 24}}/>}*/}
                {/*                description={item.knowledgeBaseName}*/}
                {/*            />*/}
                {/*        </List.Item>*/}
                {/*    )}*/}
                {/*/>*/}
                <h4>知识库</h4>
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

            <Modal
                title="新建知识库"
                open={bookFormOpen}
                confirmLoading={addBookLoading}
                onOk={() => {
                    setBookFormOpen(false)
                    addNewBook()
                }}
                onCancel={() => {
                    setBookFormOpen(false)
                }}
                afterOpenChange={resetBookForm}
                // destroyOnClose={true}
                // footer={null}
                okText="确认"
                cancelText="取消"
            >
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    style={{maxWidth: 600}}
                >
                    <Form.Item label="知识库名称">
                        <Input name={"name"} value={bookForm.name} onChange={onBookFormChange}/>
                    </Form.Item>
                    <Form.Item label="知识库详情">
                        <TextArea name={"detail"} value={bookForm.detail} onChange={onBookFormChange} rows={4}/>
                    </Form.Item>
                    <Form.Item label="封面" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload {...uploadProps}>
                            <div>
                                <PlusOutlined/>
                                <div style={{marginTop: 8}}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
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

export default withThemeConfigProvider(Page)

