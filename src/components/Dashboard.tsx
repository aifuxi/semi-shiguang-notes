/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Tag,
  Badge,
  Progress,
  RadioGroup,
  Radio,
  Empty,
  Popconfirm,
  Toast,
  Tooltip,
  Typography,
  Space,
  Banner
} from '@douyinfe/semi-ui';
import {
  IconLineChartStroked,
  IconRingChartStroked,
  IconUserGroup,
  IconArticle,
  IconEdit,
  IconComment,
  IconMail,
  IconArrowUp,
  IconCalendar,
  IconTick,
  IconDelete,
  IconPlus,
  IconUpload,
  IconPriceTag,
  IconShield,
  IconActivity,
  IconClock,
  IconChevronRight
} from '@douyinfe/semi-icons';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import {
  Post,
  Comment,
  UpcomingSchedule,
  TrafficTrendItem,
  TrafficSourceItem,
  SiteHealth,
  BlogSettings
} from '../types';
import { AdminRouteKey } from '../routes';
import styles from './Dashboard.module.scss';

const { Title, Text } = Typography;

interface DashboardProps {
  posts: Post[];
  comments: Comment[];
  schedules: UpcomingSchedule[];
  trafficTrend: TrafficTrendItem[];
  trafficSources: TrafficSourceItem[];
  siteHealth: SiteHealth;
  settings: BlogSettings;
  onNavigateToTab: (tab: AdminRouteKey) => void;
  onApproveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onQuickActionClick: (type: 'create_post' | 'upload_media' | 'manage_categories') => void;
}

