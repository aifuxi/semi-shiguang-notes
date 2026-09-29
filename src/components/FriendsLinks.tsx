/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Avatar,
  Modal,
  Popconfirm,
  Toast,
  Typography,
  Space,
  Empty,
  Tooltip
} from '@douyinfe/semi-ui';
import {
  IconLink,
  IconPlus,
  IconSearch,
  IconEdit,
  IconDelete,
  IconTick,
  IconRefresh
} from '@douyinfe/semi-icons';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { FriendLink } from '../types';

const { Title, Text } = Typography;

export const initialLinks: FriendLink[] = [
  {
    id: '1',
    name: '拾光漫步',
    url: 'https://shiguang.example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    description: '记录生活中的小确幸，留存每一抹温柔。',
    category: '生活感悟',
    status: '正常',
    sortOrder: 1,
  },
  {
    id: '2',
    name: '代码与诗',
    url: 'https://codepoetry.example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    description: '用逻辑构建世界，用诗意点缀灵魂。',
    category: '技术博客',
    status: '正常',
    sortOrder: 2,
  },
  {
    id: '3',
    name: '数字极简主义',
    url: 'https://minimalist.example.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    description: '专注极简生活，摆脱数字噪音，回归纯真。',
    category: '创意设计',
    status: '正常',
    sortOrder: 3,
  },
  {
    id: '4',
    name: '极客风暴',
    url: 'https://geekstorm.example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    description: '探索前沿科技，分享极客折腾日记。',
    category: '技术博客',
    status: '异常',
    sortOrder: 4,
  },
  {
    id: '5',
    name: '云端彼岸',
    url: 'https://cloudside.example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
    description: '渴望交换友链，期待与有温度的你相遇。',
    category: '生活感悟',
    status: '待审核',
    sortOrder: 5,
  }
];

interface FriendsLinksProps {
  links?: FriendLink[];
  setLinks?: React.Dispatch<React.SetStateAction<FriendLink[]>>;
}

