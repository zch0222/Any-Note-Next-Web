'use client'

import './page.scss'
import {Button, Card, FloatButton, Input, List, Modal, Radio, Space} from "antd";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import {useEffect, useState} from "react";
import {addBook, getBooks, getPersonalBooks} from "@/app/api/note";
import {Book} from "@/app/config/types";
import {useRouter} from "next/navigation";
import Loading from "@/app/components/Loading";

const {TextArea} = Input;


export default function Books() {
    return (
        <div className={"app_container app-book"}>
            <div className={"title"}>知识库</div>
            <FunctionGroup/>

            <div className={"main"}>
                <BookList/>
            </div>

            <FloatButton style={{width: 50, height: 50}} icon={<PlusOutlined/>} type={"primary"}/>
        </div>
    )
}

function FunctionGroup() {
    const [open, setOpen] = useState(false);
    const [booKForm, setBookForm] = useState({
        name: '',
        detail: '',
        cover: 'https://i0.hdslb.com/bfs/new_dyn/18d03597c3df44d36c50891685d8d3153494361880856991.jpg@662w_560h_1e_1c.avif',
        type: 0,
    })
    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const onBookFormChange = (e: any) => {
        const {name, value} = e.target;
        setBookForm({
            ...booKForm,
            [name]: value
        })
    }

    const confirm = () => {

        addBook(booKForm).then(res => {
            console.log(res)
            hideModal();
        })
        console.log(booKForm);

    }

    return (
        <div className={"flex_middle"} style={{justifyContent: "start"}}>
            {/*<Card style={{borderRadius: "20px", background: '#01B96B'}}*/}
            {/*      bodyStyle={{display: 'flex', padding: '10px 20px 10px 10px'}}*/}
            {/*      hoverable*/}
            {/*      onClick={showModal}>*/}
            {/*    <PlusOutlined style={{fontSize: 20, color: "white", marginRight: 8}}/>*/}
            {/*    <div className={'function_title'}>添加新的知识库</div>*/}
            {/*</Card>*/}

            <Modal
                title="新建知识库"
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                footer={null}
                width={400}
            >
                <Space.Compact block style={{marginTop: 25}}>
                    <InboxOutlined style={{fontSize: 24, marginRight: 5}}/><Input name='name' value={booKForm.name}
                                                                                  placeholder={"知识库名称"}
                                                                                  onChange={onBookFormChange}/>
                </Space.Compact>

                <TextArea name='detail' value={booKForm.detail} placeholder={'知识库简介 (选填)'}
                          onChange={onBookFormChange} rows={10} style={{margin: '20px 0'}}></TextArea>
                <Radio.Group name='type' onChange={onBookFormChange} value={booKForm.type}>
                    <Radio value={0}>正常</Radio>
                    <Radio value={1}>停用</Radio>
                </Radio.Group>
                <Button
                    onClick={confirm}
                    style={{width: '100%', background: '#22D187', color: "white", margin: '10px 0'}}>新建</Button>
            </Modal>
        </div>
    )
}

function BookList() {
    const [loading, setLoading] = useState(false);

    const [bookData, setBookData] = useState<Book[]>([]);
    const [personalBookData, setPersonalBookData] = useState<Book[]>([])
    const router = useRouter();

    const getAllBooks = async () => {
        const params = {
            page: '1',
            pageSize: '10'
        }
        getBooks(params).then(res => {
            setBookData(res.data.data.rows);
        })

        await getPersonalBooks(params).then(res => {
            setPersonalBookData(res.data.data.rows);
            setLoading(true)
        })
    }

    const handleDetail = (id: string) => {
        console.log(id)
        router.push('/dashboard/bookDetail/' + id)
    }

    useEffect(() => {
        getAllBooks()
    }, [])

    return (
        <>
            {loading ? <>
                <h3>组织知识库</h3>
                <List
                    grid={{
                        column: 6,
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                    }}
                    dataSource={bookData}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={<img alt={item.knowledgeBaseName} src={item.cover}/>}
                                onClick={() => handleDetail(item.id)}
                            >
                                <Meta title={item.knowledgeBaseName}/>
                            </Card>
                        </List.Item>
                    )}/>
                <h3>非组织知识库</h3>
                <List
                    grid={{
                        column: 6,
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                    }}
                    dataSource={personalBookData}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={<img alt={item.knowledgeBaseName} src={item.cover}/>}
                                onClick={() => handleDetail(item.id)}
                            >
                                <Meta title={item.knowledgeBaseName}/>
                            </Card>
                        </List.Item>
                    )}/>
            </> : <Loading/>}
        </>
    )
}
