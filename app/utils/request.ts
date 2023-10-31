import axios from 'axios'
import {ls} from '@/app/utils/storage'
import {useRouter} from "next/navigation";
import {message, Modal} from "antd";

let isReloginShow = false;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'http://116.62.8.78:8089/',
    // 超时
    timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(config => {

    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    // 添加token
    const token = ls.get('accessToken');
    if (token && !isToken) {
        config.headers['accessToken'] = token;
    }

    if (config.method === 'post' || config.method === 'put') {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
    }

    return config
}, error => {
    console.log(error)
})

// @ts-ignore
service.interceptors.response.use(res => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || '00000'
        if (code != '00000') {
            message.error(res.data.msg)
            return res
        } else {
            return res
        }
    }, error => {
        if (error.response.status == 401) {
            Modal.error({
                title: '提示',
                content: '登录状态过期或未登录',
                okText: '重新登录',
                onOk: () => {
                    window.location.href='https://www.anynote.tech/login';
                }
            });
        } else {
            return error.response
        }
    }
)

export default service
