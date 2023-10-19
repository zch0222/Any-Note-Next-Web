'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

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
