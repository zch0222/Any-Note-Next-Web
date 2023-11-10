import useSWR from "swr";
import {getNoteTaskHistoryApi} from "@/app/api/note";

export function getNoteTaskHistoryData(id: string) {
    const {data, error, isLoading} = useSWR(`'/api/note/noteTasks/' + ${id} + '/history'`, () => getNoteTaskHistoryApi({id: id}))

    return {
        noteTaskHistoryData: data?.data.data,
        isNoteTaskHistoryLoading: isLoading,
        isNoteTaskHistoryError: error
    }
}
