"use client"

import {Content, Header} from "antd/es/layout/layout";
import backIcon from "@/public/icons/img.png";
import Image from "next/image";
import {Anchor, Card, Layout, List, MenuProps} from "antd";
import React, {useEffect, useState} from "react";
import {InboxOutlined} from "@ant-design/icons";
// @ts-ignore
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {getNoteHistoryData, getNoteHistoryListData} from "@/hooks/note";
import {useParams, useRouter} from "next/navigation";
import Loading from "@/app/components/Loading";
import DateTimeFormatter from "@/app/utils";
import ReactMarkdown from 'react-markdown'
// @ts-ignore
import MarkNav from 'markdown-navbar';
import 'markdown-navbar/dist/navbar.css';

const {Sider} = Layout;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}


const HistoryHeader = () => {

    const router = useRouter();

    return (
        <Header style={{
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba( 31,35,41 ,0.15)",
            height: "56px"
        }}>
            <Image src={backIcon} alt={''} width={30} height={30} onClick={() => router.back()} style={{cursor:"pointer"}}/>
            {/*<Button type={"primary"}>恢复此记录</Button>*/}
        </Header>
    )
}

const HistoryMenu = ({operationId, setOperationId}: { operationId: string, setOperationId: any }) => {
    const params: any = useParams()
    const {
        noteHistoryListData,
        isNoteHistoryListDataLoading,
        isNoteHistoryListDataError
    } = getNoteHistoryListData(params.id)

    const [items, setItems] = useState<MenuItem[]>([getItem('账户管理', '/settings/account', <InboxOutlined/>)])

    const handleHistoryDetail = (id: string) => {
        setOperationId(id)
    }

    useEffect(() => {
        if (noteHistoryListData) {
            setItems(noteHistoryListData)
        }
    }, [noteHistoryListData])

    if (isNoteHistoryListDataLoading) return <Loading/>

    return (
        <Sider width={300} theme={"light"}
               style={{
                   borderRight: '1px solid rgba( 31,35,41 ,0.15)',
                   height: "calc(100vh - 56px)",
               }}>
            <Card bodyStyle={{padding: 20}} bordered={false}>历史记录</Card>
            <List
                style={{
                    height: "calc(100% - 63px)",
                    overflowY: "auto"
                }}
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item: any, index) => (
                    <List.Item style={{
                        padding: 12,
                        cursor: "pointer",
                        background: item.operationLogId == operationId ? '#f4f5f5' : "none"
                    }} onClick={() => {
                        handleHistoryDetail(item.operationLogId)
                    }}>
                        <List.Item.Meta
                            title={<div>{item.updaterNickname}</div>}
                        />
                        <div>{DateTimeFormatter.formatDate(item.operationTime)}</div>
                    </List.Item>
                )}
            />
        </Sider>
    )
}

const HistoryContent = ({operationId}: { operationId: string }) => {

    const {noteHistoryData, isNoteHistoryDataLoading, isNoteHistoryDataError} = getNoteHistoryData(operationId)

    const [content, setContent] = useState<any>()

    const [titles, setTitles] = useState([])

    const addAnchor = () => {
        const ele = document.getElementsByClassName('markdown-body')[0];
        if (ele) {
            let titles: any = [];
            ele.childNodes.forEach((e: any, index) => {
                if (e.nodeName === 'H1' || e.nodeName === 'H2' || e.nodeName === 'H3' || e.nodeName === 'H4' || e.nodeName === 'H5' || e.nodeName === 'H6') {
                    let a = document.createElement('a');
                    a.setAttribute('id', '#' + index);
                    a.setAttribute('class', 'anchor-title');
                    a.setAttribute('href', '#' + index);
                    a.innerText = ' '
                    let title = {
                        title: e.innerText,
                        key: index,
                        href: '#' + index
                    };
                    titles.push(title);
                    e.appendChild(a);
                }
            })
            return titles;
        }
    }

    const handleClickFun = (e: any, link: any) => {
        e.preventDefault();
        if (link.href) {
            // 找到锚点对应得的节点
            let element = document.getElementById(link.href);
            // 如果对应id的锚点存在，就跳滚动到锚点顶部
            element && element.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
    }

    useEffect(() => {
        if (noteHistoryData) {
            setContent(noteHistoryData)
        }
    }, [noteHistoryData])

    useEffect(() => {
        if (document.getElementsByClassName('markdown-body')[0] && document.getElementsByClassName('ant-anchor')[0].childNodes.length < 2) {
            setTitles(addAnchor)
        }
    }, [content])

    if (isNoteHistoryDataLoading) return <Loading/>

    return (
        <Content style={{background: "rgb(250,250,250)", padding: "20px 20px 0 20px", height: "calc(100vh - 56px)"}}>
            <div style={{display: "flex", justifyContent: "flex-start", padding: "10px"}}>
                <div>历史时间： {DateTimeFormatter.formatDate(content?.historyTime)}</div>
            </div>

            <div className={'content-box'} style={{
                height: "calc(100% - 50px)",
                overflowY: "auto",
                display: "flex",
                justifyContent: "space-around"
            }}>
                <Card style={{margin: '10px auto 0', width: 800}}>
                    <ReactMarkdown
                        className={'markdown-body'}
                        children={content?.content}
                        components={{
                            code(props) {
                                const {children, className, node, ...rest} = props
                                const match = /language-(\w+)/.exec(className || '')
                                return match ? (
                                    <SyntaxHighlighter
                                        {...rest}
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                    />
                                ) : (
                                    <code {...rest} className={className}>
                                        {children}
                                    </code>
                                )
                            }
                        }}/>
                </Card>
                <div style={{width: 400}}></div>
                <div style={{width: 400, position: 'fixed', right: 0}}>
                    <Anchor
                        className='markdown-nav'
                        affix={false}
                        onClick={handleClickFun}
                        items={titles}
                    >
                    </Anchor>
                </div>
            </div>
        </Content>
    )
}

export default function Page() {
    const params: any = useParams()
    const {
        noteHistoryListData,
        isNoteHistoryListDataLoading,
        isNoteHistoryListDataError
    } = getNoteHistoryListData(params.id)

    const [operationId, setOperationId] = useState('')

    useEffect(() => {
        if (noteHistoryListData) {
            setOperationId(noteHistoryListData[0].operationLogId)
        }
    }, [noteHistoryListData])

    if (isNoteHistoryListDataLoading || operationId == '') return <Loading/>

    return (
        <div style={{height: "100%"}}>
            <HistoryHeader/>

            <Layout>
                <HistoryMenu operationId={operationId} setOperationId={setOperationId}/>
                <HistoryContent operationId={operationId}/>
            </Layout>
        </div>
    )
}
