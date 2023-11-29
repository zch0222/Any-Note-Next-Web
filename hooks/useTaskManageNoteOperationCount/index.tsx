import useSWR from "swr";
import { getTaskManageNoteOperationCounts } from "@/app/api/note";

export default function useTaskManageNoteOperationCount(noteTaskId: number) {
    return useSWR(`/api/note/admin/noteTasks/${noteTaskId}/operationCounts`, () => getTaskManageNoteOperationCounts({
        noteTaskId: noteTaskId
    }).then(res => res.data.data))
}