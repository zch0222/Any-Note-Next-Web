"use client"
import {addNote, getBookById, getBookTaskList, getNotesById} from "@/app/api/note";
import {useEffect, useState} from "react";
import {Button, Card, Form, List, message, Space, Tag} from "antd";
import {FileOutlined} from "@ant-design/icons";
import {Book, Note} from "@/app/config/types";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import Loading from "@/app/components/Loading";

export default function Page({params}: { params: { id: string } }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [bookData, setBookData] = useState<Book>()
    const [notesData, setNotesData] = useState<Note[]>([])
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [bookTask, setBookTask] = useState([]);
    const getData = async () => {
        const data = {
            page: '1',
            pageSize: '10'
        }

        getBookById(params).then(res => {
            setBookData(res.data.data)
        })

        getNotesById(params, data).then(res => {
            setNotesData(res.data.data.rows)
        })

        const listParams = {
            knowledgeBaseId: params.id,
            page: 1,
            pageSize: 10
        }
        await getBookTaskList(listParams).then(res => {
            setBookTask(res.data.data.rows);
        })
    }

    const formatDate = (inputTimeStr: any) => {
        const inputDate = new Date(inputTimeStr);

        const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
        const day = String(inputDate.getDate()).padStart(2, '0');
        const hours = String(inputDate.getHours()).padStart(2, '0');
        const minutes = String(inputDate.getMinutes()).padStart(2, '0');

        return `${month}-${day} ${hours}:${minutes}`;
    }

    const handleManage = (id: any) => {

        if (bookData?.permissions != '1') {
            error();
        } else {
            router.push('/dashboard/bookManage/' + id);
        }
    }

    const addNewNote = () => {
        const data = {
            title: '无标题笔记',
            knowledgeBaseId: bookData?.id
        }
        addNote(data).then(res => {
            if (res.data.code == "00000") {
                router.push('/components/MarkDownEdit/' + res.data.data);
            }
        })
    }

    const error = () => {
        messageApi.open({
            type: 'error',
            content: '暂无管理权限，请联系管理员申请',
        });
    };

    useEffect(() => {
        getData().then(() => {
            setLoading(true);
        })
    }, [])

    // @ts-ignore
    return (
        <>
            {loading ?
                <>
                    <div>
                        <h1>{bookData?.knowledgeBaseName}</h1>
                        <Space>
                            {
                                bookData?.permissions != '1' ?
                                    <Button onClick={addNewNote}>
                                        创建新笔记
                                    </Button> :
                                    <>
                                        <Button onClick={() => handleManage(params.id)}>
                                            管理知识库
                                        </Button>
                                        <Button onClick={addNewNote}>
                                            创建新笔记
                                        </Button>
                                    </>
                            }
                        </Space>
                    </div>
                    <List
                        pagination={{position: 'bottom', align: 'end'}}
                        dataSource={notesData}
                        renderItem={(item: any, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={
                                        <FileOutlined style={{fontSize: 24}}/>
                                    }
                                    title={<Link href={'/components/MarkDownEdit/' + item.id}>{item.title}</Link>}
                                    description={formatDate(item.updateTime)}
                                />
                                <div> {item.notePermissions == 7 ?
                                    <Tag color="success">管理</Tag> : item.notePermissions == 6 ?
                                        <Tag color="processing">读取编辑</Tag> : item.notePermissions == 4 ?
                                            <Tag color="warning">读取</Tag> : <Tag color={"default"}>无权限</Tag>}
                                </div>
                            </List.Item>
                        )}
                    />

                    <div className={"title"}>任务</div>
                    <List
                        grid={{
                            column: 4,
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                        }}
                        dataSource={bookTask}
                        renderItem={(item: any) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    onClick={() => {
                                        if(bookData?.permissions == '1')
                                            router.push('/dashboard/taskDetail/' + item.id)
                                    }}
                                >
                                    <Meta title={item.taskName}
                                          description={
                                              <Form>
                                                  <FormItem label={'任务状态'}>
                                                      {/*{item.status == 0 ? (*/}
                                                      {/*    <Tag color="#87d068">进行中</Tag>) : (*/}
                                                      {/*    <Tag color="#f50">已结束</Tag>)}*/}
                                                      {new Date(item.endTime) > new Date() ? (
                                                          <Tag color="#87d068">进行中</Tag>) : (
                                                          <Tag color="#f50">已结束</Tag>)}
                                                  </FormItem>
                                                  <FormItem label={'起止时间'}>
                                                      <div>{item.startTime.substring(0, 10)} - {item.endTime.substring(0, 10)}</div>
                                                  </FormItem>
                                                  <FormItem label={'发布人'}>
                                                      <div>{item.taskCreatorNickname}</div>
                                                  </FormItem>
                                                  <FormItem label={'提交状态'}>
                                                      <div>{item.submissionStatus == 0 ? (
                                                          <Tag bordered={false} color="success">已提交</Tag>) : (
                                                          <Tag bordered={false}
                                                               color="processing">未提交</Tag>)}</div>
                                                  </FormItem>
                                                  <FormItem label={'提交的笔记'}>
                                                      <div>{item.submissionStatus == 0 ? (
                                                          <Link
                                                              href={'/components/MarkDownEdit/' + item.submissionNoteId}
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                              }}>查看</Link>) : (
                                                          <Tag bordered={false}
                                                               color="processing">暂无笔记</Tag>)}</div>
                                                  </FormItem>
                                              </Form>}
                                    />
                                </Card>
                            </List.Item>
                        )}/>
                </> : <Loading/>}

        </>
    )
}
