import useSWR from "swr";
import {
    getAdminBookTaskList,
    getBookById,
    getBooks,
    getBookTaskList, getBookUsersList,
    getNotesById,
    getPersonalBooks
} from "@/app/api/note";


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

export function getBookDataById(id: string) {
    const {data, error, isLoading, mutate} = useSWR(`/api/note/bases/${id}`, () => getBookById({id: id}))

    return {
        bookData: data?.data.data,
        isBookDataLoading: isLoading,
        isBookError: error,
        mutate
    }
}

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
