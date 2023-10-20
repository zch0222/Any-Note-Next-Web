import request from "@/app/utils/request";

export function getAnnouncementsApi() {
    return request({
        url: '/api/system/announcements/latest',
        method: 'get',
    })
}

export function redAnnouncementsApi(data: any) {
    return request({
        url: '/api/system/announcements/read',
        method: 'post',
        data
    })
}
