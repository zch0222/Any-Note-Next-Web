"use client"

import React from "react";
import {Card, Form, Progress, Tag} from "antd";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import DateTimeFormatter from "@/app/utils";
import {useRouter} from "next/navigation";

interface TaskItemCardProps {
    cardData: any,
    isManager?: any
}

const TaskItemCard: React.FC<TaskItemCardProps> = ({
                                                       cardData,
                                                       isManager = false
                                                   }) => {

    const router = useRouter();

    return (
        <div>
            <Card
                hoverable
            >
                <Meta title={cardData.taskName}
                      description={
                          <Form>
                              <FormItem label={'任务状态'}>
                                  {/*{item.status == 0 ? (*/}
                                  {/*    <Tag color="#87d068">进行中</Tag>) : (*/}
                                  {/*    <Tag color="#f50">已结束</Tag>)}*/}
                                  {new Date(cardData.endTime) > new Date() ? (
                                      <Tag color="#87d068">进行中</Tag>) : (
                                      <Tag color="#f50">已结束</Tag>)}
                              </FormItem>
                              <FormItem label={'起止时间'}>
                                  <div>{DateTimeFormatter.formatDate(cardData.startTime)} 至 {DateTimeFormatter.formatDate(cardData.endTime)}</div>
                              </FormItem>

                              {isManager ? (
                                  <>
                                      <FormItem label={'总人数'}>
                                          <div>{cardData.needSubmitCount}</div>
                                      </FormItem>
                                      <FormItem label={'已提交人数'}>
                                          <div>{cardData.submittedCount}</div>
                                      </FormItem>
                                      <FormItem label={'提交进度'}>
                                          <div style={{width: 170}}>
                                              <Progress
                                                  percent={cardData.submissionProgress * 100}
                                                  size="small"/>
                                          </div>
                                      </FormItem>
                                  </>) : (
                                  <>
                                      <FormItem label={'发布人'}>
                                          <div>{cardData.taskCreatorNickname}</div>
                                      </FormItem>
                                      <FormItem label={'提交状态'}>
                                          <div>{cardData.submissionStatus == 0 ? (
                                              <Tag bordered={false}
                                                   color="processing">未提交</Tag>) : cardData.submissionStatus == 1 ? (
                                              <Tag bordered={false}
                                                   color="success">已提交</Tag>) : cardData.submissionStatus == 2 ?
                                              <Tag bordered={false} color="success">无需提交</Tag> :
                                              <Tag bordered={false}
                                                   color="error">被退回</Tag>}</div>
                                      </FormItem>
                                      {/*<FormItem label={'提交的笔记'}>*/}
                                      {/*    <div>{cardData.submissionStatus == 1 ? (*/}
                                      {/*        // <Link*/}
                                      {/*        //     href={'/components/MarkDownEdit/' + cardData.submissionNoteId}*/}
                                      {/*        <Tag*/}
                                      {/*            onClick={(e) => {*/}
                                      {/*                e.stopPropagation();*/}
                                      {/*                router.push('/components/MarkDownEdit/' + cardData.submissionNoteId)*/}
                                      {/*            }}>查看</Tag>) : (*/}
                                      {/*        <Tag bordered={false}*/}
                                      {/*             color="processing">暂无笔记</Tag>)}</div>*/}
                                      {/*</FormItem>*/}
                                  </>)}
                          </Form>}
                />
            </Card>
        </div>
    )
}

export default TaskItemCard
