export const adminRoutes = {
  dashboard: '/admin',
  posts: '/admin/posts',
  comments: '/admin/comments',
  media: '/admin/media',
  categories: '/admin/categories',
  analytics: '/admin/analytics',
  visitors: '/admin/visitors',
  'friends-links': '/admin/friends-links',
  changelog: '/admin/changelog',
  settings: '/admin/settings'
} as const;

export type AdminRouteKey = keyof typeof adminRoutes;

export const frontendRoutes = {
  home: '/',
  articles: '/articles',
  friends: '/friends',
  changelog: '/changelog'
} as const;

export type FrontendRouteKey = keyof typeof frontendRoutes;
