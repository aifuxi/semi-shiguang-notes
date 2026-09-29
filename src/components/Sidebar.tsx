/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Nav, Button, Badge, Avatar, Tooltip } from '@douyinfe/semi-ui';
import {
  IconHome,
  IconArticle,
  IconComment,
  IconImage,
  IconPriceTag,
  IconBarChartHStroked,
  IconUserGroup,
  IconLink,
  IconHistory,
  IconSetting,
  IconDoubleChevronLeft,
  IconDoubleChevronRight,
  IconGlobeStroke,
  IconClose
} from '@douyinfe/semi-icons';
import { BlogSettings } from '../types';
import { AdminRouteKey } from '../routes';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  activeTab: AdminRouteKey;
  setActiveTab: (tab: AdminRouteKey) => void;
  pendingCommentsCount: number;
  settings: BlogSettings;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onViewFrontend?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingCommentsCount,
  settings,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onViewFrontend
}: SidebarProps) {
  const navItems = [
    { itemKey: 'dashboard', text: '仪表盘', icon: <IconHome size="large" /> },
    { itemKey: 'posts', text: '内容管理', icon: <IconArticle size="large" /> },
    {
      itemKey: 'comments',
      text: '评论管理',
      icon: <IconComment size="large" />,
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : undefined
    },
    { itemKey: 'media', text: '媒体库', icon: <IconImage size="large" /> },
    { itemKey: 'categories', text: '分类与标签', icon: <IconPriceTag size="large" /> },
    { itemKey: 'analytics', text: '数据分析', icon: <IconBarChartHStroked size="large" /> },
    { itemKey: 'visitors', text: '访客日志', icon: <IconUserGroup size="large" /> },
    { itemKey: 'friends-links', text: '友情链接', icon: <IconLink size="large" /> },
    { itemKey: 'changelog', text: '更新日志', icon: <IconHistory size="large" /> },
    { itemKey: 'settings', text: '系统设置', icon: <IconSetting size="large" /> },
  ];

  const sidebarContent = (
    <div className={styles.sidebarContent}>
      {/* Brand Header */}
      <div>
        <div className={`${styles.brandHeader} ${isCollapsed ? styles.brandHeaderCollapsed : styles.brandHeaderExpanded}`}>
          <div className={styles.brand} onClick={() => setActiveTab('dashboard')}>
            <Avatar
              size="small"
              shape="square"
              style={{ backgroundColor: 'var(--semi-color-primary)', color: '#fff', fontWeight: 'bold' }}
            >
              {settings.title.slice(0, 1)}
            </Avatar>
            {!isCollapsed && (
              <div className={styles.brandText}>
                <span className={styles.brandTitle}>
                  {settings.title}
                </span>
                <span className={styles.brandSubtitle}>
                  {settings.subtitle}
                </span>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          <div className={styles.mobileClose}>
            <Button
              theme="borderless"
              icon={<IconClose />}
              onClick={() => setIsMobileOpen(false)}
              size="small"
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className={styles.navigation}>
          <Nav
            selectedKeys={[activeTab]}
            onSelect={(data) => {
              setActiveTab(data.itemKey as AdminRouteKey);
              setIsMobileOpen(false);
            }}
            isCollapsed={isCollapsed}
            style={{ width: '100%', border: 'none' }}
          >
            {navItems.map((item) => (
              <Nav.Item
                key={item.itemKey}
                itemKey={item.itemKey}
                text={
                  <span className={styles.navigationItem}>
                    <span>{item.text}</span>
                    {!isCollapsed && item.badge ? (
                      <Badge count={item.badge} type="danger" style={{ marginLeft: 8 }} />
                    ) : null}
                  </span>
                }
                icon={item.icon}
                style={{
                  borderRadius: 'var(--semi-border-radius-medium)',
                  marginBottom: '2px'
                }}
              />
            ))}
          </Nav>
        </div>
      </div>

      {/* Footer Controls */}
      <div className={styles.sidebarFooter}>
        {/* View Frontend Portal */}
        {onViewFrontend && (
          <Tooltip content="预览前台读者端" position="right">
            <Button
              theme="light"
              type="primary"
              icon={<IconGlobeStroke />}
              block={!isCollapsed}
              onClick={onViewFrontend}
              style={{
                width: isCollapsed ? '100%' : undefined,
                borderRadius: 'var(--semi-border-radius-medium)'
              }}
            >
              {!isCollapsed && '前往前台博客'}
            </Button>
          </Tooltip>
        )}

        {/* Desktop Collapse Toggle */}
        <div className={styles.collapseAction}>
          <Button
            theme="borderless"
            type="tertiary"
            icon={isCollapsed ? <IconDoubleChevronRight /> : <IconDoubleChevronLeft />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            block={!isCollapsed}
          >
            {!isCollapsed && '收起侧边栏'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`${styles.mobileSidebar} ${isMobileOpen ? styles.mobileSidebarOpen : styles.mobileSidebarClosed}`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sider */}
      <aside
        className={`${styles.desktopSidebar} ${isCollapsed ? styles.desktopSidebarCollapsed : styles.desktopSidebarExpanded}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
