"use client"

import {getBookTaskList} from "@/app/api/note";
import {useEffect, useState} from "react";
import {Card, Form, List, Tag} from "antd";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Loading from "@/app/components/Loading";

export default function Page() {

    const [bookTask, setBookTask] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getData()
    }, [])
    const getData = () => {
        const params = {
            knowledgeBaseId: 3,
            page: 1,
            pageSize: 10
        }
        getBookTaskList(params).then(res => {
            setBookTask(res.data.data.rows);
            setLoading(true);
        })
    }

    return (
        <div className={"app_container"}>
            { loading ? (
                <>
                    <div className={"title"}>全部任务</div>
                    <List
                        grid={{
                            column: 4,
                            gutter: 16,
                            xs: 1,
                            sm: 2,
                        }}
                        dataSource={bookTask}
                        renderItem={(item: any) => (
                            <List.Item>
                                <Card
                                    hoverable
                                    onClick={() => router.push('/dashboard/taskDetail/' + item.id)}
                                >
                                    <Meta title={item.taskName}
                                          description={
                                              <Form>
                                                  <FormItem label={'任务状态'}>
                                                      {/*{item.status == 0 ? (*/}
                                                      {/*    <Tag color="#87d068">进行中</Tag>) : (*/}
                                                      {/*    <Tag color="#f50">已结束</Tag>)}*/}
                                                      {new Date(item.endTime) > new Date() ? (
                                                          <Tag color="#87d068">进行中</Tag>) : (
                                                          <Tag color="#f50">已结束</Tag>)}
                                                  </FormItem>
                                                  <FormItem label={'起止时间'}>
                                                      <div>{item.startTime.substring(0, 10)} - {item.endTime.substring(0, 10)}</div>
                                                  </FormItem>
                                                  <FormItem label={'发布人'}>
                                                      <div>{item.taskCreatorNickname}</div>
                                                  </FormItem>
                                                  <FormItem label={'提交状态'}>
                                                      <div>{item.submissionStatus == 0 ? (
                                                          <Tag bordered={false} color="success">已提交</Tag>) : (
                                                          <Tag bordered={false} color="processing">未提交</Tag>)}</div>
                                                  </FormItem>
                                                  <FormItem label={'提交的笔记'}>
                                                      <div>{item.submissionStatus == 0 ? (
                                                          <Link
                                                              href={'/components/MarkDownEdit/' + item.submissionNoteId}
                                                              onClick={(e) => {
                                                                  e.stopPropagation();
                                                              }}>查看</Link>) : (
                                                          <Tag bordered={false}
                                                               color="processing">暂无笔记</Tag>)}</div>
                                                  </FormItem>
                                              </Form>}
                                    />
                                </Card>
                            </List.Item>
                        )}/>
                </>
            ) : <Loading/>}
        </div>
    )
}
