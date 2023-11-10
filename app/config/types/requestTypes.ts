export interface ResData<T> {
    code: string
    msg: string | null
    data: T
}

export interface PageBean<T> {
    rows: T[]
    total: number
    pages: number
    current: number
}
