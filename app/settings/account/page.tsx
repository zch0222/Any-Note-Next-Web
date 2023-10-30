"use client"

import {Button, Input, List, message, Modal, Space} from "antd";
import {CheckOutlined, CloseOutlined, EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {resetPasswordApi} from "@/app/api/auth";
import {ListData} from "@/app/config/types";
import './styles.scss'

export default function Page() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [currentType, setCurrentType] = useState(0)
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: ''
    })
    const [passwordRules, setPasswordRules] = useState({
        newPassword: {
            status: undefined,
        },
        newPasswordAgain: {
            status: undefined,
        }
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
                if (passwordForm.newPassword === passwordForm.newPasswordAgain) {
                    const data = {
                        oldPassword: passwordForm.oldPassword,
                        newPassword: passwordForm.newPassword
                    }
                    resetPasswordApi(data).then(res => {
                        if (res.data.code == '00000') {
                            setConfirmLoading(false)
                            setIsModalOpen(false);
                            messages('success', '更改成功')
                        } else {
                            setConfirmLoading(false);
                        }
                    })
                } else {
                    messages('error', '两次新密码输入不一致，请重新输入');
                    setConfirmLoading(false);
                }
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

    const handlePasswordBlur = (e: any) => {
        function isPasswordValid(password: any) {
            // 正则表达式模式，用于匹配密码
            const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\x20-\x7E]{8,15}$/;

            // 使用正则表达式测试密码
            return passwordPattern.test(password);
        }


        const {name, value} = e.target;

        console.log(value)
        console.log(isPasswordValid(value))
        switch (name) {
            case 'newPassword':
                if (isPasswordValid(value)) {
                    setPasswordRules({
                        ...passwordRules,
                        [name]: {
                            status: undefined
                        }
                    })
                } else {
                    setPasswordRules({
                        ...passwordRules,
                        [name]: {
                            status: 'error'
                        }
                    })
                }
                break;
            case 'newPasswordAgain':
                if (value == passwordForm.newPassword) {
                    setPasswordRules({
                        ...passwordRules,
                        [name]: {
                            status: undefined
                        }
                    })
                } else {
                    setPasswordRules({
                        ...passwordRules,
                        [name]: {
                            status: 'error'
                        }
                    })
                }

        }
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
                        placeholder="输入旧密码"
                        name={'oldPassword'}
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordFormChange}
                        onBlur={handlePasswordBlur}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
                    <Input.Password
                        status={passwordRules.newPassword.status}
                        placeholder="输入新密码"
                        name={'newPassword'}
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        onBlur={handlePasswordBlur}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
                    {passwordRules.newPassword.status == 'error' ?
                        <div className={'error'}>密码必须是8到15位，且包含大写字母、小写字母和数字</div> : <></>}
                    <Input.Password
                        status={passwordRules.newPasswordAgain.status}
                        placeholder="重新输入新密码"
                        name={'newPasswordAgain'}
                        value={passwordForm.newPasswordAgain}
                        onChange={handlePasswordFormChange}
                        onBlur={handlePasswordBlur}
                        iconRender={(visible) => (visible ? <EyeTwoTone/> : <EyeInvisibleOutlined/>)}/>
                    {passwordRules.newPasswordAgain.status == 'error' ?
                        <div className={'error'}>两次密码输入不一样，请重新输入</div> : <></>}
                </Space>
            </Modal>
        </div>
    )
}
