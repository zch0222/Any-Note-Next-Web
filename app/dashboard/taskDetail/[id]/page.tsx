"use client"


import {useEffect, useState} from "react";
import {getSubmitTaskListApi, getTaskDetailApi} from "@/app/api/note";
import Loading from "@/app/components/Loading";
import {Descriptions, List, Progress, Tag} from "antd";
import Link from "next/link";

export default function Page({params}: { params: { id: string } }) {


    const [taskDetail, setTaskDetail] = useState<any>([])
    const [submitList, setSubmitList] = useState([]);

    const [loading, setLoading] = useState(false);

    const getTaskDetail = async () => {

        await getTaskDetailApi(params).then(res => {
            if (res.data.code == '00000') {
                setTaskDetail(res.data.data);
            }
        })
    }

    const getSubmitTaskList = () => {
        const param = {
            noteTaskId: params.id,
            page: 1,
            pageSize: 10
        }

        getSubmitTaskListApi(param).then(res => {
            setLoading(true)
            setSubmitList(res.data.data.rows)
        })
    }

    useEffect(() => {
        getTaskDetail().then(() => {
            getSubmitTaskList()
        })
    }, [])


    return (
        <div>
            {
                loading ? (
                    <>
                        <h1>
                            {taskDetail.taskName}
                        </h1>
                        <Descriptions>
                            <Descriptions.Item label={'任务状态'}>
                                {/*{taskDetail.status == 0 ? (*/}
                                {/*    <Tag color="#87d068">进行中</Tag>) : (*/}
                                {/*    <Tag color="#f50">已结束</Tag>)}*/}
                                {new Date(taskDetail.endTime) > new Date() ? (
                                    <Tag color="#87d068">进行中</Tag>) : (
                                    <Tag color="#f50">已结束</Tag>)}
                            </Descriptions.Item>
                            <Descriptions.Item label={'起止时间'}>
                                <div>{taskDetail.startTime.substring(0, 10)} - {taskDetail.endTime.substring(0, 10)}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label={'总人数'}>
                                <div>{taskDetail.needSubmitCount}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label={'已提交人数'}>
                                <div>{taskDetail.submittedCount}</div>
                            </Descriptions.Item>
                            <Descriptions.Item label={'提交进度'}>
                                <div style={{width: 170}}>
                                    <Progress
                                        percent={taskDetail.submissionProgress * 100}
                                        size="small"/>
                                </div>
                            </Descriptions.Item>
                        </Descriptions>

                        <List
                            pagination={{position: 'bottom', align: 'center'}}
                            dataSource={submitList}
                            renderItem={(item: any, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.submissionNickname}
                                        description={'提交时间: ' + item.createTime}
                                    />
                                    <Link href={'/components/MarkDownEdit/' + item.noteId}>查看笔记</Link>
                                </List.Item>
                            )}
                        />
                    </>
                ) : <Loading/>
            }
        </div>
    )
}
