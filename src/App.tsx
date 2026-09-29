/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Toast, Modal } from '@douyinfe/semi-ui';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContentManagement from './components/ContentManagement';
import CommentsManagement from './components/CommentsManagement';
import MediaLibrary from './components/MediaLibrary';
import CategoryManagement from './components/CategoryManagement';
import DataAnalysis from './components/DataAnalysis';
import VisitorsLog from './components/VisitorsLog';
import SettingsPanel from './components/SettingsPanel';
import FriendsLinks, { initialLinks } from './components/FriendsLinks';
import Changelog from './components/Changelog';
import BlogFrontend from './components/BlogFrontend';

import {
  initialPosts,
  initialComments,
  initialSchedules,
  initialTrafficTrend,
  initialTrafficSources,
  defaultSiteHealth,
  defaultBlogSettings
} from './mockData';

import {
  Post,
  Comment,
  UpcomingSchedule,
  TrafficTrendItem,
  TrafficSourceItem,
  SiteHealth,
  BlogSettings,
  FriendLink
} from './types';

export default function App() {
  // 1. Persistent States via LocalStorage
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('shiguang_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('shiguang_comments');
    return saved ? JSON.parse(saved) : initialComments;
  });

  const [schedules, setSchedules] = useState<UpcomingSchedule[]>(() => {
    const saved = localStorage.getItem('shiguang_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [trafficTrend, setTrafficTrend] = useState<TrafficTrendItem[]>(() => {
    const saved = localStorage.getItem('shiguang_traffic_trend');
    return saved ? JSON.parse(saved) : initialTrafficTrend;
  });

  const [trafficSources, setTrafficSources] = useState<TrafficSourceItem[]>(() => {
    const saved = localStorage.getItem('shiguang_traffic_sources');
    return saved ? JSON.parse(saved) : initialTrafficSources;
  });

  const [siteHealth, setSiteHealth] = useState<SiteHealth>(() => {
    const saved = localStorage.getItem('shiguang_site_health');
    return saved ? JSON.parse(saved) : defaultSiteHealth;
  });

  const [settings, setSettings] = useState<BlogSettings>(() => {
    const saved = localStorage.getItem('shiguang_settings');
    return saved ? JSON.parse(saved) : defaultBlogSettings;
  });

  const [friendsLinks, setFriendsLinks] = useState<FriendLink[]>(() => {
    const saved = localStorage.getItem('shiguang_friends_links');
    return saved ? JSON.parse(saved) : initialLinks;
  });

  const [viewMode, setViewMode] = useState<'reader' | 'admin'>(() => {
    const saved = localStorage.getItem('shiguang_view_mode');
    return (saved as 'reader' | 'admin') || 'reader';
  });

  // Dark Mode global state and sync with Semi Design theme-mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('shiguang_dark_mode');
    if (saved) return saved === 'true';
    const savedSettings = localStorage.getItem('shiguang_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        return parsed.theme === 'dark';
      } catch (e) {}
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('shiguang_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.setAttribute('theme-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.removeAttribute('theme-mode');
    }
    if (settings.theme !== (isDarkMode ? 'dark' : 'light')) {
      setSettings(prev => ({ ...prev, theme: isDarkMode ? 'dark' : 'light' }));
    }
  }, [isDarkMode]);

  useEffect(() => {
    const isDarkSettings = settings.theme === 'dark';
    if (isDarkMode !== isDarkSettings) {
      setIsDarkMode(isDarkSettings);
    }
  }, [settings.theme]);

  // 2. Navigation & Interface States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // 3. Inter-component interaction triggers
  const [selectedPostForEditing, setSelectedPostForEditing] = useState<Post | null>(null);
  const [showCreateFormOnLoad, setShowCreateFormOnLoad] = useState<boolean>(false);

  // Sync state modifications to LocalStorage
  useEffect(() => {
    localStorage.setItem('shiguang_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('shiguang_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('shiguang_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('shiguang_traffic_trend', JSON.stringify(trafficTrend));
  }, [trafficTrend]);

  useEffect(() => {
    localStorage.setItem('shiguang_traffic_sources', JSON.stringify(trafficSources));
  }, [trafficSources]);

  useEffect(() => {
    localStorage.setItem('shiguang_site_health', JSON.stringify(siteHealth));
  }, [siteHealth]);

  useEffect(() => {
    localStorage.setItem('shiguang_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('shiguang_friends_links', JSON.stringify(friendsLinks));
  }, [friendsLinks]);

  useEffect(() => {
    localStorage.setItem('shiguang_view_mode', viewMode);
  }, [viewMode]);

  // Global operations
  const handleApproveComment = (id: string) => {
    setComments(prevComments =>
      prevComments.map(c => (c.id === id ? { ...c, status: '已通过' } : c))
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments(prevComments => prevComments.filter(c => c.id !== id));
  };

  const handleQuickActionClick = (actionType: 'create_post' | 'upload_media' | 'manage_categories') => {
    if (actionType === 'create_post') {
      setShowCreateFormOnLoad(true);
      setActiveTab('content');
    } else if (actionType === 'upload_media') {
      setActiveTab('media');
    } else if (actionType === 'manage_categories') {
      setActiveTab('categories');
    }
  };

  const handlePostSelectedForEditing = (post: Post) => {
    setSelectedPostForEditing(post);
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  const pendingCommentsCount = comments.filter(c => c.status === '待审核').length;

  if (viewMode === 'reader') {
    return (
      <BlogFrontend
        posts={posts}
        comments={comments}
        onAddComment={(newComment) => {
          setComments(prev => [newComment, ...prev]);
        }}
        friendsLinks={friendsLinks}
        onAddFriendLink={(newLink) => {
          setFriendsLinks(prev => [...prev, newLink]);
        }}
        settings={settings}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onEnterAdmin={() => setViewMode('admin')}
      />
    );
  }

  return (
    <div className="flex bg-[var(--semi-color-bg-0)] min-h-screen text-[var(--semi-color-text-0)] font-sans antialiased transition-colors duration-200">
      {/* Sidebar (Left) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCommentsCount={pendingCommentsCount}
        settings={settings}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onViewFrontend={() => setViewMode('reader')}
      />

      {/* Primary Layout Block */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Header Command Bar (Top) */}
        <Header
          settings={settings}
          posts={posts}
          onCreatePostClick={() => handleQuickActionClick('create_post')}
          onNavigateToTab={handleNavigateToTab}
          onPostSelectForEditing={handlePostSelectedForEditing}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onMenuClick={() => setIsMobileOpen(true)}
        />

        {/* Scrollable View Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              posts={posts}
              comments={comments}
              schedules={schedules}
              trafficTrend={trafficTrend}
              trafficSources={trafficSources}
              siteHealth={siteHealth}
              settings={settings}
              onNavigateToTab={handleNavigateToTab}
              onApproveComment={handleApproveComment}
              onDeleteComment={handleDeleteComment}
              onQuickActionClick={handleQuickActionClick}
            />
          )}

          {activeTab === 'content' && (
            <ContentManagement
              posts={posts}
              setPosts={setPosts}
              selectedPostForEditing={selectedPostForEditing}
              setSelectedPostForEditing={setSelectedPostForEditing}
              showCreateFormOnLoad={showCreateFormOnLoad}
              onClearCreateFormTrigger={() => setShowCreateFormOnLoad(false)}
            />
          )}

          {activeTab === 'comments' && (
            <CommentsManagement
              comments={comments}
              setComments={setComments}
            />
          )}

          {activeTab === 'media' && (
            <MediaLibrary />
          )}

          {activeTab === 'categories' && (
            <CategoryManagement />
          )}

          {activeTab === 'analytics' && (
            <DataAnalysis />
          )}

          {activeTab === 'visitors' && (
            <VisitorsLog />
          )}

          {activeTab === 'friends-links' && (
            <FriendsLinks links={friendsLinks} setLinks={setFriendsLinks} />
          )}

          {activeTab === 'changelog' && (
            <Changelog />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </main>

        {/* Workspace Footer */}
        <footer className="bg-[var(--semi-color-bg-1)] border-t border-[var(--semi-color-border)] py-4 px-6 shrink-0 text-xs text-[var(--semi-color-text-2)] font-medium transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span>&copy; 2025 {settings.title} • 基于 Semi Design 统一重构。</span>
            <div className="flex items-center gap-4">
              <span
                onClick={() => Toast.info('如需查阅帮助文档，可在设置中心查看系统能力')}
                className="hover:text-[var(--semi-color-text-0)] transition-colors cursor-pointer"
              >
                帮助文档
              </span>
              <span
                onClick={() => Toast.info('欢迎在读者互动交流中提交宝贵反馈')}
                className="hover:text-[var(--semi-color-text-0)] transition-colors cursor-pointer"
              >
                反馈建议
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
