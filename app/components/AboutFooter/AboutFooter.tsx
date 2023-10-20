'use client'

import {Row} from "antd";
import './fotter.scss'

const Footer = () => {

    return (
        <>
            <div className={'footer'}>
                <span className={'span-copy'}>&copy; 学习随记 &nbsp;&nbsp;</span>
                <span className={'span-copy'}>ICP备案号：</span>
                <span className={'span-no'}>浙ICP备2023028046号-1</span>
            </div>
        </>
    )
};

export default Footer
