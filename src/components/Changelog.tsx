/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Timeline,
  Card,
  Tag,
  Typography,
  Button,
  Modal,
  Input,
  TextArea,
  Select,
  Space,
  Toast
} from '@douyinfe/semi-ui';
import {
  IconHistory,
  IconPlus,
  IconSearch,
  IconCheckCircleStroked
} from '@douyinfe/semi-icons';
import styles from './Changelog.module.scss';

const { Title, Text, Paragraph } = Typography;

interface LogItem {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'performance' | 'security';
  title: string;
  author: string;
  changes: string[];
}

const initialLogs: LogItem[] = [
  {
    id: '1',
    version: 'v2.2.0',
    date: '2026-09-28',
    type: 'feature',
    title: '全站组件库重构：全面接入 Douyin Semi Design 设计系统',
    author: 'Semi Architect',
    changes: [
      '全面引入 @douyinfe/semi-ui、@douyinfe/semi-icons、@douyinfe/semi-illustrations',
      '重构前台读者端与后台控制台，统一界面控件规范与视觉交互标准',
      '保留广受好评的 Space Grotesk / JetBrains Mono 字体，深度融入 Semi 主题变量',
      '完善深色模式与 Semi 原生 theme-mode 同步机制'
    ]
  },
  {
    id: '2',
    version: 'v2.1.0',
    date: '2026-07-18',
    type: 'feature',
    title: '引入多维管理面板与友情链接枢纽',
    author: 'AI Designer',
    changes: [
      '优化评论管理模块，改善状态转移时的视觉抖动缺陷',
      '新增“友情链接”与“系统更新日志”核心支撑模块，完善整体管理矩阵布局',
      '强化文章快速检索系统，支持快捷键 ⌘K 随时唤起'
    ]
  },
  {
    id: '3',
    version: 'v2.0.4',
    date: '2026-06-30',
    type: 'security',
    title: '系统安全性加固与 API 可靠性升级',
    author: 'System Architect',
    changes: [
      '优化接口防抖与拦截策略，防止因密钥缺失引起页面加载挂起',
      '调整 iframe 通信机制，改善高级 Web 接口安全隔离表现',
      '在全局设置模块提供只读形式的 API Key 安全隔离遮罩'
    ]
  },
  {
    id: '4',
    version: 'v2.0.0',
    date: '2026-05-15',
    type: 'feature',
    title: '“拾光”内容管理系统 V2.0 重大更新',
    author: 'Lead Developer',
    changes: [
      '新增全新的“分类与标签”双轴心管理引擎',
      '引入“访客日志”探针，提供包括 IP、系统、驻留时间在内的安全溯源监控',
      '系统主控制台集成多维数据漏斗分析、访问增长曲线',
      '引入暗色模式完美对齐机制，卡片底色细化至深空灰蓝体系'
    ]
  },
  {
    id: '5',
    version: 'v1.4.2',
    date: '2026-03-10',
    type: 'performance',
    title: '渲染管道与核心资源吞吐性能优化',
    author: 'Perf Specialist',
    changes: [
      '优化 Tailwind 编译管道，使构建包缩小近 40%',
      '为文章编写面板内的 Markdown 预览模块添加防无限渲染优化',
      '优化大批量文章查询和标签组合索引的数组搜索时间复杂度'
    ]
  }
];

