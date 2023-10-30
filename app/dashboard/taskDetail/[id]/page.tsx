"use client"


import {useEffect, useState} from "react";
import {getSubmitTaskListApi, getTaskDetailApi, updateNoteTaskApi} from "@/app/api/note";
import Loading from "@/app/components/Loading";
import {Button, DatePicker, Descriptions, Form, Input, List, message, Modal, Progress, Space, Tag} from "antd";
import Link from "next/link";
import FormItem from "antd/es/form/FormItem";
import FunctionButton from "@/app/components/FunctionButton";
import {SettingOutlined} from "@ant-design/icons";
import BlankLine from "@/app/components/BlankLine";


const {RangePicker} = DatePicker;

export default function Page({params}: { params: { id: string } }) {


    const [taskDetail, setTaskDetail] = useState<any>([])
    const [submitList, setSubmitList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [taskForm, setTaskForm] = useState({
        taskName: '',
        startTime: '',
        endTime: '',
        id: params.id
    })


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


    const handleOk = () => {
        updateNoteTaskApi(params, taskForm).then(res => {
            if (res.data.code == '00000') {
                message.success('修改成功')
                setTaskDetail({
                    ...taskDetail,
                    taskName: taskForm.taskName,
                    startTime: taskForm.startTime,
                    endTime: taskForm.endTime,
                })
                setIsModalOpen(false);
            }
        })
        setTaskForm({
            taskName: '',
            startTime: '',
            endTime: '',
            id: params.id
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setTaskForm({
            taskName: '',
            startTime: '',
            endTime: '',
            id: params.id
        })
    };

    const onTaskChange = (e: any, timeString?: any) => {
        if (timeString == undefined) {
            const {name, value} = e.target;
            setTaskForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setTaskForm((prevState) => ({
                ...prevState,
                ['startTime']: timeString[0],
                ['endTime']: timeString[1]
            }))
        }
    }

    return (
        <div>
            {
                loading ? (
                    <>
                        <h1>
                            {taskDetail.taskName}
                        </h1>
                        <Space>
                            <FunctionButton title={'任务管理'} clickEvent={() => setIsModalOpen(true)}
                                            content={'名称、时间'}
                                            icon={<SettingOutlined style={{fontSize: 20}}/>}/>
                        </Space>
                        <BlankLine/>
                        <Modal title="修改任务" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Form>
                                <FormItem name={'taskName'} label={'任务名称'}>
                                    <Input name={'taskName'} value={taskForm.taskName} onChange={onTaskChange}/>
                                </FormItem>

                                <FormItem name={'startTme'} label={'起止时间'}>
                                    <RangePicker name={'startTme'} onChange={onTaskChange}/>
                                </FormItem>
                            </Form>
                        </Modal>
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
