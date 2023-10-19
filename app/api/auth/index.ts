import request from "@/app/utils/request";

export function logIn(data: any) {
    return request({
        url: 'api/auth/login',
        headers: {
            isToken: false
        },
        method: 'post',
        data
    })
}

export function resetPasswordApi(data: any) {
    return request({
        url: 'api/auth/resetPassword',
        method: 'post',
        data
    })
}
