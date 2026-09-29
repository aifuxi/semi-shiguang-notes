/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Input,
  Dropdown,
  Avatar,
  Badge,
  Modal,
  Tag,
  Tooltip,
  Typography,
  Divider,
  Toast
} from '@douyinfe/semi-ui';
import {
  IconSearch,
  IconPlus,
  IconBell,
  IconSun,
  IconMoon,
  IconMenu,
  IconUser,
  IconSetting,
  IconExit,
  IconTick,
  IconChevronDown,
  IconArticle,
  IconClock
} from '@douyinfe/semi-icons';
import { BlogSettings, Post } from '../types';
import { AdminRouteKey } from '../routes';

const { Text } = Typography;

interface HeaderProps {
  settings: BlogSettings;
  posts: Post[];
  onCreatePostClick: () => void;
  onNavigateToTab: (tab: AdminRouteKey) => void;
  onPostSelectForEditing: (post: Post) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onMenuClick?: () => void;
}

export default function Header({
  settings,
  posts,
  onCreatePostClick,
  onNavigateToTab,
  onPostSelectForEditing,
  isDarkMode,
  setIsDarkMode,
  onMenuClick
}: HeaderProps) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: '有新的评论待审核', desc: '用户“小雨”评论了你的文章《如何保持写作灵感》', time: '10 分钟前', unread: true },
    { id: 2, title: '文章发布计划完成', desc: '定时文章《Mac 效率工具清单（2025 版）》已成功发布', time: '1 小时前', unread: true },
    { id: 3, title: '系统自动备份成功', desc: '备份文件上传至云存储，耗时 12s，状态良好', time: '4 小时前', unread: false },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl/Cmd + K for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearchModal(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchResultClick = (post: Post) => {
    onPostSelectForEditing(post);
    onNavigateToTab('posts');
    setShowSearchModal(false);
    setSearchQuery('');
  };

  const filteredPosts = searchQuery.trim() === ''
    ? []
    : posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    Toast.success('所有通知已标记为已读');
  };

  const notificationContent = (
    <div style={{ width: 320, padding: '8px 0' }}>
      <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--semi-color-border)' }}>
        <Text strong>系统通知</Text>
        {unreadCount > 0 && (
          <Button theme="borderless" type="primary" size="small" onClick={markAllRead}>
            全部已读
          </Button>
        )}
      </div>
      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {notifications.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--semi-color-border)',
              cursor: 'pointer',
              backgroundColor: item.unread ? 'var(--semi-color-primary-light-default)' : 'transparent'
            }}
            onClick={() => {
              setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text strong size="small">{item.title}</Text>
              {item.unread ? <Badge dot type="danger" /> : <IconTick style={{ color: 'var(--semi-color-text-2)' }} />}
            </div>
            <Text type="secondary" size="small" style={{ display: 'block', marginTop: 4 }}>{item.desc}</Text>
            <Text type="tertiary" size="small" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>{item.time}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-[var(--semi-color-bg-1)] border-b border-[var(--semi-color-border)] sticky top-0 z-40 flex items-center justify-between">
        {/* Left Area: Mobile menu & Quick Search */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <div className="lg:hidden">
            <Button
              theme="borderless"
              icon={<IconMenu size="large" />}
              onClick={onMenuClick}
            />
          </div>

          {/* Quick Search Trigger */}
          <div
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-[var(--semi-border-radius-medium)] border border-[var(--semi-color-border)] bg-[var(--semi-color-bg-0)] hover:border-[var(--semi-color-primary)] text-[var(--semi-color-text-2)] hover:text-[var(--semi-color-text-1)] cursor-pointer text-xs sm:text-sm transition-all"
            style={{ width: 220 }}
          >
            <IconSearch />
            <span className="flex-1 truncate">搜索文章 / 分类...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-[var(--semi-color-fill-0)] border border-[var(--semi-color-border)] font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Area: Action Buttons & User Menu */}
        <div className="flex items-center gap-3">
          {/* Create Post */}
          <Button
            theme="solid"
            type="primary"
            icon={<IconPlus />}
            onClick={onCreatePostClick}
          >
            <span className="hidden sm:inline">新建文章</span>
          </Button>

          {/* Notifications */}
          <Dropdown
            position="bottomRight"
            render={notificationContent}
            trigger="click"
          >
            <div>
              <Tooltip content="系统通知">
                <Button
                  theme="borderless"
                  type="tertiary"
                  icon={
                    <Badge count={unreadCount} overflowCount={99}>
                      <IconBell size="large" />
                    </Badge>
                  }
                />
              </Tooltip>
            </div>
          </Dropdown>

          {/* Dark Mode Toggle */}
          <Tooltip content={isDarkMode ? '切换为浅色模式' : '切换为深色模式'}>
            <Button
              theme="borderless"
              type="tertiary"
              icon={isDarkMode ? <IconSun size="large" /> : <IconMoon size="large" />}
              onClick={() => setIsDarkMode(!isDarkMode)}
            />
          </Tooltip>

          <Divider layout="vertical" style={{ height: 20, margin: '0 4px' }} />

          {/* User Profile Dropdown */}
          <Dropdown
            position="bottomRight"
            render={
              <Dropdown.Menu>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--semi-color-border)' }}>
                  <Text strong style={{ display: 'block' }}>{settings.authorName}</Text>
                  <Text type="secondary" size="small">{settings.authorRole}</Text>
                </div>
                <Dropdown.Item icon={<IconUser />} onClick={() => onNavigateToTab('settings')}>
                  个人中心
                </Dropdown.Item>
                <Dropdown.Item icon={<IconSetting />} onClick={() => onNavigateToTab('settings')}>
                  博客设置
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  icon={<IconExit />}
                  type="danger"
                  onClick={() => Toast.info('如需登出，请在系统设置中清除授权凭证')}
                >
                  安全退出
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-[var(--semi-color-fill-0)] transition-colors">
              <Avatar
                size="small"
                src={settings.avatarUrl}
                style={{ backgroundColor: 'var(--semi-color-primary)' }}
              >
                {settings.authorName.slice(0, 1)}
              </Avatar>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-[var(--semi-color-text-0)] leading-tight">
                  {settings.authorName}
                </span>
                <span className="text-[10px] text-[var(--semi-color-text-2)] leading-none mt-0.5">
                  {settings.authorRole}
                </span>
              </div>
              <IconChevronDown size="small" style={{ color: 'var(--semi-color-text-2)' }} />
            </div>
          </Dropdown>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <Modal
        title="全局内容检索"
        visible={showSearchModal}
        onCancel={() => setShowSearchModal(false)}
        footer={null}
        width={560}
      >
        <div className="space-y-4">
          <Input
            ref={searchInputRef}
            prefix={<IconSearch />}
            placeholder="输入文章标题、标签或分类名称进行实时检索..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            size="large"
            autoFocus
          />

          <div className="max-h-80 overflow-y-auto space-y-2 pt-2">
            {searchQuery.trim() === '' ? (
              <div className="text-center py-8 text-[var(--semi-color-text-2)] text-sm">
                支持检索文章标题、正文关键词、标签和所属分类
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-[var(--semi-color-text-2)] text-sm">
                未找到包含 “{searchQuery}” 的相关文章
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleSearchResultClick(post)}
                  className="p-3 rounded-lg border border-[var(--semi-color-border)] hover:border-[var(--semi-color-primary)] hover:bg-[var(--semi-color-fill-0)] cursor-pointer transition-all flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <IconArticle style={{ color: 'var(--semi-color-primary)' }} />
                      <span className="font-medium text-sm text-[var(--semi-color-text-0)] truncate">
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--semi-color-text-2)]">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span>{post.publishTime}</span>
                    </div>
                  </div>
                  <Tag color="blue" size="small">编辑</Tag>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
