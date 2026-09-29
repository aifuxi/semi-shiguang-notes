/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Layout,
  Nav,
  Card,
  Button,
  Input,
  TextArea,
  Tag,
  Avatar,
  Divider,
  Typography,
  Space,
  Row,
  Col,
  Badge,
  Modal,
  Toast,
  Empty,
  BackTop,
  Tooltip,
  RadioGroup,
  Radio,
  Pagination
} from '@douyinfe/semi-ui';
import {
  IconHome,
  IconArticle,
  IconComment,
  IconLink,
  IconHistory,
  IconSetting,
  IconSearch,
  IconSun,
  IconMoon,
  IconArrowLeft,
  IconSend,
  IconLikeHeart,
  IconEyeOpened,
  IconClock,
  IconPlus,
  IconMenu,
  IconTick,
  IconChevronRight,
  IconGlobeStroke
} from '@douyinfe/semi-icons';
import {
  IllustrationNoResult,
  IllustrationNoContent,
  IllustrationSuccess
} from '@douyinfe/semi-illustrations';
import { Post, Comment, FriendLink, BlogSettings } from '../types';
import Changelog from './Changelog';
import { frontendRoutes, FrontendRouteKey } from '../routes';
import styles from './BlogFrontend.module.scss';

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

interface BlogFrontendProps {
  posts: Post[];
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  friendsLinks: FriendLink[];
  onAddFriendLink: (link: FriendLink) => void;
  settings: BlogSettings;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onEnterAdmin: () => void;
}

