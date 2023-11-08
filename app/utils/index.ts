'use client'

import {useEffect} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

/**
 * url查询参数加密
 * @param obj
 */
export function encryptAndEncodeObject(obj:any) {
    // 将对象转换为JSON字符串
    const jsonString = JSON.stringify(obj);

    // 使用encodeURIComponent对JSON字符串进行编码
    // 返回编码后的字符串，可以用于传输
    return encodeURIComponent(jsonString);
}

/**
 * url查询参数解密
 * @param obj
 */
export function decryptAndEncodeObject(obj:any) {
    // 将对象转换为JSON字符串
    const jsonString = decodeURIComponent(obj);

    // 使用encodeURIComponent对JSON字符串进行编码
    // 返回编码后的字符串，可以用于传输
    return JSON.parse(jsonString);
}

export function NavigationEvents() {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const url = `${pathname}`
        console.log(url)
        // You can now use the current URL
        // ...
    }, [pathname, searchParams])

    return null
}


export default class DateTimeFormatter {
    static formatDate(inputTimeStr:any) {
        const inputDate = new Date(inputTimeStr);

        const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
        const day = String(inputDate.getDate()).padStart(2, '0');
        const hours = String(inputDate.getHours()).padStart(2, '0');
        const minutes = String(inputDate.getMinutes()).padStart(2, '0');

        return `${month}-${day} ${hours}:${minutes}`;
    }

    static formatDateStringToISO(originalDateString:any) {
        const originalDate = new Date(originalDateString);
        originalDate.setHours(originalDate.getHours() - 8);

        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
        const day = originalDate.getDate().toString().padStart(2, '0');
        const hours = originalDate.getHours().toString().padStart(2, '0');
        const minutes = originalDate.getMinutes().toString().padStart(2, '0');
        const seconds = originalDate.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    }
}
