"use client"


import {useEffect, useState} from "react";
import {getSubmitTaskListApi, getTaskDetailApi, sendBackNoteApi, updateNoteTaskApi} from "@/app/api/note";
import Loading from "@/app/components/Loading";
import {
    Button,
    DatePicker,
    Descriptions,
    Form,
    Input,
    List,
    message,
    Modal,
    Popconfirm,
    Progress,
    Space,
    Tag
} from "antd";
import FormItem from "antd/es/form/FormItem";
import FunctionButton from "@/app/components/FunctionButton";
import {SettingOutlined} from "@ant-design/icons";
import BlankLine from "@/app/components/BlankLine";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import DateTimeFormatter from "@/app/utils";
import {useRouter} from "next/navigation";
import TaskManageNoteEditChart from "@/app/components/TaskManageNoteOperationChart";

dayjs.extend(customParseFormat);
const {RangePicker} = DatePicker;

export default function Page({params}: { params: { id: string } }) {
    const router = useRouter();

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
        setLoading(false)

        const param = {
            noteTaskId: params.id,
            page: 1,
            pageSize: 100
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
            } else {
                setTaskForm({
                    taskName: '',
                    startTime: '',
                    endTime: '',
                    id: params.id
                })
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
                ['startTime']: DateTimeFormatter.formatDateStringToISO(timeString[0]),
                ['endTime']: DateTimeFormatter.formatDateStringToISO(timeString[1])
            }))
        }
    }

    const sendBack = (id: any) => {
        sendBackNoteApi({id: id}).then(res => {
            if (res.data.code == '00000') {
                message.success('成功退回！');
                getSubmitTaskList();
            }
        })
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
                        <TaskManageNoteEditChart noteTaskId={parseInt(params.id)}/>
                        <Modal title="修改任务" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                               destroyOnClose={true}>
                            <Form>
                                <FormItem name={'taskName'} label={'任务名称'}>
                                    <Input name={'taskName'} value={taskForm.taskName} onChange={onTaskChange}/>
                                </FormItem>

                                <FormItem name={'startTme'} label={'起止时间'}>
                                    <RangePicker name={'startTme'} onChange={onTaskChange} showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                                    }}
                                                 format="YYYY-MM-DD HH:mm:ss"/>
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
                                <div>{DateTimeFormatter.formatDate(taskDetail.startTime)} 至 {DateTimeFormatter.formatDate(taskDetail.endTime)}</div>
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
                            renderItem={(item: any) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={item.submissionNickname}
                                        description={'提交时间: ' + DateTimeFormatter.formatDate(item.createTime)}
                                    />
                                    <Popconfirm
                                        title="退回笔记"
                                        description="确定要退回该笔记?"
                                        okText="确定"
                                        cancelText="取消"
                                        onConfirm={() => sendBack(item.id)}
                                    >
                                        <Button type={"text"} danger>退回</Button>
                                    </Popconfirm>
                                    <Button type={"primary"} onClick={() => {
                                        router.push('/components/MarkDownEdit/' + item.noteId)
                                    }}>查看详情
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </>
                ) : <Loading/>
            }
        </div>
    )
}
