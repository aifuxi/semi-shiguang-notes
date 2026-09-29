/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  TextArea,
  Tag,
  Avatar,
  Card,
  Popconfirm,
  Empty,
  Toast,
  Modal,
  Space,
  RadioGroup,
  Radio,
  Typography,
  Tooltip
} from '@douyinfe/semi-ui';
import {
  IconComment,
  IconTick,
  IconClose,
  IconDelete,
  IconSearch,
  IconMail,
  IconArticle
} from '@douyinfe/semi-icons';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { Comment, CommentStatus } from '../types';
import styles from './CommentsManagement.module.scss';

const { Title, Text } = Typography;

interface CommentsManagementProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function CommentsManagement({ comments, setComments }: CommentsManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [targetComment, setTargetComment] = useState<Comment | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleApprove = (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: '已通过' as CommentStatus } : c));
    Toast.success('评论审核通过');
  };

  const handleReject = (id: string) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: '已拒绝' as CommentStatus } : c));
    Toast.warning('已标记为垃圾评论');
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
    Toast.success('评论已被彻底删除');
  };

  const openReplyModal = (comment: Comment) => {
    setTargetComment(comment);
    setReplyContent('');
    setReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (!replyContent.trim() || !targetComment) return;

    const now = new Date();
    const adminReply: Comment = {
      id: `comment-reply-${Date.now()}`,
      author: '拾光 (博主)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '刚刚',
      timestamp: now.toISOString(),
      content: `回复 @${targetComment.author} : ${replyContent}`,
      status: '已通过',
      postTitle: targetComment.postTitle,
      email: 'aifuxi.js@gmail.com'
    };

    setComments([adminReply, ...comments]);
    Toast.success('回复已成功发送');
    setReplyModalOpen(false);
  };

  const filteredComments = comments.filter((com) => {
    if (activeTab === 'pending' && com.status !== '待审核') return false;
    if (activeTab === 'approved' && com.status !== '已通过') return false;
    if (activeTab === 'rejected' && com.status !== '已拒绝') return false;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        com.author.toLowerCase().includes(query) ||
        com.content.toLowerCase().includes(query) ||
        com.postTitle.toLowerCase().includes(query) ||
        com.email.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const columns = [
    {
      title: '评论者',
      dataIndex: 'author',
      key: 'author',
      width: 200,
      render: (_: any, record: Comment) => (
        <div className="flex items-center gap-3">
          <Avatar size="small" src={record.avatar}>
            {record.author.slice(0, 1)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[var(--semi-color-text-0)] truncate">
              {record.author}
            </div>
            <div className="text-[11px] text-[var(--semi-color-text-2)] truncate font-mono">
              {record.email}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      render: (content: string, record: Comment) => (
        <div className="space-y-1 py-1">
          <p className="text-xs text-[var(--semi-color-text-1)] leading-relaxed">
            {content}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--semi-color-text-2)]">
            <IconArticle size="small" />
            <span className="truncate max-w-sm">《{record.postTitle}》</span>
            <span>•</span>
            <span>{record.time}</span>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: CommentStatus) => {
        if (status === '已通过') return <Tag color="green">已通过</Tag>;
        if (status === '待审核') return <Tag color="amber">待审核</Tag>;
        return <Tag color="red">已拒绝</Tag>;
      }
    },
    {
      title: '快捷审核与回复',
      key: 'actions',
      width: 180,
      render: (_: any, record: Comment) => (
        <Space>
          {record.status === '待审核' && (
            <Tooltip content="通过审核">
              <Button
                theme="light"
                type="primary"
                size="small"
                icon={<IconTick />}
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}

          {record.status !== '已拒绝' && (
            <Tooltip content="标记为垃圾评论">
              <Button
                theme="borderless"
                type="tertiary"
                size="small"
                icon={<IconClose />}
                onClick={() => handleReject(record.id)}
              />
            </Tooltip>
          )}

          <Tooltip content="回复评论">
            <Button
              theme="borderless"
              type="primary"
              size="small"
              icon={<IconComment />}
              onClick={() => openReplyModal(record)}
            />
          </Tooltip>

          <Popconfirm
            title="确认彻底删除此评论？"
            content="删除后无法恢复"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip content="彻底删除">
              <Button
                theme="borderless"
                type="danger"
                size="small"
                icon={<IconDelete />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className={styles.page}>
      {/* View Header */}
      <div>
        <Title heading={3} style={{ margin: 0 }}>
          评论管理
        </Title>
        <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
          审核读者留言、回复技术提问并治理社区氛围。
        </Text>
      </div>

      {/* Control Panel */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <RadioGroup
            type="button"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <Radio value="pending">
              待审核 ({comments.filter(c => c.status === '待审核').length})
            </Radio>
            <Radio value="approved">
              已发布 ({comments.filter(c => c.status === '已通过').length})
            </Radio>
            <Radio value="rejected">
              垃圾/拦截 ({comments.filter(c => c.status === '已拒绝').length})
            </Radio>
            <Radio value="all">
              全部 ({comments.length})
            </Radio>
          </RadioGroup>

          <Input
            prefix={<IconSearch />}
            placeholder="搜索评论内容、留言者或文章..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            style={{ width: 260 }}
          />
        </div>
      </Card>

      {/* Comments Table */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          empty={
            <div className="py-12">
              <Empty
                image={<IllustrationNoContent style={{ width: 140, height: 140 }} />}
                title="暂无对应状态的评论"
                description="读者留言将在此实时汇聚"
              />
            </div>
          }
        />
      </Card>

      {/* Admin Reply Modal */}
      <Modal
        title={`回复 @${targetComment?.author || ''}`}
        visible={replyModalOpen}
        onCancel={() => setReplyModalOpen(false)}
        onOk={handleSendReply}
        okText="立即发送回复"
        cancelText="取消"
        width={520}
      >
        <div className="space-y-3 pt-2">
          {targetComment && (
            <div className="p-3 rounded-lg bg-[var(--semi-color-fill-0)] border border-[var(--semi-color-border)] text-xs text-[var(--semi-color-text-2)]">
              “{targetComment.content}”
            </div>
          )}

          <TextArea
            rows={4}
            placeholder="输入你的博主回复内容..."
            value={replyContent}
            onChange={(val) => setReplyContent(val)}
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
