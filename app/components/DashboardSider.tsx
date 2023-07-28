"use client"

import type {MenuProps} from 'antd';
import {Input, Layout, Menu} from "antd";
import {
    BellFilled,
    ClockCircleOutlined,
    InboxOutlined,
    PlusOutlined,
    SearchOutlined,
    StarOutlined
} from '@ant-design/icons';
import './DashboardSider.css'
import Image from "next/image";
import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";

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

const items: MenuItem[] = [
    getItem('开始', '/dashboard', <ClockCircleOutlined/>),
    getItem('知识库', '/dashboard/books', <InboxOutlined/>),
    getItem('收藏', '/dashboard/save', <StarOutlined/>),
    getItem('看看别人', '/dashboard/explore', <PlusOutlined/>),
];


const DashboardSider = () => {
    const router = useRouter()
    const pathName = usePathname()
    const [defaultActive, setDefaultActive] = useState([pathName]);
    const onClick: MenuProps['onClick'] = (e) => {
        setDefaultActive([e.key]);
        router.push(e.key)
    };

    return (
        <>
            <Sider width={255} theme={"light"}
                   style={{background: 'rgba(239, 239, 239, 0.8)', padding: 15, boxSizing: "border-box"}}>
                <div className={"dashboard_sider_header"}>
                    <div className={"flex_middle"}>
                        <Image src={'/icons/LOGO.png'} alt={''} width={35} height={35}/>
                        <div style={{fontWeight: "bold", marginLeft: 10}}>学习随记</div>
                    </div>

                    <div className={"flex_middle"}>
                        <BellFilled className={"sider_header_news"} style={{color: "#01B96B"}}/>
                        <Image className={"sider_header_avatar"} src={'/icons/icon.jpg'} alt={""} width={35}
                               height={35}/>
                    </div>
                </div>
                <div className={"dashboard_sider_search"}>
                    <Input placeholder={"搜索"} prefix={<SearchOutlined/>}></Input>
                </div>
                <Menu onClick={onClick} defaultSelectedKeys={defaultActive} mode="inline" theme={"light"} items={items}
                      style={{border: 'none'}}/>
            </Sider>
        </>
    )
}

export default DashboardSider
