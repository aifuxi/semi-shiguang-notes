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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
    { itemKey: 'content', text: '内容管理', icon: <IconArticle size="large" /> },
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
    <div className="h-full flex flex-col justify-between bg-[var(--semi-color-bg-1)] border-r border-[var(--semi-color-border)] select-none">
      {/* Brand Header */}
      <div>
        <div className={`h-16 px-4 flex items-center border-b border-[var(--semi-color-border)] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <Avatar
              size="small"
              shape="square"
              style={{ backgroundColor: 'var(--semi-color-primary)', color: '#fff', fontWeight: 'bold' }}
            >
              {settings.title.slice(0, 1)}
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm text-[var(--semi-color-text-0)] tracking-wide truncate">
                  {settings.title}
                </span>
                <span className="text-xs text-[var(--semi-color-text-2)] truncate">
                  {settings.subtitle}
                </span>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          <div className="lg:hidden">
            <Button
              theme="borderless"
              icon={<IconClose />}
              onClick={() => setIsMobileOpen(false)}
              size="small"
            />
          </div>
        </div>

        {/* Navigation List */}
        <div className="p-2">
          <Nav
            selectedKeys={[activeTab]}
            onSelect={(data) => {
              setActiveTab(data.itemKey as string);
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
                  <span className="flex items-center justify-between w-full">
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
      <div className="p-3 border-t border-[var(--semi-color-border)] space-y-2 bg-[var(--semi-color-bg-0)]">
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
        <div className="hidden lg:flex justify-end">
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
          className="fixed inset-0 bg-black/40 z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-55 w-64 lg:hidden transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sider */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 h-screen sticky top-0 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
