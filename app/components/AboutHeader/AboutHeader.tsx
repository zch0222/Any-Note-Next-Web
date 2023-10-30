'use client'

import type {MenuProps} from 'antd';
import {Button, Menu, Row} from "antd";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";

const items: MenuProps['items'] = [
    {
        label: '首页',
        key: '/about',
    },
    {
        label: '个人使用',
        key: '/about/personal',
    },
    {
        label: '笔记模板',
        key: '/about/templates',
    },
    {
        label: '关于我们',
        key: '/about/careers',
    },
    {
        label: '帮助',
        key: '/about/help',
    },
];

const Header = () => {
    const pathName = usePathname()
    const [current, setCurrent] = useState(pathName);
    const router = useRouter()
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        router.push(e.key)
    };

    const logIn = () => {
        router.push('/login')
    }

    return (
        <>
            <Row justify={"space-around"} align={"middle"} style={{padding: 15}}>
                <div className={"flex_middle"}>
                    <Image src={'/icons/LOGO.png'} alt={''} width={35} height={35}/>
                    <div style={{fontWeight: "bold", marginLeft: 15, fontSize: 18}}>学习随记</div>
                </div>
                <Menu style={{width: 500, display: 'flex', justifyContent: 'space-around', borderBottom: 'none'}}
                      onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
                <Button type={"primary"} size={"large"} onClick={logIn}>登录/注册</Button>
            </Row>
        </>
    )
};

export default Header
