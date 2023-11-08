"use client"

import {Avatar, Button, Card, message, Space, Tag, Timeline} from "antd";
import BlankLine from "@/app/components/BlankLine";
import DetailCard from "@/app/(Detail)/components/DetailCard";
import {useEffect, useState} from "react";
import {getNoteTaskHistoryApi, sendBackNoteApi} from "@/app/api/note";
import Link from "next/link";
import Loading from "@/app/components/Loading";
import {decryptAndEncodeObject} from "@/app/utils";
import {useSearchParams} from "next/navigation";
import {ls} from "@/app/utils/storage";

export default function Page({params}: { params: { id: string } }) {

    const [query, setQuery] = useState(decryptAndEncodeObject(useSearchParams().get("query")));

    console.log(query)
    const [loading, setLoading] = useState(true)

    const [data, setData] = useState({
        submissionNickname: ls.get('userData').nickname,
        noteTitle: '',
        noteId: ''
    });

    const [historyItem, setHistoryItem] = useState([{
        children: '',
        color: ''
    }]);

    const sendBack = () => {
        sendBackNoteApi({id: params.id}).then(res => {
            console.log(res)
            if (res.data.code == '00000') {
                message.success('成功退回！');
            }
        })
    }

    const getTaskHistory = () => {
        setLoading(true)

        getNoteTaskHistoryApi({id: params.id}).then(res => {
            console.log(res);
            if (res.data.code == '00000') {
                const items = res.data.data.map((item: any) => {
                    if (item.type == 3) {
                        const userData = {
                            submissionNickname: item.operatorNickName,
                            noteTitle: item.noteHistoryTitle,
                            noteId: item.noteId
                        }

                        setData(userData);
                    }

                    return {
                        children: item.type == 1 ? "创建" : item.type == 2 ? "修改任务" : item.type == 3 ? "提交任务" : item.type == 4 ? "退回提交" : "添加成员",
                        color: item.type == 1 ? "yellow" : item.type == 2 ? "blue" : item.type == 3 ? "green" : item.type == 4 ? "red" : "gray",
                    }
                })
                setHistoryItem(items);
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        getTaskHistory()
    }, [])

    return (
        <>
            {
                loading ? <Loading/> :
                    <div style={{display: "flex", minHeight: '70vh', margin: '30px auto 30px'}}>
                        <Card style={{marginRight: 20}}>
                            <Card>
                                <Space>
                                    <Avatar src={'/icons/icon.jpg'} size={50}/>
                                    <span>{data.submissionNickname}</span>
                                </Space>
                            </Card>

                            <BlankLine/>

                            <Space>
                                <DetailCard title={'笔记: ' + data.noteTitle} width={300}>
                                    {data.noteId ? <Button type={"text"}><Link
                                            href={{pathname: '/components/MarkDownEdit/' + data.noteId}}>查看详情</Link></Button> :
                                        <Tag>暂无笔记</Tag>}
                                    {query?.isManager ?
                                        <Button type={"text"} danger onClick={sendBack}>退回</Button> : ''}
                                </DetailCard>
                                <DetailCard title={'操作次数'} width={150}>
                                    {historyItem.length}
                                </DetailCard>
                                <DetailCard title={'当前状态'} width={150}>
                                    {historyItem[historyItem.length - 1]?.children}
                                </DetailCard>
                            </Space>
                        </Card>
                        <div>
                            <Card title={'提交情况'}>
                                <Timeline
                                    items={historyItem}
                                />
                            </Card>
                        </div>
                    </div>
            }
        </>
    )
}
