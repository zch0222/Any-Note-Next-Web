"use client"

import type {MenuProps} from 'antd';
import {Avatar, Button, Card, Layout, Menu} from "antd";
import {InboxOutlined, LeftOutlined} from '@ant-design/icons';
import {useEffect, useState} from 'react'
import {usePathname, useRouter} from "next/navigation";
import "../../styles/globals.css"

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
    const router = useRouter();
    const pathName = usePathname();
    const [defaultActive, setDefaultActive] = useState([pathName]);
    const [selectKey, setSelectKey] = useState([pathName]);

    const items: MenuItem[] = [
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
                        <Avatar src={'/icons/icon.jpg'} size={50}/>
                    </Card>
                </div>


                <Menu onClick={onClick} defaultSelectedKeys={defaultActive} mode="inline" theme={"light"} items={items}
                      selectedKeys={selectKey} style={{border: 'none'}}/>
            </Sider>
        </>
    )
}

export default SettingsSider
