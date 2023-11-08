"use client"
import {
    Button,
    DatePicker,
    Form,
    Input,
    List,
    Menu,
    MenuProps,
    message,
    Modal,
    Space,
    Tag,
    Tooltip,
    Upload,
    UploadProps
} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {AppstoreOutlined, FileOutlined, FlagOutlined, MailOutlined, TeamOutlined} from "@ant-design/icons";
import {addNoteTask, getAdminBookTaskList, getBookById, getBookUsersList, updateBookApi} from "@/app/api/note";
import FormItem from "antd/es/form/FormItem";
import {ls} from "@/app/utils/storage";
import Loading from "@/app/components/Loading";
import {useRouter} from "next/navigation";
import FunctionButton from "@/app/components/FunctionButton";
import BlankLine from "@/app/components/BlankLine";
import TaskItemCard from "@/app/components/TaskCard";
import DateTimeFormatter from "@/app/utils";
import dayjs from "dayjs";

const {TextArea} = Input;
const {RangePicker} = DatePicker;

interface InformationCardProps {
    formData: any,
    changeEvent: any,
    clickEvent: any
}

interface MemberCardProps {
    uploadProps: any,
    loadingList: any,
    membersList: any,
    uploadStatus: any
}

interface TaskCardProps {
    changeEvent: any,
    loadingList: any,
    noteTask: any,
    showModal: any,
    isModalOpen: any,
    handleOk: any,
    handleCancel: any,
}

const InformationCard: React.FC<InformationCardProps> = ({
                                                             clickEvent,
                                                             changeEvent,
                                                             formData
                                                         }) => {
    return (
        <div style={{width: '60vw'}}>
            <div>名称</div>
            <div style={{maxWidth: 250}}>
                <Input name='name' placeholder={'知识库名称'} value={formData.name}
                       onChange={changeEvent}
                       style={{
                           margin: '20px 0', borderRadius: '6px',
                           fontSize: '15px'
                       }} size={"large"}></Input>
            </div>
            <div>
                简介
            </div>
            <TextArea name='detail' placeholder={'知识库简介 (选填)'} value={formData.detail}
                      onChange={changeEvent} rows={10}
                      style={{margin: '20px 0'}}></TextArea>

            <Button onClick={clickEvent} type={"primary"}>更新信息</Button>
        </div>
    )
}

