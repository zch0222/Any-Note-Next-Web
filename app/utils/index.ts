'use client'

import {useEffect} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

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


export function formatDate(inputTimeStr: any) {
    const inputDate = new Date(inputTimeStr);

    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');

    return `${month}-${day} ${hours}:${minutes}`;
}
