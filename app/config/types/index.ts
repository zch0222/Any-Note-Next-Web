/**
 * 笔记接口
 */
export interface Note {
    id: string;
    icon: number;
    name: string;
    time: string;
    type: string;
    from: string;
    author: string;
}

/**
 * 知识库接口
 */
export interface Book {
    id: string;
    cover: string;
    knowledgeBaseName: string;
    permissions: string;
}

/**
 * 笔记接口
 */
export interface Note {
    id: string;
    title: string;
    updateTime: string;
}

export interface ListData {
    type: any;
    avatar:any;
    title:any;
    status:any;
    description:any;
}
