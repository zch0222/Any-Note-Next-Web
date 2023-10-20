"use client"

import type {MenuProps} from 'antd';
import {Avatar, Button, Card, Layout, Menu, Space} from "antd";
import {InboxOutlined, LeftOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react'
import {usePathname, useRouter} from "next/navigation";
import "../../styles/globals.css"
import {ls} from '@/app/utils/storage'

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

const SettingsSider = () => {
    const [userData, setUserData] = useState<any>()
    const router = useRouter();
    const pathName = usePathname();
    const [defaultActive, setDefaultActive] = useState([pathName]);
    const [selectKey, setSelectKey] = useState([pathName]);

    const items: MenuItem[] = [
        // getItem('个人信息', '/settings/profile/slot', <InboxOutlined/>),
        getItem('账户管理', '/settings/account/slot', <InboxOutlined/>),
    ];


    const onClick: MenuProps['onClick'] = (e) => {
        setSelectKey([e.key]);
        router.push(e.key)
    };

    const back = () => {
        router.back()
    }


    useEffect(() => {
        setUserData(ls.get('userData'))
        setSelectKey([pathName])
    }, [pathName])


    return (
        <>
            <Sider width={255} theme={"light"}
                   style={{background: 'rgba(239, 239, 239, 0.8)', padding: 15, boxSizing: "border-box"}}>
                <div>
                    <Button type={"text"} icon={<LeftOutlined/>} onClick={back}>
                        返回
                    </Button>

                    <Card bodyStyle={{background: 'rgba(239, 239, 239, 0.8)'}}>
                        <Space>
                            <Avatar src={'/icons/icon.jpg'} size={50}/>
                            <span>{userData?.nickname}</span>
                        </Space>
                    </Card>
                </div>


                <Menu onClick={onClick} defaultSelectedKeys={defaultActive} mode="inline" theme={"light"} items={items}
                      selectedKeys={selectKey} style={{border: 'none'}}/>
            </Sider>
        </>
    )
}

export default SettingsSider