export default function Dashboard({
  posts,
  comments,
  schedules,
  trafficTrend,
  trafficSources,
  siteHealth,
  settings,
  onNavigateToTab,
  onApproveComment,
  onDeleteComment,
  onQuickActionClick
}: DashboardProps) {
  const [trendRange, setTrendRange] = useState('7d');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const totalVisits = 128942;
  const weeklyVisitors = 8432;
  const publishedCount = posts.filter(p => p.status === '已发布').length;
  const draftCount = posts.filter(p => p.status === '草稿').length + 12;
  const pendingCount = comments.filter(c => c.status === '待审核').length;
  const emailSubscribers = 2156;

  const pendingComments = comments.filter(c => c.status === '待审核').slice(0, 5);

  const statCards = [
    {
      title: '总访问量',
      value: totalVisits.toLocaleString(),
      change: '18.6%',
      isUp: true,
      subtext: '较上周',
      icon: <IconLineChartStroked size="large" style={{ color: 'var(--semi-color-primary)' }} />,
      tagColor: 'blue' as const
    },
    {
      title: '本周访客',
      value: weeklyVisitors.toLocaleString(),
      change: '12.3%',
      isUp: true,
      subtext: '较上周',
      icon: <IconUserGroup size="large" style={{ color: 'var(--semi-color-success)' }} />,
      tagColor: 'green' as const
    },
    {
      title: '已发布文章',
      value: publishedCount,
      change: '+5',
      isUp: true,
      subtext: '较上周',
      icon: <IconArticle size="large" style={{ color: 'var(--semi-color-secondary)' }} />,
      tagColor: 'purple' as const
    },
    {
      title: '草稿箱',
      value: draftCount,
      change: '持平',
      isUp: false,
      subtext: '较上周',
      icon: <IconEdit size="large" style={{ color: 'var(--semi-color-warning)' }} />,
      tagColor: 'orange' as const
    },
    {
      title: '待审核评论',
      value: pendingCount,
      change: '+3',
      isUp: true,
      subtext: '待处理',
      icon: <IconComment size="large" style={{ color: 'var(--semi-color-danger)' }} />,
      tagColor: 'red' as const,
      badge: pendingCount > 0
    },
    {
      title: '邮件订阅',
      value: emailSubscribers.toLocaleString(),
      change: '8.7%',
      isUp: true,
      subtext: '较上周',
      icon: <IconMail size="large" style={{ color: 'var(--semi-color-info)' }} />,
      tagColor: 'cyan' as const
    },
  ];

  // SVG dimensions for smooth Traffic Trend Line Chart
  const trendWidth = 600;
  const trendHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const maxVisits = 10000;

  const trendPoints = trafficTrend.map((item, index) => {
    const x = paddingX + (index * (trendWidth - paddingX * 2)) / (trafficTrend.length - 1);
    const y = trendHeight - paddingY - (item.visits / maxVisits) * (trendHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const linePath = trendPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${trendPoints[trendPoints.length - 1].x} ${trendHeight - paddingY} L ${trendPoints[0].x} ${trendHeight - paddingY} Z`;

  return (
    <div className={styles.dashboard}>
      {/* 1. Header Banner & Welcome */}
      <div className={styles.pageHeading}>
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            仪表盘概览
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            欢迎回来，{settings.authorName}！这是《{settings.title}》的实时运营概览。
          </Text>
        </div>

        <Space>
          <Tag color="blue" size="large" style={{ padding: '6px 12px' }}>
            <IconCalendar style={{ marginRight: 6 }} />
            2025-05-14 至 2025-05-20
          </Tag>
          <Button
            theme="light"
            type="primary"
            icon={<IconPlus />}
            onClick={() => onQuickActionClick('create_post')}
          >
            快速发文
          </Button>
        </Space>
      </div>

      {/* 2. Top Statistic Cards Grid */}
      <Row gutter={[16, 16]}>
        {statCards.map((card, idx) => (
          <Col xs={12} sm={8} lg={4} key={idx}>
            <Card
              bordered
              style={{
                borderRadius: 'var(--semi-border-radius-medium)',
                height: '100%',
                position: 'relative'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div className={styles.statHeading}>
                <Text type="secondary" size="small" strong>{card.title}</Text>
                <div className={styles.statIcon}>
                  {card.icon}
                </div>
              </div>

              <div className={styles.statValueWrap}>
                <span className={styles.statValue}>
                  {card.value}
                </span>
              </div>

              <div className={styles.statTrend}>
                {card.isUp ? (
                  <Tag color="green" size="small" style={{ padding: '0 4px', fontSize: 12 }}>
                    <IconArrowUp size="small" /> {card.change}
                  </Tag>
                ) : (
                  <Tag color="grey" size="small" style={{ padding: '0 4px', fontSize: 12 }}>
                    {card.change}
                  </Tag>
                )}
                <Text type="tertiary" size="small" style={{ fontSize: 12 }}>{card.subtext}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. Charts & Analytics Row */}
      <Row gutter={[16, 16]}>
        {/* Traffic Trend Chart */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className={styles.chartHeading}>
                <IconLineChartStroked style={{ color: 'var(--semi-color-primary)' }} />
                <span>流量走势分析 (PV / UV)</span>
              </div>
            }
            headerExtraContent={
              <RadioGroup
                type="button"
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
              >
                <Radio value="7d">近 7 天</Radio>
                <Radio value="30d">近 30 天</Radio>
              </RadioGroup>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '20px 16px' }}
          >
            <div className={styles.trendChart}>
              <svg viewBox={`0 0 ${trendWidth} ${trendHeight}`} className={styles.trendChartSvg}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--semi-color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--semi-color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal guidelines */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                  const y = trendHeight - paddingY - ratio * (trendHeight - paddingY * 2);
                  return (
                    <g key={i}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={trendWidth - paddingX}
                        y2={y}
                        stroke="var(--semi-color-border)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 6}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
                        fill="var(--semi-color-text-2)"
                      >
                        {Math.round(ratio * maxVisits)}
                      </text>
                    </g>
                  );
                })}

                {/* Area under curve */}
                <path d={areaPath} fill="url(#trendGradient)" />

                {/* Main line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--semi-color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points & X Labels */}
                {trendPoints.map((p, i) => (
                  <g key={i} className={styles.chartPoint}>
                    <line
                      x1={p.x}
                      y1={trendHeight - paddingY}
                      x2={p.x}
                      y2={trendHeight - paddingY + 5}
                      stroke="var(--semi-color-border)"
                    />
                    <text
                      x={p.x}
                      y={trendHeight - paddingY + 16}
                      textAnchor="middle"
                      fontSize="12"
                      fill="var(--semi-color-text-2)"
                    >
                      {p.date.slice(5)}
                    </text>

                    {/* Interactive hover circle */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={hoveredTrendIndex === i ? 6 : 4}
                      fill={hoveredTrendIndex === i ? 'var(--semi-color-primary)' : 'var(--semi-color-bg-1)'}
                      stroke="var(--semi-color-primary)"
                      strokeWidth="2.5"
                      onMouseEnter={() => setHoveredTrendIndex(i)}
                      onMouseLeave={() => setHoveredTrendIndex(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Hover tooltip indicator */}
              {hoveredTrendIndex !== null && (
                <div
                  className={styles.trendTooltip}
                  style={{
                    left: `${(trendPoints[hoveredTrendIndex].x / trendWidth) * 100}%`
                  }}
                >
                  <div className={styles.trendTooltipDate}>
                    {trendPoints[hoveredTrendIndex].date}
                  </div>
                  <div className={styles.trendTooltipVisits}>
                    访问量: {trendPoints[hoveredTrendIndex].visits.toLocaleString()} 次
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Traffic Sources Breakdown */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <div className={styles.sourcesHeading}>
                <IconRingChartStroked style={{ color: 'var(--semi-color-success)' }} />
                <span>访客来源占比</span>
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)', height: '100%' }}
            bodyStyle={{ padding: '20px 16px' }}
          >
            <div className={styles.sourceList}>
              {trafficSources.map((source, index) => (
                <div key={index} className={styles.sourceItem}>
                  <div className={styles.sourceLabelRow}>
                    <span className={styles.sourceName}>{source.name}</span>
                    <span className={styles.sourcePercentage}>{source.percentage}%</span>
                  </div>
                  <Progress
                    percent={source.percentage}
                    stroke={
                      index === 0
                        ? 'var(--semi-color-primary)'
                        : index === 1
                        ? 'var(--semi-color-success)'
                        : index === 2
                        ? 'var(--semi-color-warning)'
                        : 'var(--semi-color-info)'
                    }
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
            </div>

            <div className={styles.sourcesFooter}>
              <span>主要来源渠道: 搜索引擎自然搜索</span>
              <Button theme="borderless" type="primary" size="small" onClick={() => onNavigateToTab('analytics')}>
                详细分析 &rarr;
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 4. Schedules, Site Health & Comments Row */}
      <Row gutter={[16, 16]}>
        {/* Pending Comments to Review */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className={styles.commentsHeading}>
                <div className={styles.commentsHeadingLabel}>
                  <IconComment style={{ color: 'var(--semi-color-danger)' }} />
                  <span>待审核评论</span>
                  {pendingCount > 0 && <Badge count={pendingCount} type="danger" />}
                </div>
                <Button
                  theme="borderless"
                  type="primary"
                  size="small"
                  onClick={() => onNavigateToTab('comments')}
                >
                  查看全部
                </Button>
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '12px 16px' }}
          >
            {pendingComments.length === 0 ? (
              <div className={styles.commentsEmpty}>
                <Empty
                  image={<IllustrationNoContent style={{ width: 140, height: 140 }} />}
                  title="暂无待审核评论"
                  description="所有读者留言均已处理完毕"
                />
              </div>
            ) : (
              <div className={styles.commentsList}>
                {pendingComments.map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentBody}>
                      <div className={styles.commentAuthorRow}>
                        <span className={styles.commentAuthor}>{comment.author}</span>
                        <Text type="tertiary" size="small" style={{ fontSize: 12 }}>{comment.time}</Text>
                      </div>
                      <p className={styles.commentPreview}>
                        {comment.content}
                      </p>
                      <Text type="secondary" size="small" style={{ fontSize: 12 }}>
                        在文章《{comment.postTitle}》
                      </Text>
                    </div>

                    <Space>
                      <Button
                        theme="light"
                        type="primary"
                        size="small"
                        icon={<IconTick />}
                        onClick={() => {
                          onApproveComment(comment.id);
                          Toast.success('评论已通过审核');
                        }}
                      >
                        通过
                      </Button>
                      <Popconfirm
                        title="确定删除此评论？"
                        content="删除后无法恢复"
                        onConfirm={() => {
                          onDeleteComment(comment.id);
                          Toast.warning('评论已删除');
                        }}
                      >
                        <Button
                          theme="borderless"
                          type="danger"
                          size="small"
                          icon={<IconDelete />}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>

        {/* Upcoming Schedules & System Health */}
        <Col xs={24} lg={12}>
          <div className={styles.scheduleContent}>
            {/* Upcoming Schedules */}
            <Card
              title={
                <div className={styles.scheduleHeading}>
                  <div className={styles.scheduleHeadingLabel}>
                    <IconClock style={{ color: 'var(--semi-color-primary)' }} />
                    <span>定时发布计划</span>
                  </div>
                  <Button
                    theme="borderless"
                    type="primary"
                    size="small"
                  onClick={() => onNavigateToTab('posts')}
                  >
                    管理
                  </Button>
                </div>
              }
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '12px 16px' }}
            >
              {schedules.length === 0 ? (
                <Empty description="暂无排期的定时发布任务" />
              ) : (
                <div className={styles.scheduleList}>
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className={styles.scheduleItem}>
                      <div className={styles.scheduleDetails}>
                        <div className={styles.scheduleTitle}>
                          {schedule.title}
                        </div>
                        <div className={styles.scheduleMeta}>
                          <span>{schedule.publishTime}</span>
                          <span>•</span>
                          <span>{schedule.month}{schedule.day}日</span>
                        </div>
                      </div>
                      <Tag color="cyan" size="small">准备就绪</Tag>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Site Health & Server Performance */}
            <Card
              title={
                <div className={styles.healthHeading}>
                  <IconActivity style={{ color: 'var(--semi-color-success)' }} />
                  <span>站点运行健康度</span>
                </div>
              }
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '16px' }}
            >
              <Row gutter={[16, 12]}>
                <Col span={6}>
                  <div className={styles.healthMetric}>
                    <Text type="tertiary" size="small" style={{ fontSize: 12 }}>磁盘使用</Text>
                    <div className={styles.healthValueSuccess}>
                      {siteHealth.storageUsed} / {siteHealth.storageTotal} GB
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.healthMetric}>
                    <Text type="tertiary" size="small" style={{ fontSize: 12 }}>备份健康度</Text>
                    <div className={styles.healthValue}>
                      {siteHealth.backupScore}分
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.healthMetric}>
                    <Text type="tertiary" size="small" style={{ fontSize: 12 }}>备份状态</Text>
                    <div className={styles.healthValuePrimary}>
                      {siteHealth.backupStatus}
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div className={styles.healthMetric}>
                    <Text type="tertiary" size="small" style={{ fontSize: 12 }}>安全防御</Text>
                    <div className={styles.healthValueSuccessCompact}>
                      {siteHealth.securityLabel}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </Col>
      </Row>

      {/* 5. Quick Actions Bar */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className={styles.actionsHeading}>
          <div>
            <Text strong>快捷管理通道</Text>
            <Text type="secondary" size="small" style={{ marginLeft: 8 }}>
              常用功能快捷触达
            </Text>
          </div>
          <Space wrap>
            <Button
              theme="light"
              type="primary"
              icon={<IconPlus />}
              onClick={() => onQuickActionClick('create_post')}
            >
              撰写文章
            </Button>
            <Button
              theme="light"
              icon={<IconUpload />}
              onClick={() => onQuickActionClick('upload_media')}
            >
              上传媒体
            </Button>
            <Button
              theme="light"
              icon={<IconPriceTag />}
              onClick={() => onQuickActionClick('manage_categories')}
            >
              分类标签
            </Button>
            <Button
              theme="light"
              icon={<IconShield />}
              onClick={() => Toast.info('备份程序已在后台运行中')}
            >
              一键全站备份
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
