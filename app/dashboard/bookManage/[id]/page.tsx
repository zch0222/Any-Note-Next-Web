"use client"
import {
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    List,
    Menu,
    MenuProps,
    message,
    Modal,
    Progress,
    Space,
    Tag,
    Tooltip,
    Upload,
    UploadProps
} from "antd";
import {useEffect, useMemo, useState} from "react";
import {AppstoreOutlined, FileOutlined, MailOutlined, TeamOutlined} from "@ant-design/icons";
import {addNoteTask, getAdminBookTaskList, getBookById, getBookUsersList, updateBookApi} from "@/app/api/note";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import {ls} from "@/app/utils/storage";
import Loading from "@/app/components/Loading";
import {useRouter} from "next/navigation";

const {TextArea} = Input;
const {RangePicker} = DatePicker;

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
            <div style={{height: 50}}></div>
            <ContentCard isCreated={current} bookId={params.id}/>
        </>
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
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [arrow, setArrow] = useState('Show');
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
    const [submitList, setSubmitList] = useState([]);

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

            if(res.data.code == '00000') {
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
                ['startTime']: timeString[0],
                ['endTime']: timeString[1]
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

    const handleTaskDetail = (id: any) => {
        router.push('/dashboard/taskDetail/' + id)
    }

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

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        setKey(props.isCreated)
    }, [props])

    return (
        <>
            {loading ? <div>
                {
                    key == 'information' ? (
                        <div style={{width: '60vw'}}>
                            {contextHolder}
                            <div>
                                名称
                            </div>
                            <TextArea name='name' placeholder={'知识库名称'} value={informationForm.name}
                                      onChange={onInformationChange} rows={3}
                                      style={{margin: '20px 0'}}></TextArea>
                            <div>
                                简介
                            </div>
                            <TextArea name='detail' placeholder={'知识库简介 (选填)'} value={informationForm.detail}
                                      onChange={onInformationChange} rows={10}
                                      style={{margin: '20px 0'}}></TextArea>

                            <Button onClick={() => updateBook()}>保存设置</Button>
                        </div>
                    ) : key == 'member' ? (
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
                        ) :
                        (
                            <div>
                                <div>
                                    <Button onClick={showModal}>
                                        创建新任务
                                    </Button>
                                    <Modal title="创建任务" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                        <Form>
                                            <FormItem name={'taskName'} label={'任务名称'}>
                                                <Input name={'taskName'} onChange={onTaskChange}/>
                                            </FormItem>

                                            <FormItem name={'startTme'} label={'起止时间'}>
                                                <RangePicker name={'startTme'} onChange={onTaskChange}/>
                                            </FormItem>
                                        </Form>
                                    </Modal>
                                </div>
                                <List
                                    loading={loadingList.tasks}
                                    pagination={{position: 'bottom', align: 'end', pageSize: 8}}
                                    grid={{
                                        column:4,
                                        gutter: 16,
                                        xs: 1,
                                        sm: 2,
                                    }}
                                    dataSource={noteTask}
                                    renderItem={(item: any) => (
                                        <List.Item onClick={() => handleTaskDetail(item.id)} style={{minWidth:200}}>
                                            <Tooltip placement={"right"} title={'查看提交详情'} arrow={mergedArrow}>
                                                <Card
                                                    hoverable
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
                                                                  <FormItem label={'总人数'}>
                                                                      <div>{item.needSubmitCount}</div>
                                                                  </FormItem>
                                                                  <FormItem label={'已提交人数'}>
                                                                      <div>{item.submittedCount}</div>
                                                                  </FormItem>
                                                                  <FormItem label={'提交进度'}>
                                                                      <div style={{width: 170}}>
                                                                          <Progress
                                                                              percent={item.submissionProgress * 100}
                                                                              size="small"/>
                                                                      </div>
                                                                  </FormItem>
                                                              </Form>}
                                                    />
                                                </Card>
                                            </Tooltip>
                                        </List.Item>
                                    )}/>
                            </div>
                        )
                }
            </div> : <Loading/>}
        </>
    )
}
