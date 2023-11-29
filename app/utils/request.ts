import axios from 'axios'
import {ls} from '@/app/utils/storage'
import {message, Modal} from "antd";

let isReloginShow = false;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'http://localhost:8089/',
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
    console.log('请求', error.message)

    if (error.response.status == 404) {
        Modal.error({
            title: '提示',
            content: '请求出错',
            okText: '重新登录',
            onOk: () => {
                window.location.href = 'https://www.anynote.tech/login';
            }
        });
    } else {
        return error.response
    }

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
        console.log('响应', error.message)

        if(error.code == 'ECONNABORTED') {
            message.error("请求超时，请刷新页面或检查网络！")
        }

        if (error.code == 'ERR_NETWORK') {
            message.error("网络错误，请检查网络！")
        }

        if (error.response.status == 401) {
            Modal.error({
                title: '提示',
                content: '登录状态过期或未登录',
                okText: '重新登录',
                onOk: () => {
                    window.location.href = 'https://www.anynote.tech/login';
                }
            });
        } else {
            message.error(error.response.status);
        }
    }
)

export default service
