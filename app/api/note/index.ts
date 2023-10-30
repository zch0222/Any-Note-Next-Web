import request from "@/app/utils/request";

export function getBooks(params: any) {
    return request({
        url: '/api/note/bases/organizations',
        method: 'get',
        params: params
    })
}

export function getPersonalBooks(params: any) {
    return request({
        url: '/api/note/bases',
        method: 'get',
        params: params
    })
}

// 根据id获取知识库
export function getBookById(params: any) {
    return request({
        url: '/api/note/bases/' + params.id,
        method: 'get'
    })
}

// 创建知识库
export function addBook(data: any) {
    return request({
        url: '/api/note/bases/',
        method: 'post',
        data
    })
}

// 更新知识库
export function updateBookApi(params: any, data: any) {
    return request({
        url: '/api/note/bases/' + params.id,
        method: 'put',
        data
    })
}


// 根据id获取知识库下的笔记列表
export function getNotesById(params: any, data: any) {
    return request({
        url: '/api/note/notes/bases/' + params.id,
        method: 'post',
        data
    })
}

// 根据id获取笔记内容
export function getNoteById(params: any) {
    return request({
        url: '/api/note/notes/' + params.id,
        method: 'get'
    })
}

// 根据id修改笔记内容
export function updateNoteById(params: any, data: any) {
    return request({
        url: '/api/note/notes/' + params.id,
        method: 'patch',
        data
    })
}

// 根据id上传笔记图片
export function upLoadImageById(data: any) {
    return request({
        headers: {
            "Content-Type": 'multipart/form-data'
        },
        url: '/api/note/notes/images',
        method: 'post',
        data
    })
}

// 创建笔记
export function addNote(data: any) {
    return request({
        url: '/api/note/notes',
        method: 'post',
        data
    })
}

// 删除笔记
export function deleteNote(params: any) {
    return request({
        url: '/api/note/notes/' + params.id,
        method: 'delete'
    })
}

// 提交知识库任务
export function submitNoteTask(data: any) {
    return request({
        url: '/api/note/noteTasks/submit',
        method: 'post',
        data
    })
}

// 创建知识库任务
export function addNoteTask(data: any) {
    return request({
        url: '/api/note/admin/noteTasks',
        method: 'post',
        data
    })
}

// 创建知识库任务
export function updateNoteTaskApi(params: any, data: any) {
    return request({
        url: '/api/note/admin/noteTasks/' + params.id,
        method: 'patch',
        data
    })
}

// 获取知识库任务列表
export function getBookTaskList(params: any) {
    return request({
        url: '/api/note/noteTasks',
        method: 'get',
        params: params
    })
}

// 获取笔记提交列表
export function getSubmitTaskListApi(params: any) {
    return request({
        url: '/api/note/admin/noteTasks/submissions',
        method: 'get',
        params: params
    })
}

// 获取任务详情
export function getTaskDetailApi(params: any) {
    return request({
        url: '/api/note/admin/noteTasks/' + params.id,
        method: 'get',
    })
}

// 获取知识库用户列表
export function getBookUsersList(params: any) {
    return request({
        url: '/api/note/bases/users',
        method: 'get',
        params: params
    })
}

// 获取管理员知识库任务列表
export function getAdminBookTaskList(params: any) {
    return request({
        url: '/api/note/admin/noteTasks',
        method: 'get',
        params: params
    })
}

// 搜索api
export function searchNotesApi(params: any) {
    return request({
        url: '/api/note/notes/search',
        method: 'get',
        params: params
    })
}

