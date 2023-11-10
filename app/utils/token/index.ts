import {cookies} from 'next/headers'

export function getToken(): string | null | undefined {

    const cookieStore = cookies()
    if (cookieStore.get("accessToken") === undefined) {
        return null
    }
    if (undefined === cookieStore.get("accessToken")?.value) {
        return null
    } else {
        return cookieStore.get("accessToken")?.value
    }
}
