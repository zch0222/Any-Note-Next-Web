import useSWR from "swr";
import {
    getAdminBookTaskList,
    getBookById,
    getBooks,
    getBookTaskList,
    getBookUsersList,
    getNoteHistoryApi,
    getNoteHistoryListApi,
    getNotesById,
    getPersonalBooks
} from "@/app/api/note";

// 获取组织知识库
export function getBooksData() {
    const params = {
        page: '1',
        pageSize: '100'
    };

    const {data, error, isLoading} = useSWR(`/api/note/bases/organizations`, () => getBooks(params))

    return {
        booksData: data?.data.data.rows,
        isBooksDataLoading: isLoading,
        isBooksError: error,
    }
}

// 获取非组织知识库
export function getPersonalBooksData() {
    const params = {
        page: '1',
        pageSize: '100'
    };

    const {data, error, isLoading} = useSWR(`/api/note/bases`, () => getPersonalBooks(params))

    return {
        personalBooksData: data?.data.data.rows,
        isPersonalBooksDataLoading: isLoading,
        isPersonalBooksError: error,
    }
}

// 根据id获取知识库信息
export function getBookDataById(id: string) {
    const {data, error, isLoading, mutate} = useSWR(`/api/note/bases/${id}`, () => getBookById({id: id}))

    return {
        bookData: data?.data.data,
        isBookDataLoading: isLoading,
        isBookError: error,
        mutate
    }
}

// 根据id获取笔记内容
export function getNotesData(id: string) {
    const {data, error, isLoading} = useSWR(`/api/note/notes/bases/${id}`, () => getNotesById({id: id},
        {
            page: '1',
            pageSize: '1000'
        }))

    return {
        noteData: data?.data.data.rows,
        isNoteDataLoading: isLoading,
        isNoteError: error
    }
}

// 获取知识库任务列表
export function getBookTaskData(id: string) {
    const listParams = {
        knowledgeBaseId: id,
        page: 1,
        pageSize: 1000
    }

    const {data, error, isLoading} = useSWR(`/api/note/noteTasks/${id}`, () => getBookTaskList(listParams))

    return {
        taskData: data?.data.data.rows,
        isTaskDataLoading: isLoading,
        isTaskError: error
    }
}

// 获取管理员知识库任务列表
export function getAdminBookTaskData(id: string) {
    const noteTaskForm = {
        page: 1,
        pageSize: 1000,
        knowledgeBaseId: id
    }

    const {data, error, isLoading} = useSWR(`/api/note/admin/noteTasks/${id}`, () => getAdminBookTaskList(noteTaskForm))

    return {
        adminTaskData: data?.data.data.rows,
        isAdminTaskDataLoading: isLoading,
        isAdminTaskError: error
    }
}

// 获取知识库用户列表
export function getBookUsersData(id: string) {
    const params = {
        page: 1,
        pageSize: 1000,
        knowledgeBaseId: id
    }

    const {data, error, isLoading} = useSWR(`/api/note/bases/users/${id}`, () => getBookUsersList(params))

    return {
        bookUsersData: data?.data.data.rows,
        isBookUsersDataLoading: isLoading,
        isBookUsersError: error
    }
}

// 根据id获取笔记历史记录列表
export function getNoteHistoryListData(id: string) {
    const params = {
        noteId: id,
        page: 1,
        pageSize: 1000
    }

    const {data, error, isLoading} = useSWR(`/api/note/notes/historyList/${id}`, () => getNoteHistoryListApi(params))

    return {
        noteHistoryListData: data?.data.data.rows,
        isNoteHistoryListDataLoading: isLoading,
        isNoteHistoryListDataError: error
    }
}

// 根据operationId获取笔记历史记录
export function getNoteHistoryData(id: string) {
    const params = {
        operationId: id
    }

    const {data, error, isLoading} = useSWR(`/api/note/notes/history/${id}`, () => getNoteHistoryApi(params))

    return {
        noteHistoryData: data?.data.data,
        isNoteHistoryDataLoading: isLoading,
        isNoteHistoryDataError: error
    }
}

