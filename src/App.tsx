/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, ReactNode, Suspense, useState, useEffect } from 'react';
import { Toast } from '@douyinfe/semi-ui';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { adminRoutes, AdminRouteKey } from './routes';

import {
  initialPosts,
  initialComments,
  initialSchedules,
  initialTrafficTrend,
  initialTrafficSources,
  defaultSiteHealth,
  defaultBlogSettings,
  initialLinks
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
import { readStoredValue, storedValueGuards, writeStoredValue } from './storage';

const Dashboard = lazy(() => import('./components/Dashboard'));
const ContentManagement = lazy(() => import('./components/ContentManagement'));
const CommentsManagement = lazy(() => import('./components/CommentsManagement'));
const MediaLibrary = lazy(() => import('./components/MediaLibrary'));
const CategoryManagement = lazy(() => import('./components/CategoryManagement'));
const DataAnalysis = lazy(() => import('./components/DataAnalysis'));
const VisitorsLog = lazy(() => import('./components/VisitorsLog'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const FriendsLinks = lazy(() => import('./components/FriendsLinks'));
const Changelog = lazy(() => import('./components/Changelog'));
const BlogFrontend = lazy(() => import('./components/BlogFrontend'));
const ComponentPlayground = lazy(() => import('./components/ComponentPlayground'));

export default function App() {
  // 1. Persistent States via LocalStorage
  const [posts, setPosts] = useState<Post[]>(() =>
    readStoredValue('shiguang_posts', initialPosts, storedValueGuards.posts)
  );

  const [comments, setComments] = useState<Comment[]>(() =>
    readStoredValue('shiguang_comments', initialComments, storedValueGuards.comments)
  );

  const [schedules, setSchedules] = useState<UpcomingSchedule[]>(() =>
    readStoredValue('shiguang_schedules', initialSchedules, storedValueGuards.schedules)
  );

  const [trafficTrend, setTrafficTrend] = useState<TrafficTrendItem[]>(() =>
    readStoredValue('shiguang_traffic_trend', initialTrafficTrend, storedValueGuards.trafficTrend)
  );

  const [trafficSources, setTrafficSources] = useState<TrafficSourceItem[]>(() =>
    readStoredValue('shiguang_traffic_sources', initialTrafficSources, storedValueGuards.trafficSources)
  );

  const [siteHealth, setSiteHealth] = useState<SiteHealth>(() =>
    readStoredValue('shiguang_site_health', defaultSiteHealth, storedValueGuards.siteHealth)
  );

  const [settings, setSettings] = useState<BlogSettings>(() =>
    readStoredValue('shiguang_settings', defaultBlogSettings, storedValueGuards.settings)
  );

  const [friendsLinks, setFriendsLinks] = useState<FriendLink[]>(() =>
    readStoredValue('shiguang_friends_links', initialLinks, storedValueGuards.friendsLinks)
  );

  // Dark Mode global state and sync with Semi Design theme-mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedDarkMode = readStoredValue<boolean | null>(
      'shiguang_dark_mode',
      null,
      storedValueGuards.darkMode
    );
    return storedDarkMode ?? (settings.theme === 'dark');
  });

  useEffect(() => {
    writeStoredValue('shiguang_dark_mode', isDarkMode);
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // 3. Inter-component interaction triggers
  const [selectedPostForEditing, setSelectedPostForEditing] = useState<Post | null>(null);
  const [showCreateFormOnLoad, setShowCreateFormOnLoad] = useState<boolean>(false);

  // Sync state modifications to LocalStorage
  useEffect(() => {
    writeStoredValue('shiguang_posts', posts);
  }, [posts]);

  useEffect(() => {
    writeStoredValue('shiguang_comments', comments);
  }, [comments]);

  useEffect(() => {
    writeStoredValue('shiguang_schedules', schedules);
  }, [schedules]);

  useEffect(() => {
    writeStoredValue('shiguang_traffic_trend', trafficTrend);
  }, [trafficTrend]);

  useEffect(() => {
    writeStoredValue('shiguang_traffic_sources', trafficSources);
  }, [trafficSources]);

  useEffect(() => {
    writeStoredValue('shiguang_site_health', siteHealth);
  }, [siteHealth]);

  useEffect(() => {
    writeStoredValue('shiguang_settings', settings);
  }, [settings]);

  useEffect(() => {
    writeStoredValue('shiguang_friends_links', friendsLinks);
  }, [friendsLinks]);

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
      navigate(adminRoutes.posts);
    } else if (actionType === 'upload_media') {
      navigate(adminRoutes.media);
    } else if (actionType === 'manage_categories') {
      navigate(adminRoutes.categories);
    }
  };

  const handlePostSelectedForEditing = (post: Post) => {
    setSelectedPostForEditing(post);
  };

  const handleNavigateToTab = (tab: AdminRouteKey) => {
    navigate(adminRoutes[tab]);
  };

  const pendingCommentsCount = comments.filter(c => c.status === '待审核').length;
  const activeTab = (Object.entries(adminRoutes).find(([, path]) => path === location.pathname)?.[0] ?? 'dashboard') as AdminRouteKey;
  const blogProps = {
    posts,
    comments,
    onAddComment: (newComment: Comment) => setComments(prev => [newComment, ...prev]),
    friendsLinks,
    onAddFriendLink: (newLink: FriendLink) => setFriendsLinks(prev => [...prev, newLink]),
    settings,
    isDarkMode,
    setIsDarkMode,
    onEnterAdmin: () => navigate(adminRoutes.dashboard)
  };
  const adminLayout = (page: ReactNode, tab: AdminRouteKey) => (
    <AdminLayout
      activeTab={tab}
      pendingCommentsCount={pendingCommentsCount}
      settings={settings}
      posts={posts}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isSidebarCollapsed={isSidebarCollapsed}
      setIsSidebarCollapsed={setIsSidebarCollapsed}
      isMobileOpen={isMobileOpen}
      setIsMobileOpen={setIsMobileOpen}
      onNavigateToTab={handleNavigateToTab}
      onCreatePostClick={() => handleQuickActionClick('create_post')}
      onPostSelectForEditing={handlePostSelectedForEditing}
      onViewFrontend={() => navigate('/')}
    >
      {page}
    </AdminLayout>
  );

  const routes = useRoutes([
    { path: '/', element: <BlogFrontend {...blogProps} /> },
    { path: '/articles', element: <BlogFrontend {...blogProps} /> },
    { path: '/friends', element: <BlogFrontend {...blogProps} /> },
    { path: '/changelog', element: <BlogFrontend {...blogProps} /> },
    {
      path: '/playground',
      element: (
        <ComponentPlayground
          settings={settings}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onEnterAdmin={() => navigate(adminRoutes.dashboard)}
        />
      )
    },
    { path: '/posts/:postId', element: <BlogFrontend {...blogProps} /> },
    {
      path: adminRoutes.dashboard,
      element: adminLayout(
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
        />,
        'dashboard'
      )
    },
    { path: adminRoutes.posts, element: adminLayout(<ContentManagement posts={posts} setPosts={setPosts} selectedPostForEditing={selectedPostForEditing} setSelectedPostForEditing={setSelectedPostForEditing} showCreateFormOnLoad={showCreateFormOnLoad} onClearCreateFormTrigger={() => setShowCreateFormOnLoad(false)} />, 'posts') },
    { path: adminRoutes.comments, element: adminLayout(<CommentsManagement comments={comments} setComments={setComments} />, 'comments') },
    { path: adminRoutes.media, element: adminLayout(<MediaLibrary />, 'media') },
    { path: adminRoutes.categories, element: adminLayout(<CategoryManagement />, 'categories') },
    { path: adminRoutes.analytics, element: adminLayout(<DataAnalysis />, 'analytics') },
    { path: adminRoutes.visitors, element: adminLayout(<VisitorsLog />, 'visitors') },
    { path: adminRoutes['friends-links'], element: adminLayout(<FriendsLinks links={friendsLinks} setLinks={setFriendsLinks} />, 'friends-links') },
    { path: adminRoutes.changelog, element: adminLayout(<Changelog />, 'changelog') },
    { path: adminRoutes.settings, element: adminLayout(<SettingsPanel settings={settings} setSettings={setSettings} />, 'settings') },
    { path: '/admin/*', element: adminLayout(<NotFoundPage onGoHome={() => navigate(adminRoutes.dashboard)} />, activeTab) },
    { path: '*', element: <NotFoundPage onGoHome={() => navigate('/')} /> }
  ]);

  return (
    <Suspense fallback={<div role="status" className="p-6 text-center text-[var(--semi-color-text-2)]">页面加载中…</div>}>
      {routes}
    </Suspense>
  );
}