export default function FriendsLinks({ links: propLinks, setLinks: propSetLinks }: FriendsLinksProps) {
  const [localLinks, setLocalLinks] = useState<FriendLink[]>(initialLinks);
  const links = propLinks !== undefined ? propLinks : localLinks;
  const setLinks = propSetLinks !== undefined ? propSetLinks : setLocalLinks;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [currentLinkId, setCurrentLinkId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('技术博客');
  const [formStatus, setFormStatus] = useState<'正常' | '异常' | '待审核'>('正常');

  const openCreateModal = () => {
    setFormMode('create');
    setCurrentLinkId(null);
    setFormName('');
    setFormUrl('');
    setFormAvatar('');
    setFormDesc('');
    setFormCategory('技术博客');
    setFormStatus('正常');
    setIsFormOpen(true);
  };

  const openEditModal = (link: FriendLink) => {
    setFormMode('edit');
    setCurrentLinkId(link.id);
    setFormName(link.name);
    setFormUrl(link.url);
    setFormAvatar(link.avatar);
    setFormDesc(link.description);
    setFormCategory(link.category);
    setFormStatus(link.status);
    setIsFormOpen(true);
  };

  const handleFormSubmit = () => {
    if (!formName.trim() || !formUrl.trim()) {
      Toast.warning('请填写网站名称和链接地址');
      return;
    }

    if (formMode === 'create') {
      const newLink: FriendLink = {
        id: `link-${Date.now()}`,
        name: formName.trim(),
        url: formUrl.trim(),
        avatar: formAvatar.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        description: formDesc.trim() || '暂无站点简介',
        category: formCategory,
        status: formStatus,
        sortOrder: links.length + 1
      };
      setLinks([newLink, ...links]);
      Toast.success('友链已成功添加');
    } else {
      setLinks(
        links.map(l =>
          l.id === currentLinkId
            ? {
                ...l,
                name: formName.trim(),
                url: formUrl.trim(),
                avatar: formAvatar.trim() || l.avatar,
                description: formDesc.trim(),
                category: formCategory,
                status: formStatus
              }
            : l
        )
      );
      Toast.success('友链已成功更新');
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    Toast.success('友链已移除');
  };

  const handleApprove = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, status: '正常' } : l));
    Toast.success('已审核通过该友情链接');
  };

  const filteredLinks = links.filter((link) => {
    if (categoryFilter !== '全部' && link.category !== categoryFilter) return false;
    if (statusFilter !== '全部' && link.status !== statusFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        link.name.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q) ||
        link.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      title: '博客名称 / 地址',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: FriendLink) => (
        <div className="flex items-center gap-3">
          <Avatar size="small" src={record.avatar}>
            {record.name.slice(0, 1)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold text-xs text-[var(--semi-color-text-0)] truncate">
              {record.name}
            </div>
            <a
              href={record.url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-[var(--semi-color-primary)] hover:underline truncate block"
            >
              {record.url}
            </a>
          </div>
        </div>
      )
    },
    {
      title: '站点描述',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <span className="text-xs text-[var(--semi-color-text-1)] line-clamp-1">{desc}</span>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => <Tag color="cyan">{cat}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        if (status === '正常') return <Tag color="green">正常</Tag>;
        if (status === '待审核') return <Tag color="amber">待审核</Tag>;
        return <Tag color="red">异常</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      render: (_: any, record: FriendLink) => (
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
          <Tooltip content="编辑友链">
            <Button
              theme="borderless"
              type="primary"
              size="small"
              icon={<IconEdit />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认彻底删除此友情链接？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip content="删除">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            友情链接管理
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            与优质博客建立网状互联，拓展内容传播圈层。
          </Text>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconPlus />}
          onClick={openCreateModal}
        >
          新增友链
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val as string)}
              style={{ width: 130 }}
            >
              <Select.Option value="全部">全部分类</Select.Option>
              <Select.Option value="技术博客">技术博客</Select.Option>
              <Select.Option value="生活感悟">生活感悟</Select.Option>
              <Select.Option value="创意设计">创意设计</Select.Option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as string)}
              style={{ width: 120 }}
            >
              <Select.Option value="全部">全部状态</Select.Option>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="待审核">待审核</Select.Option>
              <Select.Option value="异常">异常</Select.Option>
            </Select>
          </div>

          <Input
            prefix={<IconSearch />}
            placeholder="搜索友链名称、地址或描述..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            style={{ width: 260 }}
          />
        </div>
      </Card>

      {/* Table */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredLinks}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          empty={
            <div className="py-12">
              <Empty
                image={<IllustrationNoContent style={{ width: 140, height: 140 }} />}
                title="暂无对应友链数据"
                description="点击上方按钮添加第一条友情链接"
              />
            </div>
          }
        />
      </Card>

      {/* Modal Form */}
      <Modal
        title={formMode === 'create' ? '添加友情链接' : '编辑友情链接'}
        visible={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onOk={handleFormSubmit}
        okText="保存"
        cancelText="取消"
        width={520}
      >
        <div className="space-y-4 pt-2">
          <div>
            <Text strong>网站名称 <span className="text-red-500">*</span></Text>
            <Input
              placeholder="例如: 拾光漫步"
              value={formName}
              onChange={(val) => setFormName(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <Text strong>网站链接 (URL) <span className="text-red-500">*</span></Text>
            <Input
              placeholder="https://example.com"
              value={formUrl}
              onChange={(val) => setFormUrl(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <Text strong>站点图标 (Avatar URL)</Text>
            <Input
              placeholder="https://.../avatar.png"
              value={formAvatar}
              onChange={(val) => setFormAvatar(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <Text strong>站点简介</Text>
            <Input
              placeholder="用一句话描述该站点的调性与核心关注..."
              value={formDesc}
              onChange={(val) => setFormDesc(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text strong>所属分类</Text>
              <Select
                value={formCategory}
                onChange={(val) => setFormCategory(val as string)}
                style={{ width: '100%', marginTop: 6 }}
              >
                <Select.Option value="技术博客">技术博客</Select.Option>
                <Select.Option value="生活感悟">生活感悟</Select.Option>
                <Select.Option value="创意设计">创意设计</Select.Option>
              </Select>
            </div>
            <div>
              <Text strong>健康状态</Text>
              <Select
                value={formStatus}
                onChange={(val) => setFormStatus(val as any)}
                style={{ width: '100%', marginTop: 6 }}
              >
                <Select.Option value="正常">正常</Select.Option>
                <Select.Option value="待审核">待审核</Select.Option>
                <Select.Option value="异常">异常</Select.Option>
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
