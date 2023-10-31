"use client"
import {addNote, getBookById, getBookTaskList, getNotesById} from "@/app/api/note";
import React, {useEffect, useState} from "react";
import {Card, Form, List, message, Radio, RadioChangeEvent, Space, Tag} from "antd";
import {EditOutlined, FileOutlined, SettingOutlined} from "@ant-design/icons";
import {Book, Note} from "@/app/config/types";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import Loading from "@/app/components/Loading";
import FunctionButton from "@/app/components/FunctionButton";
import BlankLine from "@/app/components/BlankLine";
import {formatDate} from "@/app/utils";
import TaskItemCard from "@/app/components/TaskCard";


interface NoteListProps {
    notesData: any
}

interface TaskListProps {
    taskData: any,
    permissions: any
}

const NoteList: React.FC<NoteListProps> = ({
                                               notesData
                                           }) => {
    return (
        <div>
            <List
                pagination={{position: 'bottom', align: 'end'}}
                dataSource={notesData}
                renderItem={(item: any, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <FileOutlined style={{fontSize: 24}}/>
                            }
                            title={item.notePermissions == 0 ? <div>{item.title}</div> :
                                <Link href={'/components/MarkDownEdit/' + item.id}>{item.title}</Link>}
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
        </div>
    )
}

const TaskList: React.FC<TaskListProps> = ({
                                               taskData,
                                               permissions
                                           }) => {

    const router = useRouter();

    return (
        <div>
            <List
                pagination={{position: 'bottom', align: 'end', pageSize: 8}}
                grid={{
                    column: 4,
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                }}
                dataSource={taskData}
                renderItem={(item: any) => (
                    <List.Item style={{minWidth: 200}}
                               onClick={() => {
                                   if (permissions == '1')
                                       router.push('/dashboard/taskDetail/' + item.id)
                               }}>
                        <TaskItemCard cardData={item}/>
                    </List.Item>
                )}/>
        </div>
    )
}

export default function Page({params}: { params: { id: string } }) {
    const radioOptions = [
        {label: '笔记', value: '0'},
        {label: '任务', value: '1'},
    ];
    const [typeValue, setTypeValue] = useState('0');

    const [messageApi, contextHolder] = message.useMessage();
    const [bookData, setBookData] = useState<Book>()
    const [notesData, setNotesData] = useState<Note[]>([])
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [bookTask, setBookTask] = useState([]);
    const getData = async () => {
        const data = {
            page: '1',
            pageSize: '1000'
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
            pageSize: 1000
        }
        await getBookTaskList(listParams).then(res => {
            setBookTask(res.data.data.rows);
        })
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

    const onRadioChange = ({target: {value}}: RadioChangeEvent) => {
        console.log('radio1 checked', value);
        setTypeValue(value);
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
                                    <FunctionButton title={'创建新笔记'} clickEvent={addNewNote} content={'文档'}
                                                    icon={<EditOutlined style={{fontSize: 20}}/>}/>
                                    :
                                    <>
                                        <FunctionButton title={'管理知识库'} clickEvent={() => handleManage(params.id)}
                                                        content={'信息、成员、任务'}
                                                        icon={<SettingOutlined style={{fontSize: 20}}/>}/>
                                        <FunctionButton title={'创建新笔记'} clickEvent={addNewNote} content={'文档'}
                                                        icon={<EditOutlined style={{fontSize: 20}}/>}/>
                                    </>
                            }
                        </Space>
                    </div>

                    <BlankLine/>
                    <Radio.Group options={radioOptions} onChange={onRadioChange} value={typeValue} optionType="button"/>
                    <BlankLine/>
                    {
                        typeValue == '0' ? <NoteList notesData={notesData}/> :
                            <TaskList taskData={bookTask} permissions={bookData?.permissions}/>
                    }
                </> : <Loading/>}

        </>
    )
}
