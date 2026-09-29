/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  TextArea,
  Select,
  Tag,
  Modal,
  Form,
  Popconfirm,
  Empty,
  Toast,
  Badge,
  Card,
  Typography,
  Space,
  RadioGroup,
  Radio,
  Tooltip
} from '@douyinfe/semi-ui';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconDelete,
  IconEyeOpened,
  IconFilter,
  IconArticle,
  IconClock
} from '@douyinfe/semi-icons';
import { IllustrationNoContent, IllustrationNoResult } from '@douyinfe/semi-illustrations';
import { Post, PostStatus } from '../types';
import styles from './ContentManagement.module.scss';

const { Title, Text } = Typography;

interface ContentManagementProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  selectedPostForEditing: Post | null;
  setSelectedPostForEditing: (post: Post | null) => void;
  showCreateFormOnLoad: boolean;
  onClearCreateFormTrigger: () => void;
}

export default function ContentManagement({
  posts,
  setPosts,
  selectedPostForEditing,
  setSelectedPostForEditing,
  showCreateFormOnLoad,
  onClearCreateFormTrigger
}: ContentManagementProps) {
  // Tabs and search filters
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Form states for creating/editing posts
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('技术心得');
  const [formStatus, setFormStatus] = useState<PostStatus>('已发布');
  const [formTagsString, setFormTagsString] = useState('');

  // Handle outside triggers for Editing or Creating
  useEffect(() => {
    if (selectedPostForEditing) {
      openEditForm(selectedPostForEditing);
      setSelectedPostForEditing(null);
    }
  }, [selectedPostForEditing]);

  useEffect(() => {
    if (showCreateFormOnLoad) {
      openCreateForm();
      onClearCreateFormTrigger();
    }
  }, [showCreateFormOnLoad]);

  const openCreateForm = () => {
    setFormMode('create');
    setEditId(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('技术心得');
    setFormStatus('已发布');
    setFormTagsString('');
    setIsFormOpen(true);
  };

  const openEditForm = (post: Post) => {
    setFormMode('edit');
    setEditId(post.id);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormCategory(post.category);
    setFormStatus(post.status);
    setFormTagsString(post.tags.join(', '));
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    if (formTitle.trim() === '') {
      Toast.error('请输入文章标题');
      return;
    }

    const tagsArray = formTagsString
      .split(/[,，]/)
      .map(t => t.trim())
      .filter(t => t !== '');

    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (formMode === 'create') {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: formTitle,
        status: formStatus,
        publishTime: formattedTime,
        views: formStatus === '已发布' ? 0 : null,
        category: formCategory,
        tags: tagsArray.length > 0 ? tagsArray : ['随笔'],
        content: formContent || '暂无详细内容'
      };
      setPosts([newPost, ...posts]);
      Toast.success('新博文已成功创建！');
    } else {
      setPosts(
        posts.map((post) =>
          post.id === editId
            ? {
                ...post,
                title: formTitle,
                content: formContent,
                status: formStatus,
                category: formCategory,
                tags: tagsArray,
                views: formStatus === '已发布' ? (post.views ?? 0) : null
              }
            : post
        )
      );
      Toast.success('文章已成功更新！');
    }
    setIsFormOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
    Toast.success('文章已被移除');
  };

  const uniqueCategories = Array.from(new Set(posts.map(p => p.category)));

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'published' && post.status !== '已发布') return false;
    if (activeTab === 'draft' && post.status !== '草稿') return false;
    if (activeTab === 'scheduled' && post.status !== '已排期') return false;

    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(query);
      const matchCategory = post.category.toLowerCase().includes(query);
      const matchTags = post.tags.some(tag => tag.toLowerCase().includes(query));
      const matchContent = post.content.toLowerCase().includes(query);
      return matchTitle || matchCategory || matchTags || matchContent;
    }

    return true;
  });

  const columns = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Post) => (
        <div className="space-y-1">
          <div
            className="font-medium text-[var(--semi-color-text-0)] hover:text-[var(--semi-color-primary)] cursor-pointer truncate max-w-md"
            onClick={() => openEditForm(record)}
          >
            {text}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {record.tags.map((tag, i) => (
              <Tag key={i} size="small" color="white" style={{ fontSize: 10 }}>
                #{tag}
              </Tag>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 140,
      render: (cat: string) => (
        <Tag color="cyan" size="small">
          {cat}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: PostStatus) => {
        if (status === '已发布') return <Tag color="green">已发布</Tag>;
        if (status === '草稿') return <Tag color="amber">草稿</Tag>;
        return <Tag color="blue">已排期</Tag>;
      }
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 110,
      render: (views: number | null) => (
        <span className="font-mono text-xs text-[var(--semi-color-text-1)]">
          {views !== null ? views.toLocaleString() : '—'}
        </span>
      )
    },
    {
      title: '时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 170,
      render: (time: string) => (
        <span className="text-xs text-[var(--semi-color-text-2)] font-mono">
          {time}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: Post) => (
        <Space>
          <Tooltip content="编辑文章">
            <Button
              theme="borderless"
              type="primary"
              icon={<IconEdit />}
              size="small"
              onClick={() => openEditForm(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定彻底删除此文章？"
            content="删除后无法恢复"
            onConfirm={() => handleDeletePost(record.id)}
          >
            <Tooltip content="删除文章">
              <Button
                theme="borderless"
                type="danger"
                icon={<IconDelete />}
                size="small"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            内容管理
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            撰写新博文、管理草稿与排期，统一维护所有知识沉淀。
          </Text>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconPlus />}
          onClick={openCreateForm}
        >
          新建博文
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <RadioGroup
            type="button"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <Radio value="all">
              全部文章 ({posts.length})
            </Radio>
            <Radio value="published">
              已发布 ({posts.filter(p => p.status === '已发布').length})
            </Radio>
            <Radio value="draft">
              草稿箱 ({posts.filter(p => p.status === '草稿').length})
            </Radio>
            <Radio value="scheduled">
              发布计划 ({posts.filter(p => p.status === '已排期').length})
            </Radio>
          </RadioGroup>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3">
            <Select
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val as string)}
              style={{ width: 140 }}
            >
              <Select.Option value="all">全部分类</Select.Option>
              {uniqueCategories.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>

            <Input
              prefix={<IconSearch />}
              placeholder="搜索文章标题 / 标签 / 内容..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              showClear
              style={{ width: 240 }}
            />
          </div>
        </div>
      </Card>

      {/* Posts Table */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredPosts}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          empty={
            <div className="py-12">
              <Empty
                image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
                title="未匹配到相关博文"
                description="请尝试调整筛选条件或搜索关键词"
              />
            </div>
          }
        />
      </Card>

      {/* Create / Edit Post Modal */}
      <Modal
        title={formMode === 'create' ? '撰写新博文' : '编辑文章'}
        visible={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onOk={handleFormSubmit}
        okText={formMode === 'create' ? '立即保存' : '更新文章'}
        cancelText="取消"
        width={720}
      >
        <div className="space-y-4 pt-2">
          <div>
            <Text strong>文章标题 <span className="text-red-500">*</span></Text>
            <Input
              placeholder="输入一个吸睛且准确的博文标题..."
              value={formTitle}
              onChange={(val) => setFormTitle(val)}
              style={{ marginTop: 6 }}
              size="large"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Text strong>所属分类</Text>
              <Select
                value={formCategory}
                onChange={(val) => setFormCategory(val as string)}
                style={{ width: '100%', marginTop: 6 }}
              >
                <Select.Option value="技术心得">技术心得</Select.Option>
                <Select.Option value="生活随感">生活随感</Select.Option>
                <Select.Option value="设计灵感">设计灵感</Select.Option>
                <Select.Option value="读书笔记">读书笔记</Select.Option>
                <Select.Option value="效率工具">效率工具</Select.Option>
              </Select>
            </div>

            <div>
              <Text strong>发布状态</Text>
              <Select
                value={formStatus}
                onChange={(val) => setFormStatus(val as PostStatus)}
                style={{ width: '100%', marginTop: 6 }}
              >
                <Select.Option value="已发布">公开已发布</Select.Option>
                <Select.Option value="草稿">私密草稿</Select.Option>
                <Select.Option value="已排期">计划定时发布</Select.Option>
              </Select>
            </div>
          </div>

          <div>
            <Text strong>标签 (以逗号或回车分隔)</Text>
            <Input
              placeholder="例如: React, Semi, 随笔, 架构设计"
              value={formTagsString}
              onChange={(val) => setFormTagsString(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <Text strong>文章正文 (支持 Markdown)</Text>
            <TextArea
              rows={8}
              placeholder="在此开始书写你的文章思考与沉淀..."
              value={formContent}
              onChange={(val) => setFormContent(val)}
              style={{ marginTop: 6, fontFamily: 'var(--semi-font-family)' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
