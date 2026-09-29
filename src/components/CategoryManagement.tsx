/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Tag,
  Popconfirm,
  Toast,
  Typography,
  Space,
  Table,
  Badge
} from '@douyinfe/semi-ui';
import {
  IconFolder,
  IconPriceTag,
  IconPlus,
  IconDelete
} from '@douyinfe/semi-icons';
import { initialCategories, initialTags } from '../mockData';
import styles from './CategoryManagement.module.scss';

const { Title, Text } = Typography;

export default function CategoryManagement() {
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);

  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#0064fa');
  const [newTagName, setNewTagName] = useState('');

  const handleAddCategory = () => {
    if (newCatName.trim() === '') {
      Toast.warning('请输入分类名称');
      return;
    }
    if (categories.some((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase())) {
      Toast.warning('该分类已存在');
      return;
    }

    setCategories(prevCategories => [
      ...prevCategories,
      { name: newCatName.trim(), count: 0, color: newCatColor }
    ]);
    setNewCatName('');
    Toast.success('分类创建成功');
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prevCategories => prevCategories.filter((c) => c.name !== name));
    Toast.success(`分类 “${name}” 已删除`);
  };

  const handleAddTag = () => {
    if (newTagName.trim() === '') {
      Toast.warning('请输入标签名称');
      return;
    }
    if (tags.some((t) => t.name.toLowerCase() === newTagName.trim().toLowerCase())) {
      Toast.warning('该标签已存在');
      return;
    }

    setTags(prevTags => [...prevTags, { name: newTagName.trim(), count: 0 }]);
    setNewTagName('');
    Toast.success('标签创建成功');
  };

  const handleDeleteTag = (name: string) => {
    setTags(prevTags => prevTags.filter((t) => t.name !== name));
    Toast.success(`标签 “${name}” 已删除`);
  };

  const categoryColumns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: record.color || 'var(--semi-color-primary)' }}
          />
          <Text strong>{name}</Text>
        </div>
      )
    },
    {
      title: '关联博文',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      render: (count: number) => (
        <span className="font-mono text-xs text-[var(--semi-color-text-2)]">{count} 篇</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title={`确认删除分类 “${record.name}”？`}
          content="隶属于此分类的文章将归入默认分类"
          onConfirm={() => handleDeleteCategory(record.name)}
        >
          <Button
            theme="borderless"
            type="danger"
            size="small"
            icon={<IconDelete />}
          />
        </Popconfirm>
      )
    }
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div>
        <Title heading={3} style={{ margin: 0 }}>
          分类与标签
        </Title>
        <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
          建立清晰的知识架构与多维标签索引，帮助读者快速探索感兴趣的领域。
        </Text>
      </div>

      <Row gutter={[20, 20]}>
        {/* Categories Column */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <IconFolder style={{ color: 'var(--semi-color-primary)' }} />
                <span>博文分类体系</span>
                <Badge count={categories.length} type="primary" />
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '16px' }}
          >
            {/* Quick Add Form */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="新增分类标题..."
                value={newCatName}
                onChange={(val) => setNewCatName(val)}
                onEnterPress={handleAddCategory}
              />
              <input
                type="color"
                value={newCatColor}
                onChange={(e) => setNewCatColor(e.target.value)}
                className="w-9 h-8 p-0.5 rounded border border-[var(--semi-color-border)] cursor-pointer shrink-0 bg-transparent"
                title="选择分类主题色"
              />
              <Button
                theme="solid"
                type="primary"
                icon={<IconPlus />}
                onClick={handleAddCategory}
              >
                添加
              </Button>
            </div>

            <Table
              columns={categoryColumns}
              dataSource={categories}
              rowKey="name"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Tags Column */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <IconPriceTag style={{ color: 'var(--semi-color-success)' }} />
                <span>标签云检索</span>
                <Badge count={tags.length} type="success" />
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '16px' }}
          >
            {/* Quick Add Tag */}
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="新增标签词..."
                value={newTagName}
                onChange={(val) => setNewTagName(val)}
                onEnterPress={handleAddTag}
              />
              <Button
                theme="solid"
                type="primary"
                icon={<IconPlus />}
                onClick={handleAddTag}
              >
                添加
              </Button>
            </div>

            {/* Tag Badges Cloud */}
            <div className="flex flex-wrap gap-2.5 p-4 rounded-lg bg-[var(--semi-color-fill-0)] border border-[var(--semi-color-border)] min-h-[220px]">
              {tags.map((tag) => (
                <Tag
                  key={tag.name}
                  color="blue"
                  size="large"
                  closable
                  onClose={() => handleDeleteTag(tag.name)}
                  style={{
                    borderRadius: 'var(--semi-border-radius-medium)',
                    fontSize: 12
                  }}
                >
                  #{tag.name} <span className="opacity-70 text-[10px] ml-1">({tag.count})</span>
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