export default function BlogFrontend({
  posts,
  comments,
  onAddComment,
  friendsLinks,
  onAddFriendLink,
  settings,
  isDarkMode,
  setIsDarkMode,
  onEnterAdmin
}: BlogFrontendProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams();
  const selectedPost = posts.find(post => post.id === postId && post.status === '已发布') ?? null;
  const isDetailRoute = location.pathname.startsWith('/posts/');
  const currentTab: FrontendRouteKey = location.pathname === '/articles'
    ? 'articles'
    : location.pathname === '/friends'
      ? 'friends'
      : location.pathname === '/changelog'
        ? 'changelog'
        : 'home';

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [selectedTag, setSelectedTag] = useState<string>('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Comment submission form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);

  // Friend Link application form
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDesc, setLinkDesc] = useState('');
  const [linkCategory, setLinkCategory] = useState('技术博客');
  const [linkAvatar, setLinkAvatar] = useState('');

  // Likes state
  const [likedPosts, setLikedPosts] = useState<Record<string, number>>({});

  const avatarPresets = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  ];

  // Extract published posts
  const publishedPosts = useMemo(() => {
    return posts.filter(post => post.status === '已发布');
  }, [posts]);

  // Categories count
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    publishedPosts.forEach(post => {
      stats[post.category] = (stats[post.category] || 0) + 1;
    });
    return stats;
  }, [publishedPosts]);

  const tagCloud = useMemo(() => {
    const tags = new Set<string>();
    publishedPosts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [publishedPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory;
      const matchesTag = selectedTag === '全部' || post.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [publishedPosts, searchQuery, selectedCategory, selectedTag]);

  // Comments for selected post
  const commentsForPost = useMemo(() => {
    if (!selectedPost) return [];
    return comments.filter(c => c.postTitle === selectedPost.title && c.status === '已通过');
  }, [comments, selectedPost]);

  const totalViews = useMemo(() => {
    return publishedPosts.reduce((acc, p) => acc + (p.views || 0), 0);
  }, [publishedPosts]);

  const approvedFriendsLinks = useMemo(() => {
    return friendsLinks.filter(l => l.status === '正常');
  }, [friendsLinks]);

  const handleSelectPost = (post: Post) => {
    navigate(`/posts/${encodeURIComponent(post.id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    navigate(frontendRoutes.articles);
  };

  const handleCommentSubmit = () => {
    if (!commentAuthor.trim() || !commentContent.trim() || !selectedPost) {
      Toast.warning('请填写昵称与评论内容');
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: commentAuthor.trim(),
      avatar: avatarPresets[selectedAvatarIdx],
      time: '刚刚',
      timestamp: new Date().toISOString(),
      content: commentContent.trim(),
      status: '待审核',
      postTitle: selectedPost.title,
      email: commentEmail.trim() || 'reader@example.com'
    };

    onAddComment(newComment);
    Toast.success('评论已提交，待博主审核后公开展示');
    setCommentContent('');
  };

  const handleFriendLinkSubmit = () => {
    if (!linkName.trim() || !linkUrl.trim()) {
      Toast.warning('请填写网站名称与链接地址');
      return;
    }

    const newLink: FriendLink = {
      id: `link-${Date.now()}`,
      name: linkName.trim(),
      url: linkUrl.trim(),
      avatar: linkAvatar.trim() || avatarPresets[Math.floor(Math.random() * avatarPresets.length)],
      description: linkDesc.trim() || '期待与博主常来常往',
      category: linkCategory,
      status: '待审核',
      sortOrder: friendsLinks.length + 1
    };

    onAddFriendLink(newLink);
    Toast.success('友链申请已提交，等待博主审核');
    setIsApplyModalOpen(false);
    setLinkName('');
    setLinkUrl('');
    setLinkDesc('');
    setLinkAvatar('');
  };

  const handleLikePost = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    Toast.success('感谢你的点赞与鼓励！');
  };

  if (isDetailRoute && !selectedPost) {
    return (
      <Layout className="min-h-screen bg-[var(--semi-color-bg-0)] text-[var(--semi-color-text-0)]">
        <Content className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col items-center gap-4">
          <Title heading={3}>文章不存在</Title>
          <Text type="secondary">这篇文章可能已被删除，或链接地址无效。</Text>
          <Button theme="light" type="primary" onClick={handleBackToList}>返回博文列表</Button>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-[var(--semi-color-bg-0)] text-[var(--semi-color-text-0)]">
      {/* 1. Header Navigation Bar */}
      <Header className="sticky top-0 z-50 bg-[var(--semi-color-bg-1)] border-b border-[var(--semi-color-border)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => navigate(frontendRoutes.home)}
            className="flex items-center gap-3.5 cursor-pointer select-none"
          >
            <Avatar
              size="medium"
              shape="square"
              style={{ backgroundColor: 'var(--semi-color-primary)', fontWeight: 'bold' }}
            >
              {settings.title.slice(0, 1)}
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-base text-[var(--semi-color-text-0)] tracking-tight leading-tight">
                {settings.title}
              </span>
              <span className="text-[11px] text-[var(--semi-color-text-2)] mt-0.5">
                {settings.subtitle || '时光流转，执笔留念'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5">
            {[
              { id: 'home', label: '首页', icon: <IconHome /> },
              { id: 'articles', label: '精选博文', icon: <IconArticle /> },
              { id: 'friends', label: '友情链接', icon: <IconLink /> },
              { id: 'changelog', label: '更新日志', icon: <IconHistory /> },
              { id: 'playground', label: '组件预览', icon: <IconSetting /> },
            ].map((tab) => {
              const isActive = currentTab === tab.id && (!selectedPost || tab.id !== 'home');
              return (
                <Button
                  key={tab.id}
                  theme={isActive ? 'light' : 'borderless'}
                  type={isActive ? 'primary' : 'tertiary'}
                  icon={tab.icon}
                  onClick={() => {
                    navigate(frontendRoutes[tab.id as FrontendRouteKey]);
                  }}
                  style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </nav>

          {/* Actions on right */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Tooltip content={isDarkMode ? '切换为浅色主题' : '切换为深色主题'}>
              <Button
                theme="borderless"
                type="tertiary"
                icon={isDarkMode ? <IconSun size="large" /> : <IconMoon size="large" />}
                onClick={() => setIsDarkMode(!isDarkMode)}
              />
            </Tooltip>

            {/* Admin Console Entry */}
            <Button
              theme="solid"
              type="primary"
              icon={<IconSetting />}
              onClick={onEnterAdmin}
            >
              管理控制台
            </Button>
          </div>
        </div>
      </Header>

      {/* 2. Main Content Workspace */}
      <Content className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* ARTICLE DETAIL VIEW */}
        {selectedPost ? (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Back Button */}
            <div>
              <Button
                theme="light"
                type="tertiary"
                icon={<IconArrowLeft />}
                onClick={handleBackToList}
              >
                返回博文列表
              </Button>
            </div>

            {/* Article Card */}
            <Card
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '40px 36px' }}
            >
              {/* Meta header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Tag color="cyan" size="large">
                    {selectedPost.category}
                  </Tag>
                  {selectedPost.tags.map(tag => (
                    <Tag key={tag} color="white" size="large">
                      #{tag}
                    </Tag>
                  ))}
                </div>

                <Title heading={2} style={{ margin: '8px 0', lineHeight: 1.35 }}>
                  {selectedPost.title}
                </Title>

                <div className="flex items-center gap-4 text-xs text-[var(--semi-color-text-2)] font-mono flex-wrap pt-2 border-b border-[var(--semi-color-border)] pb-4">
                  <span>作者: {settings.authorName}</span>
                  <span>•</span>
                  <span>{selectedPost.publishTime}</span>
                  <span>•</span>
                  <span>{selectedPost.views?.toLocaleString() || 0} 次阅读</span>
                  <span>•</span>
                  <span>{commentsForPost.length} 条评论</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-[var(--semi-color-text-1)] space-y-6 font-sans py-8">
                {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <Divider style={{ margin: '32px 0' }} />

              {/* Likes & Share Action */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  theme="light"
                  type="danger"
                  icon={<IconLikeHeart />}
                  size="large"
                  onClick={() => handleLikePost(selectedPost.id)}
                >
                  为文章点赞 ({likedPosts[selectedPost.id] || 88})
                </Button>

                <Button
                  theme="light"
                  type="tertiary"
                  size="large"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    Toast.success('文章链接已成功复制到剪贴板！');
                  }}
                >
                  分享本文
                </Button>
              </div>
            </Card>

            {/* Author Bio Card */}
            <Card
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '28px 32px' }}
            >
              <div className="flex items-center gap-5">
                <Avatar size="extra-large" src={settings.avatarUrl}>
                  {settings.authorName.slice(0, 1)}
                </Avatar>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <Text strong style={{ fontSize: 16 }}>{settings.authorName}</Text>
                    <Tag color="blue" size="small">{settings.authorRole}</Tag>
                  </div>
                  <Text type="secondary" size="small" style={{ lineHeight: 1.6, display: 'block' }}>
                    {settings.aboutMe || '专注于全栈开发与设计系统，记录探索点滴。'}
                  </Text>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card
              title={
                <div className="flex items-center gap-2.5 text-base font-semibold">
                  <IconComment style={{ color: 'var(--semi-color-primary)' }} />
                  <span>读者互动交流 ({commentsForPost.length})</span>
                </div>
              }
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '32px' }}
            >
              {/* Submit Comment Box */}
              <div className="space-y-4 mb-8 p-6 rounded-xl bg-[var(--semi-color-fill-0)] border border-[var(--semi-color-border)]">
                <Text strong style={{ fontSize: 15 }}>留下你的观点与思考</Text>

                {/* Avatar Picker */}
                <div className="flex items-center gap-2">
                  <Text type="secondary" size="small">选择形象:</Text>
                  <Space>
                    {avatarPresets.map((src, i) => (
                      <Avatar
                        key={i}
                        size="small"
                        src={src}
                        className={`cursor-pointer transition-transform ${selectedAvatarIdx === i ? 'ring-2 ring-[var(--semi-color-primary)] scale-110' : 'opacity-70'}`}
                        onClick={() => setSelectedAvatarIdx(i)}
                      />
                    ))}
                  </Space>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="你的昵称 *"
                    value={commentAuthor}
                    onChange={(val) => setCommentAuthor(val)}
                  />
                  <Input
                    placeholder="电子邮箱 (选填，仅用于接收回复)"
                    value={commentEmail}
                    onChange={(val) => setCommentEmail(val)}
                  />
                </div>

                <TextArea
                  rows={3}
                  placeholder="写下你的真实想法，友善交流，互相启发..."
                  value={commentContent}
                  onChange={(val) => setCommentContent(val)}
                />

                <div className="flex justify-end">
                  <Button
                    theme="solid"
                    type="primary"
                    icon={<IconSend />}
                    onClick={handleCommentSubmit}
                  >
                    发送留言
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              {commentsForPost.length === 0 ? (
                <Empty
                  image={<IllustrationNoContent style={{ width: 120, height: 120 }} />}
                  title="暂无读者留言"
                  description="期待你成为第一个留下足迹的小伙伴"
                />
              ) : (
                <div className="divide-y divide-[var(--semi-color-border)]">
                  {commentsForPost.map((c) => (
                    <div key={c.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Avatar size="small" src={c.avatar}>
                            {c.author.slice(0, 1)}
                          </Avatar>
                          <span className="font-semibold text-xs text-[var(--semi-color-text-0)]">
                            {c.author}
                          </span>
                          {c.author.includes('博主') && (
                            <Tag color="purple" size="small">博主</Tag>
                          )}
                        </div>
                        <span className="text-[11px] text-[var(--semi-color-text-2)] font-mono">
                          {c.time}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[var(--semi-color-text-1)] pl-9 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : currentTab === 'home' ? (
          /* TAB: HOME */
          <div className="space-y-12">
            {/* Hero Banner */}
            <Card
              bordered
              style={{
                borderRadius: 'var(--semi-border-radius-medium)',
                backgroundImage: 'radial-gradient(ellipse at top left, var(--semi-color-primary-light-default), transparent 60%)',
                marginBottom: 44
              }}
              bodyStyle={{ padding: '48px 40px' }}
            >
              <div className="max-w-2xl space-y-4">
                <Tag color="blue" size="large" style={{ padding: '4px 10px' }}>
                  ✨ Douyin Semi Design 驱动的极简博客
                </Tag>
                <Title heading={1} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {settings.title}
                </Title>
                <Paragraph type="secondary" style={{ fontSize: 16, lineHeight: 1.7 }}>
                  {settings.subtitle || '静下心来，沉淀每一段技术探求与生活感悟。'}
                </Paragraph>

                {/* Instant Search Bar */}
                <div className="pt-3 max-w-lg">
                  <Input
                    prefix={<IconSearch />}
                    size="large"
                    placeholder="实时搜索文章标题、技术栈或核心概念..."
                    value={searchQuery}
                    onChange={(val) => {
                      setSearchQuery(val);
                      if (val.trim()) navigate(frontendRoutes.articles);
                    }}
                    showClear
                  />
                </div>
              </div>
            </Card>

            {/* Content & Sidebar Grid with Generous Spacing */}
            <Row gutter={[36, 36]} className={styles.contentRow}>
              {/* Left Column: Recent Articles */}
              <Col xs={24} lg={16} className={styles.articlesColumn}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <Title heading={3} style={{ margin: 0, fontSize: 20 }}>
                        最新文章精选
                      </Title>
                      <Text type="secondary" size="small" style={{ marginTop: 2, display: 'block' }}>
                        沉淀深度技术思考与工程实践分享
                      </Text>
                    </div>
                    <Button
                      theme="borderless"
                      type="primary"
                      onClick={() => navigate(frontendRoutes.articles)}
                    >
                      浏览全部 ({publishedPosts.length}) &rarr;
                    </Button>
                  </div>

                  <div className={styles.articlesStack}>
                    {publishedPosts.slice(0, 4).map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleSelectPost(post)}
                        className="cursor-pointer group"
                      >
                        <Card
                          bordered
                          className="transition-all duration-200 group-hover:shadow-sm"
                          style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                          bodyStyle={{ padding: '26px 28px' }}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Tag color="cyan" size="small">
                                {post.category}
                              </Tag>
                              <span className="text-xs text-[var(--semi-color-text-2)] font-mono">
                                {post.publishTime.slice(0, 10)}
                              </span>
                            </div>

                            <Title heading={4} style={{ margin: 0 }} className="group-hover:text-[var(--semi-color-primary)] transition-colors">
                              {post.title}
                            </Title>

                            <Paragraph
                              type="secondary"
                              ellipsis={{ rows: 2 }}
                              style={{ margin: 0, fontSize: 13, lineHeight: 1.65 }}
                            >
                              {post.content}
                            </Paragraph>

                            <div className="pt-4 border-t border-[var(--semi-color-border)] flex items-center justify-between text-xs text-[var(--semi-color-text-2)]">
                              <div className="flex items-center gap-2">
                                {post.tags.map(t => (
                                  <Tag key={t} size="small" color="white">
                                    #{t}
                                  </Tag>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 font-mono">
                                <span><IconEyeOpened size="small" /> {post.views || 0} 次阅读</span>
                                <span className="text-[var(--semi-color-primary)] font-sans group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                                  阅读全文 &rarr;
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Browse All Action */}
                  <div className="pt-4 flex justify-center">
                    <Button
                      theme="light"
                      type="primary"
                      size="large"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        navigate(frontendRoutes.articles);
                      }}
                      style={{
                        borderRadius: 'var(--semi-border-radius-medium)',
                        padding: '10px 28px',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                    >
                      浏览全部 {publishedPosts.length} 篇深度博文 &rarr;
                    </Button>
                  </div>
                </div>
              </Col>

              {/* Right Column: Profile & Category Widgets with Ample Spacing */}
              <Col xs={24} lg={8}>
                <div className={styles.sidebarStack}>
                  {/* Blogger Card */}
                  <Card
                    bordered
                    style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                    bodyStyle={{ padding: '28px 24px' }}
                  >
                    <div className="text-center space-y-4">
                      <Avatar size="extra-large" src={settings.avatarUrl}>
                        {settings.authorName.slice(0, 1)}
                      </Avatar>
                      <div>
                        <div className="font-bold text-lg text-[var(--semi-color-text-0)]">
                          {settings.authorName}
                        </div>
                        <Text type="secondary" size="small">{settings.authorRole}</Text>
                      </div>
                      <Paragraph type="secondary" size="small" style={{ lineHeight: 1.6, margin: 0 }}>
                        {settings.aboutMe || '热爱前沿架构与交互设计，记录数字生活的点滴温度。'}
                      </Paragraph>

                      <div className="pt-4 border-t border-[var(--semi-color-border)] flex items-center justify-around font-mono text-center">
                        <div>
                          <div className="font-bold text-lg text-[var(--semi-color-text-0)]">
                            {publishedPosts.length}
                          </div>
                          <Text type="tertiary" size="small">博文篇数</Text>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-[var(--semi-color-text-0)]">
                            {totalViews.toLocaleString()}
                          </div>
                          <Text type="tertiary" size="small">总阅读量</Text>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-[var(--semi-color-text-0)]">
                            {approvedFriendsLinks.length}
                          </div>
                          <Text type="tertiary" size="small">伙伴互联</Text>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Categories Widget */}
                  <Card
                    title={<span className="font-semibold text-sm">分类专栏</span>}
                    bordered
                    style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                    bodyStyle={{ padding: '16px 20px' }}
                  >
                    <div className="divide-y divide-[var(--semi-color-border)]">
                      {Object.entries(categoryStats).map(([cat, count]) => (
                        <div
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            navigate(frontendRoutes.articles);
                          }}
                          className="py-3 flex items-center justify-between text-xs cursor-pointer hover:text-[var(--semi-color-primary)] transition-colors px-1"
                        >
                          <span className="font-medium">{cat}</span>
                          <Badge count={count} type="primary" />
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Tag Cloud */}
                  <Card
                    title={<span className="font-semibold text-sm">热门标签</span>}
                    bordered
                    style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                    bodyStyle={{ padding: '20px 24px' }}
                  >
                    <div className="flex flex-wrap gap-2.5">
                      {tagCloud.map(tag => (
                        <Tag
                          key={tag}
                          color="blue"
                          size="large"
                          style={{ cursor: 'pointer', padding: '4px 10px' }}
                          onClick={() => {
                            setSelectedTag(tag);
                            navigate(frontendRoutes.articles);
                          }}
                        >
                          #{tag}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                </div>
              </Col>
            </Row>
          </div>
        ) : currentTab === 'articles' ? (
          /* TAB: ARTICLES */
          <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <Title heading={3} style={{ margin: 0, fontSize: 22 }}>
                  精选博文库
                </Title>
                <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
                  按分类检索、按标签穿透，系统化查阅所有公开沉淀。
                </Text>
              </div>

              <Input
                prefix={<IconSearch />}
                placeholder="搜索标题、标签或关键字..."
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                showClear
                size="large"
                style={{ maxWidth: 320 }}
              />
            </div>

            {/* Filter toolbar */}
            <Card
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)', marginBottom: 36 }}
              bodyStyle={{ padding: '22px 26px' }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Text type="secondary" size="small" style={{ marginRight: 4 }}>分类筛选:</Text>
                  <Button
                    size="small"
                    theme={selectedCategory === '全部' ? 'solid' : 'light'}
                    type={selectedCategory === '全部' ? 'primary' : 'tertiary'}
                    onClick={() => setSelectedCategory('全部')}
                  >
                    全部 ({publishedPosts.length})
                  </Button>
                  {Object.entries(categoryStats).map(([cat, count]) => (
                    <Button
                      key={cat}
                      size="small"
                      theme={selectedCategory === cat ? 'solid' : 'light'}
                      type={selectedCategory === cat ? 'primary' : 'tertiary'}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat} ({count})
                    </Button>
                  ))}
                </div>

                {selectedTag !== '全部' && (
                  <div className="flex items-center gap-2.5 pt-3 border-t border-[var(--semi-color-border)]">
                    <Text type="secondary" size="small">当前限定标签:</Text>
                    <Tag color="blue" closable onClose={() => setSelectedTag('全部')} style={{ padding: '3px 8px' }}>
                      #{selectedTag}
                    </Tag>
                  </div>
                )}
              </div>
            </Card>

            {/* Posts Grid with Comfortable Gutters */}
            {filteredPosts.length === 0 ? (
              <Card bordered style={{ borderRadius: 'var(--semi-border-radius-medium)' }}>
                <div className="py-16">
                  <Empty
                    image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
                    title="未找到匹配的博文"
                    description="请尝试调整搜索条件或分类标签"
                  />
                </div>
              </Card>
            ) : (
              <Row gutter={[24, 24]} className={styles.articlesGridRow}>
                {filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((post) => (
                  <Col xs={24} md={12} key={post.id}>
                    <div
                      onClick={() => handleSelectPost(post)}
                      className="cursor-pointer h-full group"
                    >
                      <Card
                        bordered
                        className="transition-all duration-200 h-full group-hover:shadow-sm"
                        style={{
                          borderRadius: 'var(--semi-border-radius-medium)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                        bodyStyle={{ padding: '26px' }}
                      >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Tag color="cyan">{post.category}</Tag>
                          <span className="font-mono text-xs text-[var(--semi-color-text-2)]">
                            {post.publishTime.slice(0, 10)}
                          </span>
                        </div>

                        <Title heading={4} style={{ margin: 0 }} className="group-hover:text-[var(--semi-color-primary)] transition-colors">
                          {post.title}
                        </Title>

                        <Paragraph
                          type="secondary"
                          ellipsis={{ rows: 3 }}
                          style={{ fontSize: 13, lineHeight: 1.65, margin: 0 }}
                        >
                          {post.content}
                        </Paragraph>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[var(--semi-color-border)] flex items-center justify-between text-xs text-[var(--semi-color-text-2)]">
                        <Space>
                          {post.tags.map(t => (
                            <Tag key={t} size="small" color="white">
                              #{t}
                            </Tag>
                          ))}
                        </Space>
                        <div className="flex items-center gap-1 font-mono">
                          <IconEyeOpened size="small" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </Card>
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination */}
            {filteredPosts.length > pageSize && (
              <div className="flex justify-center pt-8 pb-4">
                <Pagination
                  total={filteredPosts.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        ) : currentTab === 'friends' ? (
          /* TAB: FRIENDS */
          <div className="space-y-8" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div>
                <Title heading={3} style={{ margin: 0, fontSize: 22 }}>
                  友情链接枢纽
                </Title>
                <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
                  结识海内存知己的博主伙伴，欢迎交换友链共同交流。
                </Text>
              </div>
              <Button
                theme="solid"
                type="primary"
                icon={<IconPlus />}
                size="large"
                onClick={() => setIsApplyModalOpen(true)}
              >
                申请交换友链
              </Button>
            </div>

            <Row gutter={[24, 24]} className={styles.friendsGridRow}>
              {approvedFriendsLinks.map((link) => (
                <Col xs={24} sm={12} lg={8} key={link.id}>
                  <Card
                    bordered
                    className="transition-all duration-200 h-full flex flex-col justify-between"
                    style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3.5">
                        <Avatar size="medium" src={link.avatar}>
                          {link.name.slice(0, 1)}
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm text-[var(--semi-color-text-0)] truncate">
                            {link.name}
                          </div>
                          <Tag color="cyan" size="small" style={{ marginTop: 2 }}>
                            {link.category}
                          </Tag>
                        </div>
                      </div>

                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ fontSize: 13, lineHeight: 1.6, minHeight: 40, margin: 0 }}
                      >
                        {link.description}
                      </Paragraph>

                      <div className="pt-3 border-t border-[var(--semi-color-border)] flex justify-end">
                        <a href={link.url} target="_blank" rel="noreferrer">
                          <Button
                            theme="light"
                            type="primary"
                            size="small"
                            icon={<IconGlobeStroke />}
                          >
                            直达站点 &rarr;
                          </Button>
                        </a>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Apply Friend Link Modal */}
            <Modal
              title="申请交换友情链接"
              visible={isApplyModalOpen}
              onCancel={() => setIsApplyModalOpen(false)}
              onOk={handleFriendLinkSubmit}
              okText="提交申请"
              cancelText="取消"
              width={520}
            >
              <div className="space-y-4 pt-2">
                <div>
                  <Text strong>你的博客名称 <span className="text-red-500">*</span></Text>
                  <Input
                    placeholder="例如: 拾光漫步"
                    value={linkName}
                    onChange={(val) => setLinkName(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text strong>博客站点链接 (URL) <span className="text-red-500">*</span></Text>
                  <Input
                    placeholder="https://yourblog.com"
                    value={linkUrl}
                    onChange={(val) => setLinkUrl(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text strong>站点 Logo / 头像外链</Text>
                  <Input
                    placeholder="https://.../avatar.jpg"
                    value={linkAvatar}
                    onChange={(val) => setLinkAvatar(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text strong>一句话站点介绍</Text>
                  <Input
                    placeholder="记录生活、分享代码与设计..."
                    value={linkDesc}
                    onChange={(val) => setLinkDesc(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>
            </Modal>
          </div>
        ) : (
          /* TAB: CHANGELOG */
          <div className="space-y-8">
            <Changelog />
          </div>
        )}
      </Content>

      {/* 3. Footer */}
      <Footer className="border-t border-[var(--semi-color-border)] py-10 px-4 sm:px-6 lg:px-8 bg-[var(--semi-color-bg-1)] text-xs text-[var(--semi-color-text-2)] mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2025 {settings.title} • 基于 Semi Design 统一重构</span>
          <div className="flex items-center gap-6">
            <span
              className="cursor-pointer hover:text-[var(--semi-color-text-0)] transition-colors"
              onClick={() => navigate(frontendRoutes.home)}
            >
              首页
            </span>
            <span
              className="cursor-pointer hover:text-[var(--semi-color-text-0)] transition-colors"
              onClick={() => navigate(frontendRoutes.articles)}
            >
              博文列表
            </span>
            <span
              className="cursor-pointer hover:text-[var(--semi-color-text-0)] transition-colors"
              onClick={() => navigate(frontendRoutes.friends)}
            >
              友情链接
            </span>
            <span
              className="cursor-pointer hover:text-[var(--semi-color-text-0)] transition-colors"
              onClick={() => navigate('/playground')}
            >
              组件预览
            </span>
            <span
              className="cursor-pointer hover:text-[var(--semi-color-text-0)] transition-colors"
              onClick={onEnterAdmin}
            >
              管理后台
            </span>
          </div>
        </div>
      </Footer>

      {/* Floating Back to Top Button */}
      <BackTop />
    </Layout>
  );
}
