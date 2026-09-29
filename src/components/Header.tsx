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
import styles from './Header.module.scss';

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
      <header className={styles.header}>
        {/* Left Area: Mobile menu & Quick Search */}
        <div className={styles.navigation}>
          {/* Mobile hamburger */}
          <div className={styles.mobileMenu}>
            <Button
              theme="borderless"
              icon={<IconMenu size="large" />}
              onClick={onMenuClick}
            />
          </div>

          {/* Quick Search Trigger */}
          <Button
            theme="outline"
            type="tertiary"
            icon={<IconSearch />}
            onClick={() => setShowSearchModal(true)}
            className={styles.searchButton}
            style={{
              justifyContent: 'flex-start',
              backgroundColor: 'var(--semi-color-bg-0)',
              color: 'var(--semi-color-text-2)'
            }}
          >
            <span className={styles.searchLabel}>搜索文章 / 分类...</span>
            <kbd className={styles.searchShortcut}>
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Right Area: Action Buttons & User Menu */}
        <div className={styles.actions}>
          {/* Create Post */}
          <Button
            theme="solid"
            type="primary"
            icon={<IconPlus />}
            onClick={onCreatePostClick}
          >
            <span className={styles.createLabel}>新建文章</span>
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
            <div className={styles.profileTrigger}>
              <Avatar
                size="small"
                src={settings.avatarUrl}
                style={{ backgroundColor: 'var(--semi-color-primary)' }}
              >
                {settings.authorName.slice(0, 1)}
              </Avatar>
              <div className={styles.profileDetails}>
                <span className={styles.profileName}>
                  {settings.authorName}
                </span>
                <span className={styles.profileRole}>
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
        <div className={styles.searchPanel}>
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

          <div className={styles.searchResults}>
            {searchQuery.trim() === '' ? (
              <div className={styles.searchEmpty}>
                支持检索文章标题、正文关键词、标签和所属分类
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className={styles.searchEmpty}>
                未找到包含 “{searchQuery}” 的相关文章
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handleSearchResultClick(post)}
                  className={styles.searchResult}
                >
                  <div className={styles.searchResultContent}>
                    <div className={styles.searchResultHeading}>
                      <IconArticle style={{ color: 'var(--semi-color-primary)' }} />
                      <span className={styles.searchResultTitle}>
                        {post.title}
                      </span>
                    </div>
                    <div className={styles.searchResultMeta}>
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
