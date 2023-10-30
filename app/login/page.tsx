'use client'

import {Button, Card, Form, Input, message} from 'antd';
import {useState} from "react";
import {logIn} from "@/app/api/auth";
import {useRouter} from "next/navigation";
import {ls} from "@/app/utils/storage";


type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

export default function Page() {
    const router = useRouter();
    const [loginLoading, setLoginLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: ''
    })

    const handleLoginInputChange = (e: any) => {
        const {name, value} = e.target;
        setLoginForm({
            ...loginForm,
            [name]: value,
        });
    }

    const login = () => {
        setLoginLoading(true)
        logIn(loginForm).then(res => {
            if (res.data.code == '00000') {
                ls.set('userData', {
                    avatar: res.data.data.avatar,
                    nickname: res.data.data.nickname,
                    role: res.data.data.role,
                    username: res.data.data.username
                })
                ls.set('accessToken', res.data.data.token.accessToken);
                router.push('/dashboard');
            } else {
                setLoginLoading(false)
            }
        }).catch(error => {
            setLoginLoading(false)
        })
    }

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const warning = (content: any) => {
        messageApi.open({
            type: 'warning',
            content: content,
        });
    };

    return (
        <>
            <div style={{
                width: '100%',
                height: '90vh',
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                {contextHolder}
                <Card bordered={true} title={'登录'}>
                    <Form
                        name="basic"
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="账号"
                            name="username"
                            rules={[{required: true, message: '请输入用户名！'}]}
                        >
                            <Input name='username' value={loginForm.username} onChange={handleLoginInputChange}/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码'}]}
                        >
                            <Input.Password name='password' value={loginForm.password}
                                            onChange={handleLoginInputChange}/>
                        </Form.Item>

                        {/*<Form.Item<FieldType>*/}
                        {/*    name="remember"*/}
                        {/*    valuePropName="checked"*/}
                        {/*    wrapperCol={{offset: 8, span: 16}}*/}
                        {/*>*/}
                        {/*    <Checkbox>记住密码</Checkbox>*/}
                        {/*</Form.Item>*/}

                        <Form.Item wrapperCol={{offset: 8, span: 16}}>
                            <Button type="primary" htmlType="submit" onClick={login} loading={loginLoading}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    )
}
