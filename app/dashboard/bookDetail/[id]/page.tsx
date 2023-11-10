"use client"
import {addNote} from "@/app/api/note";
import React, {useMemo, useState} from "react";
import {List, message, Radio, RadioChangeEvent, Space, Tag, Tooltip} from "antd";
import {EditOutlined, FileOutlined, SettingOutlined} from "@ant-design/icons";
import {useParams, useRouter} from "next/navigation";
import Link from "next/link";
import Loading from "@/app/components/Loading";
import FunctionButton from "@/app/components/FunctionButton";
import BlankLine from "@/app/components/BlankLine";
import DateTimeFormatter, {encryptAndEncodeObject} from "@/app/utils";
import TaskItemCard from "@/app/components/TaskCard";
import {getBookDataById, getBookTaskData, getNotesData} from "@/hooks/note";

const NoteList = () => {
    const params: any = useParams()
    const {noteData, isNoteDataLoading, isNoteError} = getNotesData(params.id)

    if (isNoteDataLoading) return <Loading/>

    return (
        <div>
            <List
                pagination={{position: 'bottom', align: 'end'}}
                dataSource={noteData}
                renderItem={(item: any, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <FileOutlined style={{fontSize: 24}}/>
                            }
                            title={item.notePermissions == 0 ? <div>{item.title}</div> :
                                <Link href={'/components/MarkDownEdit/' + item.id}>{item.title}</Link>}
                            description={DateTimeFormatter.formatDate(item.updateTime)}
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

const TaskList = () => {

    const router = useRouter();
    const [arrow, setArrow] = useState('Show')
    const params: any = useParams()
    const {taskData, isTaskDataLoading, isTaskError} = getBookTaskData(params.id)
    const {bookData, isBookDataLoading, isBookError} = getBookDataById(params.id)

    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }

        if (arrow === 'Show') {
            return true;
        }

        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    if (isTaskDataLoading || isBookDataLoading) return <Loading/>

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
                    <Tooltip placement="right" title={'查看详情'} arrow={mergedArrow}>
                        <List.Item style={{minWidth: 200}}
                                   onClick={() => {
                                       if (bookData?.permissions == '1')
                                           router.push('/dashboard/taskDetail/' + item.id)
                                   }}>

                            {bookData?.permissions == '1' ? <Link href={{
                                    pathname: '/dashboard/taskDetail/' + item.id
                                }}> <TaskItemCard cardData={item}/></Link> :
                                <Link href={{
                                    pathname: '/submitDetail/' + item.id,
                                    query: {query: encryptAndEncodeObject({isManager: false})}
                                }} target={"_blank"}> <TaskItemCard cardData={item}/></Link>}
                        </List.Item>
                    </Tooltip>
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
    const router = useRouter();
    const {bookData, isBookDataLoading, isBookError} = getBookDataById(params.id)

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
        setTypeValue(value);
    };


    if (isBookDataLoading) return <Loading/>

    // @ts-ignore
    return (
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
                typeValue == '0' ? <NoteList/> :
                    <TaskList/>
            }
        </>
    )
}