export default function Changelog() {
  const [logs, setLogs] = useState<LogItem[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formVersion, setFormVersion] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<'feature' | 'fix' | 'performance' | 'security'>('feature');
  const [formChanges, setFormChanges] = useState('');

  const handleAddLog = () => {
    if (!formVersion.trim() || !formTitle.trim()) {
      Toast.warning('请填写版本号和更新标题');
      return;
    }

    const changesArray = formChanges
      .split('\n')
      .map(c => c.trim())
      .filter(Boolean);

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newLog: LogItem = {
      id: `log-${Date.now()}`,
      version: formVersion.trim(),
      date: dateStr,
      type: formType,
      title: formTitle.trim(),
      author: 'Admin',
      changes: changesArray.length > 0 ? changesArray : ['常规细节优化与稳定性提升']
    };

    setLogs([newLog, ...logs]);
    Toast.success('版本记录已发布');
    setIsModalOpen(false);
    setFormVersion('');
    setFormTitle('');
    setFormChanges('');
  };

  const filteredLogs = logs.filter(log =>
    log.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.changes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeTag = (type: LogItem['type']) => {
    switch (type) {
      case 'feature':
        return <Tag color="blue">功能特性</Tag>;
      case 'fix':
        return <Tag color="amber">缺陷修复</Tag>;
      case 'performance':
        return <Tag color="green">性能优化</Tag>;
      case 'security':
        return <Tag color="red">安全加固</Tag>;
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeading}>
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            系统版本迭代日志
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            记录《拾光笔记》每一次演进脉络，回溯功能迭代与架构优化。
          </Text>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconPlus />}
          onClick={() => setIsModalOpen(true)}
        >
          发布新版本
        </Button>
      </div>

      {/* Filter */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className={styles.listHeading}>
          <Input
            prefix={<IconSearch />}
            placeholder="搜索版本号、功能词或特性..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            style={{ maxWidth: 320 }}
          />
          <Text type="secondary" size="small">
            已记录 <strong className={styles.resultCount}>{filteredLogs.length}</strong> 个迭代里程碑
          </Text>
        </div>
      </Card>

      {/* Timeline */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '24px' }}
      >
        <Timeline mode="left">
          {filteredLogs.map((log) => (
            <Timeline.Item
              key={log.id}
              time={log.date}
              type={log.type === 'feature' ? 'default' : log.type === 'security' ? 'error' : 'success'}
            >
              <div className={styles.releaseContent}>
                <div className={styles.releaseHeading}>
                  <span className={styles.releaseVersion}>
                    {log.version}
                  </span>
                  {getTypeTag(log.type)}
                  <span className={styles.releaseTitle}>
                    {log.title}
                  </span>
                </div>

                <div
                  className={styles.releaseDetails}
                  style={{
                    borderLeft: '2px solid var(--semi-color-fill-2)',
                    paddingLeft: 14,
                    marginTop: 10
                  }}
                >
                  {log.changes.map((change, idx) => (
                    <div
                      key={idx}
                      className={styles.changeItem}
                      style={{ color: 'var(--semi-color-text-1)', fontSize: 13.5 }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          backgroundColor: 'var(--semi-color-primary)',
                          flexShrink: 0,
                          marginTop: 8
                        }}
                      />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Create Version Modal */}
      <Modal
        title="发布版本更新日志"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddLog}
        okText="确认发布"
        cancelText="取消"
        width={560}
      >
        <div className={styles.releaseForm}>
          <div className={styles.versionFields}>
            <div>
              <Text strong>版本号 <span className={styles.requiredMark}>*</span></Text>
              <Input
                placeholder="v2.3.0"
                value={formVersion}
                onChange={(val) => setFormVersion(val)}
                style={{ marginTop: 6 }}
              />
            </div>
            <div>
              <Text strong>更新类型</Text>
              <Select
                value={formType}
                onChange={(val) => setFormType(val as any)}
                style={{ width: '100%', marginTop: 6 }}
              >
                <Select.Option value="feature">功能特性</Select.Option>
                <Select.Option value="fix">缺陷修复</Select.Option>
                <Select.Option value="performance">性能优化</Select.Option>
                <Select.Option value="security">安全加固</Select.Option>
              </Select>
            </div>
          </div>

          <div>
            <Text strong>版本更新主题 <span className={styles.requiredMark}>*</span></Text>
            <Input
              placeholder="简要概括此次升级核心..."
              value={formTitle}
              onChange={(val) => setFormTitle(val)}
              style={{ marginTop: 6 }}
            />
          </div>

          <div>
            <Text strong>更新条目清单 (每行一条)</Text>
            <TextArea
              rows={5}
              placeholder="新增某个核心模块...&#10;优化某些交互细节...&#10;修复某些显示缺陷..."
              value={formChanges}
              onChange={(val) => setFormChanges(val)}
              style={{ marginTop: 6 }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
