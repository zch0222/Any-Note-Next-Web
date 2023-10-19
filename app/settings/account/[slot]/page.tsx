"use client"

import {Button, Input, List, message, Modal, Space} from "antd";
import {CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {resetPasswordApi} from "@/app/api/auth";
import {ListData} from "@/app/config/types";

export default function Page() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentType, setCurrentType] = useState(0)
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: ''
    })

    const [listData, setListData] = useState<ListData[]>([
        {
            type: 0,
            avatar: [<CloseOutlined/>, <CheckOutlined/>],
            title: '账户密码',
            status: 1,
            description: ['未设置', '已设置，可通过账户密码登录']
        }
    ])

    const showModal = (type: any) => {
        setCurrentType(type)
        setIsModalOpen(true);
    };

    const messages = (type: any, content: any) => {
        messageApi.open({
            type: type,
            content: content,
        });
    };

    const handleOk = () => {
        setConfirmLoading(true)

        switch (currentType) {
            case 0:
                resetPasswordApi(passwordForm).then(res => {
                    if (res.data.code == '00000') {
                        setConfirmLoading(false)
                        setIsModalOpen(false);
                        messages('success', '更改成功')
                    } else {
                        setConfirmLoading(false);
                        messages('warning', res.data.msg)
                    }
                })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handlePasswordFormChange = (e: any) => {
        const {name, value} = e.target;
        setPasswordForm({
            ...passwordForm,
            [name]: value,
        });
    }

    useEffect(() => {
    }, [])

    return (
        <div className={"app_container"}>
            <div className={"title"}>账户管理</div>
            {contextHolder}
            <List bordered
                  split
                  dataSource={listData}
                  style={{width: 500}}
                  rowKey={listData => listData.type}
                  renderItem={(item: any, index) => (
                      <List.Item>
                          <List.Item.Meta
                              avatar={
                                  item.avatar[item.status]
                              }
                              title={item.title}
                              description={item.description[item.status]}
                          />
                          <Button onClick={() => showModal(item.type)}>更改</Button>
                      </List.Item>
                  )}>
            </List>

            <Modal
                confirmLoading={confirmLoading}
                title={listData[currentType]?.title} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Input.Password
                        placeholder="input password"
                        name={'oldPassword'}
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordFormChange}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
                    <Input.Password
                        placeholder="input password"
                        name={'newPassword'}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
                </Space>
            </Modal>
        </div>
    )
}
