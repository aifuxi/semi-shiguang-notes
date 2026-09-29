/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PostStatus = '已发布' | '草稿' | '已排期';

export interface Post {
  id: string;
  title: string;
  status: PostStatus;
  publishTime: string;
  views: number | null; // null represents '—' (drafts)
  category: string;
  tags: string[];
  content: string;
}

export type CommentStatus = '待审核' | '已通过' | '已拒绝';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string; // e.g. "10分钟前", "1小时前"
  timestamp: string; // ISO date for sorting
  content: string;
  status: CommentStatus;
  postTitle: string;
  email: string;
}

export interface UpcomingSchedule {
  id: string;
  title: string;
  publishTime: string; // e.g. "2025-05-22 10:00"
  month: string; // e.g. "5月"
  day: string; // e.g. "22"
  status: '已排期' | '草稿';
}

export interface TrafficTrendItem {
  date: string; // e.g. "05-14"
  visits: number;
}

export interface TrafficSourceItem {
  name: string;
  percentage: number;
  value: number;
  color: string;
}

export interface SiteHealth {
  storageUsed: number; // GB
  storageTotal: number; // GB
  backupScore: number;
  backupStatus: string;
  securityStatus: string;
  securityLabel: string;
  lastBackupTime: string;
  autoBackup: boolean;
}

export interface QuickAction {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  actionType: 'create_post' | 'upload_media' | 'manage_categories';
}

export interface VisitorLog {
  id: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  entryPage: string;
  duration: string;
  time: string;
}

export interface BlogSettings {
  title: string;
  subtitle: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  aboutMe: string;
  postsPerPage: number;
  enableComments: boolean;
  autoBackup: boolean;
  theme: 'light' | 'dark';
}

export interface FriendLink {
  id: string;
  name: string;
  url: string;
  avatar: string;
  description: string;
  category: string; // e.g. "技术博客", "创意设计", "生活感悟"
  status: '正常' | '异常' | '待审核';
  sortOrder: number;
}
