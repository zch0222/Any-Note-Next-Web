'use client'

import type {MenuProps} from 'antd';
import {Menu, Row} from "antd";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import './SaveHeader.scss'

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
            <div className={'save-header-title'}>
                收藏
            </div>
            <Row justify={"start"} align={"middle"}
                 style={{borderBottom: '1px #D5D5D5 solid'}}>
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
