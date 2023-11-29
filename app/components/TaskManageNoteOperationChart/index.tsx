'use client'
import ReactEcharts from 'echarts-for-react';
import { EChartsOption } from "echarts";
import { useRouter } from "next/navigation";

import useTaskManageNoteOperationCount from "@/hooks/useTaskManageNoteOperationCount";
import Loading from "@/app/components/Loading";

function TaskManageNoteEditChart(props: {
    noteTaskId: number
}) {

    const { noteTaskId } = props
    const { data, isLoading, error } = useTaskManageNoteOperationCount(noteTaskId)
    const router = useRouter()


    if (isLoading) {
        return <Loading/>
    }

    const option: EChartsOption = {
        title: {
            text: "笔记编辑次数"
        },
        xAxis: {
            data: data?.map(item => item.nickname)
        },
        tooltip: {  // 添加这个选项
            trigger: 'axis',

        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: "编辑次数",
            type: 'bar',
            data: data?.map(item => item.count)
        }]
    }

    const onChartClick = (params: any) => {
        if (data) {
            router.push(`/components/MarkDownEdit/${data[params.dataIndex].noteId}`)
        }

    }


    return (
        <div>
            <ReactEcharts
                onEvents={{
                    click: onChartClick
                }}
                option={option}
            />
        </div>
    )
}


export default TaskManageNoteEditChart