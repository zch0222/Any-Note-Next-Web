"use client"
import "vditor/dist/index.css"
import "./page.scss"
import {useEffect, useRef, useState} from "react";
import Vditor from "vditor";
import {
    deleteNote,
    getBookTaskList,
    getNoteById,
    submitNoteTask,
    updateNoteById,
    upLoadImageById
} from "@/app/api/note";
import backIcon from "../../../../public/icons/img.png"
import {Content, Header} from "antd/es/layout/layout";
import Image from "next/image";
import {Button, Card, Drawer, Layout, List, message, Modal, Popover, Row, Space, Tag} from "antd";
import {useRouter} from "next/navigation";
import {DeleteOutlined, PicLeftOutlined, SolutionOutlined} from "@ant-design/icons";
import '@/app/styles/globals.css'
import Loading from "@/app/components/Loading";
import {vditorCdn} from "@/app/config";
import DateTimeFormatter from "@/app/utils";


export default function MarkDownEdit({params}: { params: { id: string } }) {

    const router = useRouter();
    const [vd, setVd] = useState<Vditor>()
    const editor = useRef(null);


    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [noteData, setNoteData] = useState<any>('');
    const [noteContent, setNoteContent] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const getData = () => {
        getNoteById({id: params.id}).then(res => {
            if (res.data.code == '00000') {
                setNoteContent(`${res.data.data.content}`)
                setNoteData(res.data.data)
                setLoading(true);
            } else {
                error(res.data.msg);
                router.back();
            }
        })
    }

    function formatString(input: any) {
        // 使用换行符将字符串分成多行
        const lines = input.split('\n');

        // 获取第一行作为 title
        let title = lines[0].replace(/^#\s*/, '');
        if (title.length > 20) {
            title = title.substring(0, 20) + '...';
        }

        // 获取其余行作为 content
        const content = lines.slice(1).join('\n').trim();

        // 返回格式化后的结果
        return {title, content};
    }

    const blurEdit = (value?: any) => {
        const newContent = value || formatString(vd?.getValue());
        newContent.content = `# ${newContent.title}\n${newContent.content}`

        return updateNoteById({id: params.id}, newContent)
    }

    const upLoadImage = (file: any, vdt: any): any => {
        let formatData = new FormData();
        formatData.append('image', file[0]);
        formatData.append('noteId', params.id);
        upLoadImageById(formatData).then(res => {
            vdt.insertValue(res.data.data.image);
        }).catch(error => {
            return error
        })
    }

    const error = (errorContent: any) => {
        messageApi.open({
            type: 'error',
            content: errorContent,
            duration: 2.5,
        }).then(() => {
            if (errorContent != '笔记已提交，无法继续编辑!' || errorContent != '没有权限访问笔记') {
                router.back();
            }
        });
    };

    const messages = (type: any, content: any) => {
        messageApi.open({
            type: type,
            content: content,
        })
    }

    const success = (successContent: any) => {
        messageApi.open({
            type: 'success',
            content: successContent,
        })
    };

    useEffect(() => {
        console.log()
        getData();
    }, [])

    useEffect(() => {
        if (editor.current) {
            const vditor: any = new Vditor('vditor', {
                height: "95vh",
                mode: "ir", //及时渲染模式m
                blur(value: string) {
                    setSaveLoading(true)
                    blurEdit(formatString(value)).then(res => {

                        setSaveLoading(false)
                    })
                },
                input(value: string) {
                    setSaveLoading(true)
                    blurEdit(formatString(value)).then(res => {

                        setSaveLoading(false)
                    })
                },
                focus(value: string) {
                    console.log(noteData.notePermissions)
                    if (noteData.notePermissions != 6 && noteData.notePermissions != 7) {
                        error('笔记已提交，无法继续编辑!');
                    }
                },
                after() {
                    vditor.setValue(noteContent);
                    setVd(vditor)
                },
                cdn: vditorCdn,
                upload: {
                    accept: "image/*",
                    multiple: false,
                    filename(name) {
                        return name
                        //       .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
                        //     .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
                        //    .replace("/\\s/g", "");
                    },
                    handler(files) {
                        return upLoadImage(files, vditor);
                    },
                    url: 'https://api.anynote.tech/api/note/notes/images'
                },
                toolbar: ["emoji",
                    "headings",
                    "bold",
                    "italic",
                    "strike",
                    "link",
                    "|",
                    "list",
                    "ordered-list",
                    "check",
                    "outdent",
                    "indent",
                    "|",
                    "quote",
                    "line",
                    "code",
                    "inline-code",
                    "insert-before",
                    "insert-after",
                    "|",
                    "upload",
                    "table",
                    "|",
                    "undo",
                    "redo",
                    "|",
                    "fullscreen",
                    "edit-mode",
                    {
                        name: "more",
                        toolbar: [
                            "both",
                            "code-theme",
                            "content-theme",
                            "export",
                            "outline",
                        ],
                    }]
            })
        }

    }, [noteContent])

    return (
        <>
            {loading ?
                <div>
                    {contextHolder}
                    <Layout>
                        <EditHeader noteId={params.id} saveEdit={blurEdit} messages={messages} success={success}
                                    error={error}
                                    saveLoading={saveLoading} noteData={noteData}/>
                        <Content>
                            <div ref={editor} id={'vditor'}></div>
                        </Content>
                    </Layout>
                </div> : <>
                    {contextHolder}
                    <Loading/>
                </>}
        </>
    )
}

function EditHeader(props: any) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [functionPopoverOpen, setFunctionPopoverOpen] = useState(false);

    const [bookTask, setBookTask] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setFunctionPopoverOpen(false)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        deleteNoteFun()
    };

    const handleCancel = () => {
        console.log(1111)
        setIsModalOpen(false);
        console.log(isModalOpen)
    };

    const getData = () => {
        const params = {
            knowledgeBaseId: props.noteData.knowledgeBaseId,
            page: 1,
            pageSize: 10
        }
        getBookTaskList(params).then(res => {
            setBookTask(res.data.data.rows);
        })
    }

    const back = (notePermission: any) => {
        if (parseInt(notePermission) > 4) {
            props.saveEdit().then(() => {
                router.back();
            })
        } else {
            router.back();
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        setFunctionPopoverOpen(newOpen);
    };

    const showDrawer = () => {
        setOpen(true);
        setFunctionPopoverOpen(false);
    };

    const onClose = () => {
        setOpen(false);
    };

    const submit = (taskId: any) => {

        const subForm = {
            noteTaskId: taskId,
            noteId: props.noteId
        }

        submitNoteTask(subForm).then(res => {
            if (res.data.code == '00000') {
                const updatedBookTask: any = bookTask.map((item: any) => {
                    if (item.id == taskId) {
                        // 如果 id 为 2，则将 sub 设置为 1
                        return {...item, submissionStatus: 1};
                    }
                    // 否则保持不变
                    return item;
                });
                setBookTask(updatedBookTask);
            } else {
                props.messages('warning', res.data.msg);
            }
        })
    }

    const deleteNoteFun = () => {
        const params = {
            id: props.noteData.id
        }

        deleteNote(params).then(res => {
            setIsModalOpen(false);
            router.push('/dashboard/bookDetail/' + props.noteData.knowledgeBaseId)
        })
    }

    useEffect(() => {
        if (props.noteData.knowledgeBaseId != undefined)
            getData()
    }, [props.noteData.knowledgeBaseId])

    const functionContent = (
        <div style={{width: 250}}>
            <Card bodyStyle={{padding: 10}}>
                <Row>
                    <Button style={{width: '100%', textAlign: "start"}} type={"text"} onClick={showDrawer}
                            icon={<SolutionOutlined/>}>提交</Button>
                </Row>
                <Row>
                    <Button style={{width: '100%', textAlign: "start"}} type={"text"} onClick={showModal} danger
                            icon={<DeleteOutlined color={'red'}/>}>删除</Button>
                </Row>
            </Card>
        </div>
    );

    return (
        <Header style={{background: 'white'}} className={'markdown-note-header'}>
            <Drawer title="提交任务" placement="right" onClose={onClose} open={open}>
                <p>选择要提交的任务</p>
                <List
                    pagination={{position: 'bottom', align: 'center'}}
                    dataSource={bookTask}
                    renderItem={(item: any) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.taskName}
                                description={<div>发布人：{item.taskCreatorNickname}</div>}
                            />

                            <div>{item.submissionStatus == 1 ?
                                <Tag bordered={false}
                                     color="success">已提交</Tag> : new Date(item.endTime) > new Date() ?
                                    <Button onClick={() => submit(item.id)}>提交</Button> :
                                    <Tag color={"default"}>已截止</Tag>}
                            </div>
                        </List.Item>
                    )}
                />
            </Drawer>

            <div className={'leftItem hover'} onClick={() => back(props.noteData.notePermissions)}>
                {/*<Image src={backIcon} alt={''} width={30} height={30}/>*/}
                <div>
                    <div style={{lineHeight: 'normal'}}>
                        {props.saveLoading ? <>自动保存中...</> : '已是最新版本'}
                    </div>
                    <div style={{lineHeight: 'normal', fontSize: '10px'}}>
                        最近更新时间: {DateTimeFormatter.formatDate(props.noteData.updateTime)}
                    </div>
                </div>
            </div>


            <Space className={'leftItem'}>
                <div> 当前权限: {props.noteData.notePermissions == 7 ?
                    <Tag color="success">管理</Tag> : props.noteData.notePermissions == 6 ?
                        <Tag color="processing">读取编辑</Tag> : props.noteData.notePermissions == 4 ?
                            <Tag color="warning">读取</Tag> : <Tag color={"default"}>无权限</Tag>}
                </div>
                <Button type={"primary"} onClick={() => props.saveEdit().then((res: any) => {
                    if (res.data.code == '00000') {
                        props.success('保存成功！')
                    } else {
                        props.error('笔记已提交，无法继续编辑!')
                    }
                })}>保存</Button>
                <Popover placement="bottomRight" content={functionContent} trigger={'click'} open={functionPopoverOpen}
                         onOpenChange={handleOpenChange}>
                    <Button>
                        <PicLeftOutlined className={'hover'} style={{fontSize: 16}}/>
                    </Button>
                </Popover>

                <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>确认删除吗？</p>
                </Modal>
            </Space>
        </Header>
    )
}
