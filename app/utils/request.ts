import axios from 'axios'
import {ls} from '@/app/utils/storage'
import {logIn} from "@/app/api/auth";
import {useRouter} from "next/navigation";

let isReloginShow = false;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: 'https://api.anynote.tech/',
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

// service.interceptors.response.use(res => {
//         // 未设置状态码则默认成功状态
//         const code = res.status || 200
//         console.log(res)
//
//         if (code === 401) {
//             return res.data
//         }
//     }, error => {
//         // if (error.response.status == 401) {
//         //     const router = useRouter()
//         //     console.log(1)
//         //     const loginForm = {
//         //         username: 'adminX',
//         //         password: '123456'
//         //     }
//         //     logIn(loginForm).then(res => {
//         //         if (res.data.code == '00000') {
//         //             ls.set('accessToken', res.data.data.token.accessToken);
//         //             router.push('/dashboard');
//         //         }
//         //     }).catch(error => {
//         //         console.log(error)
//         //     })
//         // }
//     }
// )

export default service
