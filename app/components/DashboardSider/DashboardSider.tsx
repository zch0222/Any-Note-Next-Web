"use client"

import type {MenuProps, SelectProps} from 'antd';
import {Avatar, Button, Card, Input, Layout, Menu, Modal, Popover, Row, Select, Space} from "antd";
import {
    BellFilled,
    BookOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    InboxOutlined,
    LoginOutlined,
    SearchOutlined,
    SettingOutlined
} from '@ant-design/icons';
import {useEffect, useState} from 'react'
import './DashboardSider.scss'
import Image from "next/image";
import {usePathname, useRouter} from "next/navigation";
import {getBooks, getBookTaskList, getPersonalBooks, searchNotesApi} from "@/app/api/note";
import {ls} from "@/app/utils/storage"
import "../../styles/globals.css"
import {Book} from "@/app/config/types";

type MenuItem = Required<MenuProps>['items'][number];

const {Sider} = Layout;

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

const DashboardSider = () => {
    const router = useRouter();
    const pathName = usePathname();
    const [bookData, setBookData] = useState([]);
    const [defaultActive, setDefaultActive] = useState([pathName]);
    const [selectKey, setSelectKey] = useState([pathName]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userData, setUserData] = useState<any>()

    const items: MenuItem[] = [
        getItem('开始', '/dashboard', <ClockCircleOutlined/>),
        getItem(<div onClick={(e) => {
            const key = '/dashboard/books';
            e.stopPropagation();
            setSelectKey([key]);
            router.push(key)
        }}>知识库</div>, '', <InboxOutlined/>, bookData),
        // getItem('任务', '/dashboard/personalTask/slot', <StarOutlined/>),
        // getItem('收藏', '/dashboard/save', <StarOutlined/>),
        // getItem('看看别人', '/dashboard/explore', <PlusOutlined/>),
    ];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const onClick: MenuProps['onClick'] = (e) => {
        e.domEvent.isPropagationStopped();
        console.log(e.domEvent)
        setSelectKey([e.key]);
        router.push(e.key)
    };

    const logOut = () => {
        ls.remove('accessToken');
        router.push('/about')
    }

    const getAllBooks = async () => {
        let childBooks: any = [];
        setUserData(ls.get('userData'));
        const params = {
            page: '1',
            pageSize: '10'
        };

        try {
            const booksResponse = await getBooks(params);

            if (booksResponse.data.code === '00000') {
                const bookPromises = booksResponse.data.data.rows.map(async (item: Book) => {
                    const taskList: any = [];
                    const taskParams = {
                        knowledgeBaseId: item.id,
                        page: 1,
                        pageSize: 100
                    };

                    const bookTaskResponse = await getBookTaskList(taskParams);

                    if (bookTaskResponse.data.data.rows.length > 0 && item.permissions == '1') {
                        bookTaskResponse.data.data.rows.forEach((taskItem: any) => {
                            taskList.push(getItem(taskItem.taskName, '/dashboard/taskDetail/' + taskItem.id));
                        });

                        childBooks.push(
                            getItem(
                                <div onClick={(e) => {
                                    const key = '/dashboard/bookDetail/' + item.id;
                                    e.stopPropagation();
                                    setSelectKey([key]);
                                    router.push(key);
                                }}>
                                    {item.knowledgeBaseName}
                                </div>,
                                '/dashboard/bookDetail/' + item.id,
                                <FolderOutlined/>,
                                taskList
                            )
                        );
                    } else {
                        childBooks.push(getItem(item.knowledgeBaseName, '/dashboard/bookDetail/' + item.id,
                            <FolderOutlined/>));
                    }
                });

                const personalBooksResponse = await getPersonalBooks(params);
                const personalBookPromises = personalBooksResponse.data.data.rows.map(async (item: Book) => {
                    const taskList: any = [];
                    const taskParams = {
                        knowledgeBaseId: item.id,
                        page: 1,
                        pageSize: 100
                    };

                    const bookTaskResponse = await getBookTaskList(taskParams);

                    if (bookTaskResponse.data.data.rows.length > 0 && item.permissions == '1') {
                        bookTaskResponse.data.data.rows.forEach((taskItem: any) => {
                            taskList.push(getItem(taskItem.taskName, '/dashboard/taskDetail/' + taskItem.id));
                        });

                        childBooks.push(
                            getItem(
                                <div onClick={(e) => {
                                    const key = '/dashboard/bookDetail/' + item.id;
                                    e.stopPropagation();
                                    setSelectKey([key]);
                                    router.push(key);
                                }}>
                                    {item.knowledgeBaseName}
                                </div>,
                                '/dashboard/bookDetail/' + item.id,
                                <FolderOutlined/>,
                                taskList
                            )
                        );
                    } else {
                        childBooks.push(getItem(item.knowledgeBaseName, '/dashboard/bookDetail/' + item.id,
                            <FolderOutlined/>));
                    }
                });

                await Promise.all([...bookPromises, ...personalBookPromises]);

                setBookData(childBooks);
            }
        } catch (error) {
            // Handle errors here
        }
    }

    useEffect(() => {
        setSelectKey([pathName])
    }, [pathName])

    useEffect(() => {

    }, [bookData])

    useEffect(() => {
        getAllBooks();
    }, [])

    const content = (
        <div className={'hover'}>
            <Row>
                <Card bodyStyle={{padding: 5}}>
                    <Space>
                        <Avatar src={'/icons/icon.jpg'} size={50}/>
                        <span>{userData?.nickname}</span>
                    </Space>
                </Card>
            </Row>

            <Row>
                <Button type={"text"} onClick={() => router.push('/settings/account')}
                        icon={<SettingOutlined/>}>账户设置</Button>
            </Row>
            <Row>
                <Button type={"text"} onClick={logOut} icon={<LoginOutlined/>}>退出登录</Button>
            </Row>
        </div>
    );

    return (
        <>
            <Sider width={255} theme={"light"}
                   style={{background: 'rgba(239, 239, 239, 0.8)', padding: 15, boxSizing: "border-box"}}>
                <div className={"dashboard_sider_header"}>
                    <div className={"flex_middle"}>
                        <Image src={'/icons/LOGO.png'} alt={''} width={35} height={35}/>
                        <div style={{fontWeight: "bold", marginLeft: 10}}>学习随记</div>
                    </div>

                    <Popover content={content} placement={"bottomLeft"}>
                        <div className={"flex_middle"}>
                            <BellFilled className={"sider_header_news"} style={{color: "#01B96B"}}/>
                            <Image className={"sider_header_avatar"} src={'/icons/icon.jpg'} alt={""} width={35}
                                   height={35}/>
                        </div>
                    </Popover>
                </div>
                <div className={"dashboard_sider_search"}>
                    <Input placeholder={"搜索"} prefix={<SearchOutlined/>} onClick={showModal}></Input>
                </div>

                <Modal title="搜索" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <SearchInput placeholder={'输入搜索关键词'} style={{width: '100%'}}></SearchInput>
                </Modal>

                <Menu onClick={onClick} defaultSelectedKeys={defaultActive} mode="inline" theme={"light"} items={items}
                      selectedKeys={selectKey} style={{border: 'none'}}/>
            </Sider>
        </>
    )
}

