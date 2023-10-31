"use client"

import React from "react";
import {Card, Form, Progress, Tag} from "antd";
import Meta from "antd/es/card/Meta";
import FormItem from "antd/es/form/FormItem";
import Link from "next/link";

interface TaskItemCardProps {
    cardData: any,
    isManager?: any
}

const TaskItemCard: React.FC<TaskItemCardProps> = ({
                                               cardData,
                                               isManager = false
                                           }) => {

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
                                  <div>{cardData.startTime.substring(0, 10)} - {cardData.endTime.substring(0, 10)}</div>
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
                                              <Tag bordered={false} color="success">已提交</Tag>) : (
                                              <Tag bordered={false}
                                                   color="processing">未提交</Tag>)}</div>
                                      </FormItem>
                                      <FormItem label={'提交的笔记'}>
                                          <div>{cardData.submissionStatus == 0 ? (
                                              <Link
                                                  href={'/components/MarkDownEdit/' + cardData.submissionNoteId}
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                  }}>查看</Link>) : (
                                              <Tag bordered={false}
                                                   color="processing">暂无笔记</Tag>)}</div>
                                      </FormItem>
                                  </>)}
                          </Form>}
                />
            </Card>
        </div>
    )
}

export default TaskItemCard
