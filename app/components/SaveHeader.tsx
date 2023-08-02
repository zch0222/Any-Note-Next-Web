'use client'

import type {MenuProps} from 'antd';
import {Menu, Row} from "antd";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";

const items: MenuProps['items'] = [
    {
        label: '笔记',
        key: '/dashboard/save',
    },
    {
        label: '课程',
        key: '/dashboard/save/lesson',
    }
];

const Header = () => {
    const pathName = usePathname()
    const [current, setCurrent] = useState(pathName);
    const router = useRouter()
    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        router.push(e.key)
    };

    return (
        <>
            <div>
                收藏
            </div>
            <Row justify={"start"} align={"middle"}
                 style={{padding: '15px 15px 0 15px', borderBottom: '1px black solid'}}>
                <Menu style={{
                    width: 200,
                    display: 'flex',
                    justifyContent: 'space-around',
                    borderBottom: 'none',
                    background: '#FBFBFB'
                }}
                      onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
            </Row>
        </>
    )
};

export default Header