const MemberCard: React.FC<MemberCardProps> = ({
                                                   uploadProps,
                                                   loadingList,
                                                   membersList,
                                                   uploadStatus
                                               }) => {

    return (
        <div>
            <Space>
                <Upload {...uploadProps}>
                    <Button>
                        导入成员名单
                    </Button>
                </Upload>
                <Button type={"primary"} disabled={uploadStatus.status}
                        onClick={() => window.open(uploadStatus.url)}>下载导入成员名单</Button>
                <Button
                    onClick={() => window.open('https://anynote.obs.cn-east-3.myhuaweicloud.com/anynote_%20Shanghai/knowledge_base/files/import_user_template.xlsx')}>下载导入模板</Button>
            </Space>
            <List
                loading={loadingList.members}
                pagination={{position: 'bottom', align: 'end'}}
                dataSource={membersList}
                renderItem={(item: any, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <FileOutlined style={{fontSize: 24}}/>
                            }
                            title={item.nickname}
                            description={item.username}
                        />
                        <div>{item.permissions == 1 ?
                            <Tag color="success">管理（查看、编辑）</Tag> : item.permissions == 2 ?
                                <Tag color="processing">编辑（查看）</Tag> : item.permissions == 3 ?
                                    <Tag color="warning">查看</Tag> :
                                    <Tag color="default">无</Tag>}
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}

const TaskCard: React.FC<TaskCardProps> = ({
                                               changeEvent,
                                               loadingList,
                                               noteTask,
                                               showModal,
                                               isModalOpen,
                                               handleOk,
                                               handleCancel,
                                           }) => {
    const [arrow, setArrow] = useState('Show');
    const router = useRouter();

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

    const handleTaskDetail = (id: any) => {
        router.push('/dashboard/taskDetail/' + id)
    }

    return (
        <div>
            <div>
                <FunctionButton title={'创建新任务'} content={'名称、时间'}
                                clickEvent={showModal}
                                icon={<FlagOutlined style={{fontSize: 20}}/>}/>
                <Modal title="创建任务" open={isModalOpen} onOk={handleOk}
                       onCancel={handleCancel}>
                    <Form>
                        <FormItem name={'taskName'} label={'任务名称'}>
                            <Input name={'taskName'} onChange={changeEvent}/>
                        </FormItem>

                        <FormItem name={'startTme'} label={'起止时间'}>
                            <RangePicker name={'startTme'} onChange={changeEvent}
                                         showTime={{
                                             hideDisabledOptions: true,
                                             defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                                         }}
                                         format="YYYY-MM-DD HH:mm:ss"/>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
            <List
                loading={loadingList.tasks}
                pagination={{position: 'bottom', align: 'end', pageSize: 8}}
                grid={{
                    column: 4,
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                }}
                dataSource={noteTask}
                renderItem={(item: any) => (
                    <List.Item onClick={() => handleTaskDetail(item.id)}
                               style={{minWidth: 200}}>
                        <Tooltip placement={"right"} title={'查看提交详情'} arrow={mergedArrow}>
                            <TaskItemCard cardData={item} isManager={true}/>
                            {/*<Card*/}
                            {/*    hoverable*/}
                            {/*>*/}
                            {/*    <Meta title={item.taskName}*/}
                            {/*          description={*/}
                            {/*              <Form>*/}
                            {/*                  <FormItem label={'任务状态'}>*/}
                            {/*                      /!*{item.status == 0 ? (*!/*/}
                            {/*                      /!*    <Tag color="#87d068">进行中</Tag>) : (*!/*/}
                            {/*                      /!*    <Tag color="#f50">已结束</Tag>)}*!/*/}
                            {/*                      {new Date(item.endTime) > new Date() ? (*/}
                            {/*                          <Tag color="#87d068">进行中</Tag>) : (*/}
                            {/*                          <Tag color="#f50">已结束</Tag>)}*/}
                            {/*                  </FormItem>*/}
                            {/*                  <FormItem label={'起止时间'}>*/}
                            {/*                      <div>{item.startTime.substring(0, 10)} - {item.endTime.substring(0, 10)}</div>*/}
                            {/*                  </FormItem>*/}
                            {/*                  <FormItem label={'总人数'}>*/}
                            {/*                      <div>{item.needSubmitCount}</div>*/}
                            {/*                  </FormItem>*/}
                            {/*                  <FormItem label={'已提交人数'}>*/}
                            {/*                      <div>{item.submittedCount}</div>*/}
                            {/*                  </FormItem>*/}
                            {/*                  <FormItem label={'提交进度'}>*/}
                            {/*                      <div style={{width: 170}}>*/}
                            {/*                          <Progress*/}
                            {/*                              percent={item.submissionProgress * 100}*/}
                            {/*                              size="small"/>*/}
                            {/*                      </div>*/}
                            {/*                  </FormItem>*/}
                            {/*              </Form>}*/}
                            {/*    />*/}
                            {/*</Card>*/}
                        </Tooltip>
                    </List.Item>
                )}/>
        </div>
    )
}

function ContentCard(props: any) {
    const [key, setKey] = useState('information');

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState({
        members: false,
        tasks: false
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const token = ls.get('accessToken');
    const [uploadStatus, setUploadStatus] = useState({
        status: true,
        url: ''
    })

    const uploadProps: UploadProps = {
        name: 'users',
        action: 'https://api.anynote.tech/api/note/manage/bases/import',
        headers: {
            'accessToken': token
        },
        data: {
            knowledgeBaseId: props.bookId
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if (info.file.response.code == '00000') {
                    setUploadStatus({
                        status: false,
                        url: info.file.response.data.excelUrl
                    })

                    setLoadingList({
                        ...loadingList,
                        members: true
                    })

                    const usersListForm = {
                        knowledgeBaseId: props.bookId,
                        pageSize: 1000,
                        page: 1
                    }

                    getBookUsersList(usersListForm).then(res => {
                        setMembersList(res.data.data.rows);
                        setLoadingList({
                            ...loadingList,
                            members: false
                        })
                        message.success(`${info.file.name} 导入成功！`)
                    })
                } else {
                    message.error(info.file.response.msg)
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 导入失败！`);
            }
        },
    };


    const [informationForm, setInformationForm] = useState({
        name: '',
        detail: ''
    })

    const [taskForm, setTaskForm] = useState({
        taskName: '',
        startTime: '',
        endTime: '',
        knowledgeBaseId: props.bookId
    })

    const [membersList, setMembersList] = useState([]);

    const [noteTask, setNoteTask] = useState([]);

    const getData = () => {
        getBookById({id: props.bookId}).then(res => {
            setInformationForm(
                {
                    name: res.data.data.knowledgeBaseName,
                    detail: res.data.data.detail
                }
            )
        });

        const usersListForm = {
            knowledgeBaseId: props.bookId,
            pageSize: 1000,
            page: 1
        }
        getBookUsersList(usersListForm).then(res => {
            setMembersList(res.data.data.rows);
        })

        const noteTaskForm = {
            page: 1,
            pageSize: 1000,
            knowledgeBaseId: props.bookId
        }

        getAdminBookTaskList(noteTaskForm).then(res => {
            // const updatedTaskList = [noteTask,...res.data.data.rows]
            setNoteTask(res.data.data.rows);
            setLoading(true);
        })
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        addNoteTask(taskForm).then(res => {
            setLoadingList({
                ...loadingList,
                tasks: true
            })

            if (res.data.code == '00000') {
                const noteTaskForm = {
                    page: 1,
                    pageSize: 100,
                    knowledgeBaseId: props.bookId
                }

                getAdminBookTaskList(noteTaskForm).then(res => {
                    setNoteTask(res.data.data.rows);
                    setLoadingList({
                        ...loadingList,
                        tasks: false
                    })
                    message.success('任务创建成功！')
                })
            }
        })

        setIsModalOpen(false);
        setTaskForm({
            taskName: '',
            startTime: '',
            endTime: '',
            knowledgeBaseId: props.bookId
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setTaskForm({
            taskName: '',
            startTime: '',
            endTime: '',
            knowledgeBaseId: props.bookId
        })
    };

    const onInformationChange = (e: any) => {
        const {name, value} = e.target;
        setInformationForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

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

    const success = (content: any) => {
        messageApi.open({
            type: 'success',
            content: content,
        });
    };

    const updateBook = () => {
        updateBookApi({id: props.bookId}, informationForm).then(res => {
            if (res.data.code == '00000') {
                success('保存成功')
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        setKey(props.isCreated)
    }, [props])

    return (
        <>
            {loading ?
                <div>
                    {contextHolder}
                    {
                        key == 'information' ? (
                            <InformationCard formData={informationForm} changeEvent={onInformationChange}
                                             clickEvent={updateBook}/>
                        ) : key == 'member' ? (
                                <MemberCard uploadProps={uploadProps} loadingList={loadingList} membersList={membersList}
                                            uploadStatus={uploadStatus}/>
                            ) :
                            (
                                <TaskCard changeEvent={onTaskChange}
                                          loadingList={loadingList} noteTask={noteTask} showModal={showModal}
                                          isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}/>
                            )
                    }
                </div> : <Loading/>}
        </>
    )
}

export default function Page({params}: { params: { id: string } }) {

    const items: MenuProps['items'] = [
        {
            label: '基础信息',
            key: 'information',
            icon: <MailOutlined/>,
        },
        {
            label: '成员设置',
            key: 'member',
            icon: <TeamOutlined/>,
        },
        {
            label: '任务管理',
            key: 'task',
            icon: <AppstoreOutlined/>,
        }
    ];

    const [current, setCurrent] = useState('information');

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            <h1>知识库管理</h1>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
            <BlankLine/>
            <ContentCard isCreated={current} bookId={params.id}/>
        </>
    )
}