interface AdminLayoutProps {
  activeTab: AdminRouteKey;
  pendingCommentsCount: number;
  settings: BlogSettings;
  posts: Post[];
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onNavigateToTab: (tab: AdminRouteKey) => void;
  onCreatePostClick: () => void;
  onPostSelectForEditing: (post: Post) => void;
  onViewFrontend: () => void;
  children: ReactNode;
}

function AdminLayout({
  activeTab,
  pendingCommentsCount,
  settings,
  posts,
  isDarkMode,
  setIsDarkMode,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onNavigateToTab,
  onCreatePostClick,
  onPostSelectForEditing,
  onViewFrontend,
  children
}: AdminLayoutProps) {
  return (
    <div className="flex bg-[var(--semi-color-bg-0)] min-h-screen text-[var(--semi-color-text-0)] font-sans antialiased transition-colors duration-200">
      <Sidebar activeTab={activeTab} setActiveTab={onNavigateToTab} pendingCommentsCount={pendingCommentsCount} settings={settings} isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} onViewFrontend={onViewFrontend} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header settings={settings} posts={posts} onCreatePostClick={onCreatePostClick} onNavigateToTab={onNavigateToTab} onPostSelectForEditing={onPostSelectForEditing} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
        <footer className="bg-[var(--semi-color-bg-1)] border-t border-[var(--semi-color-border)] py-4 px-6 shrink-0 text-xs text-[var(--semi-color-text-2)] font-medium transition-colors duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <span>&copy; 2025 {settings.title} • 基于 Semi Design 统一重构。</span>
            <div className="flex items-center gap-4">
              <span onClick={() => Toast.info('如需查阅帮助文档，可在设置中心查看系统能力')} className="hover:text-[var(--semi-color-text-0)] transition-colors cursor-pointer">帮助文档</span>
              <span onClick={() => Toast.info('欢迎在读者互动交流中提交宝贵反馈')} className="hover:text-[var(--semi-color-text-0)] transition-colors cursor-pointer">反馈建议</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function NotFoundPage({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--semi-color-bg-0)] text-[var(--semi-color-text-0)]">
      <h1 className="text-2xl font-semibold">页面不存在</h1>
      <p className="text-[var(--semi-color-text-2)]">请检查地址，或返回可用页面。</p>
      <button className="text-[var(--semi-color-primary)]" onClick={onGoHome}>返回</button>
    </div>
  );
}
