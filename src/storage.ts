import type {
  BlogSettings,
  Comment,
  FriendLink,
  Post,
  SiteHealth,
  TrafficSourceItem,
  TrafficTrendItem,
  UpcomingSchedule
} from './types';

type Guard<T> = (value: unknown) => value is T;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);

const isPost = (value: unknown): value is Post =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  (value.status === '已发布' || value.status === '草稿' || value.status === '已排期') &&
  isString(value.publishTime) &&
  (value.views === null || isNumber(value.views)) &&
  isString(value.category) &&
  isStringArray(value.tags) &&
  isString(value.content);

const isComment = (value: unknown): value is Comment =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.author) &&
  isString(value.avatar) &&
  isString(value.time) &&
  isString(value.timestamp) &&
  isString(value.content) &&
  (value.status === '待审核' || value.status === '已通过' || value.status === '已拒绝') &&
  isString(value.postTitle) &&
  isString(value.email);

const isUpcomingSchedule = (value: unknown): value is UpcomingSchedule =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.publishTime) &&
  isString(value.month) &&
  isString(value.day) &&
  (value.status === '已排期' || value.status === '草稿');

const isTrafficTrendItem = (value: unknown): value is TrafficTrendItem =>
  isRecord(value) && isString(value.date) && isNumber(value.visits);

const isTrafficSourceItem = (value: unknown): value is TrafficSourceItem =>
  isRecord(value) &&
  isString(value.name) &&
  isNumber(value.percentage) &&
  isNumber(value.value) &&
  isString(value.color);

const isSiteHealth = (value: unknown): value is SiteHealth =>
  isRecord(value) &&
  isNumber(value.storageUsed) &&
  isNumber(value.storageTotal) &&
  isNumber(value.backupScore) &&
  isString(value.backupStatus) &&
  isString(value.securityStatus) &&
  isString(value.securityLabel) &&
  isString(value.lastBackupTime) &&
  typeof value.autoBackup === 'boolean';

const isBlogSettings = (value: unknown): value is BlogSettings =>
  isRecord(value) &&
  isString(value.title) &&
  isString(value.subtitle) &&
  isString(value.authorName) &&
  isString(value.authorRole) &&
  isString(value.avatarUrl) &&
  isString(value.aboutMe) &&
  isNumber(value.postsPerPage) &&
  typeof value.enableComments === 'boolean' &&
  typeof value.autoBackup === 'boolean' &&
  (value.theme === 'light' || value.theme === 'dark');

const isFriendLink = (value: unknown): value is FriendLink =>
  isRecord(value) &&
  isString(value.id) &&
  isString(value.name) &&
  isString(value.url) &&
  isString(value.avatar) &&
  isString(value.description) &&
  isString(value.category) &&
  (value.status === '正常' || value.status === '异常' || value.status === '待审核') &&
  isNumber(value.sortOrder);

const isBooleanOrNull = (value: unknown): value is boolean | null =>
  value === null || typeof value === 'boolean';

/** 安全读取并校验本地 JSON；损坏或结构不符时返回默认值。 */
export function readStoredValue<T>(key: string, fallback: T, isValid: Guard<T>): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const value: unknown = JSON.parse(raw);
    return isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/** 本地存储不可用或配额不足时，不影响当前页面状态更新。 */
export function writeStoredValue(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 当前状态仍保留在内存中；浏览器存储失败时不让界面崩溃。
  }
}

export const storedValueGuards = {
  posts: (value: unknown): value is Post[] => Array.isArray(value) && value.every(isPost),
  comments: (value: unknown): value is Comment[] => Array.isArray(value) && value.every(isComment),
  schedules: (value: unknown): value is UpcomingSchedule[] => Array.isArray(value) && value.every(isUpcomingSchedule),
  trafficTrend: (value: unknown): value is TrafficTrendItem[] => Array.isArray(value) && value.every(isTrafficTrendItem),
  trafficSources: (value: unknown): value is TrafficSourceItem[] => Array.isArray(value) && value.every(isTrafficSourceItem),
  siteHealth: isSiteHealth,
  settings: isBlogSettings,
  friendsLinks: (value: unknown): value is FriendLink[] => Array.isArray(value) && value.every(isFriendLink),
  darkMode: isBooleanOrNull
};