const SearchInput: React.FC<{ placeholder: string; style: React.CSSProperties }> = (props) => {

    const [data, setData] = useState<SelectProps['options']>([]);
    const [value, setValue] = useState<string>();
    const router = useRouter();
    const handleSearch = (newValue: string) => {
        if (newValue != '') {
            searchNotes(newValue);
        }
    };

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    const handleSelect = (newValue: string) => {
        router.push('/components/MarkDownEdit/' + newValue)
    }

    const searchNotes = (value: any) => {

        const params = {
            keyword: value,
            page: 1,
            pageSize: 10
        }

        searchNotesApi(params).then(res => {
            console.log(res)
            if (res && res.data.code == '00000') {
                setData(res.data.data.rows);
            }
        })
    }

    return (
        <Select
            showSearch
            value={value}
            placeholder={props.placeholder}
            style={props.style}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            onSelect={handleSelect}
            notFoundContent={null}
            options={(data || []).map((d) => ({
                value: d.source.id,
                label:
                    <Space>
                        <div>
                            <BookOutlined style={{fontSize: 24}}/>
                        </div>
                        <div>
                            <div
                                style={{fontWeight: "bolder"}}>{d.highlight.title ?
                                <div dangerouslySetInnerHTML={{__html: d.highlight.title}}/> : d.source.title}</div>
                            <div>
                                <div dangerouslySetInnerHTML={{__html: d.highlight.content[0]}} style={{fontSize: 14}}/>
                            </div>
                            <div style={{fontSize: 14, color: "gray"}}>
                                {d.source.knowledgeBaseName}
                            </div>
                        </div>
                    </Space>,
            }))}
        >
        </Select>
    )
}

export default DashboardSider
