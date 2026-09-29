/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Progress,
  RadioGroup,
  Radio,
  Table,
  Tag,
  Typography,
  Space
} from '@douyinfe/semi-ui';
import {
  IconEyeOpened,
  IconUserGroup,
  IconClock,
  IconArrowUp,
  IconArrowDown,
  IconLineChartStroked,
  IconDesktop,
  IconPhone,
  IconPieChartStroked
} from '@douyinfe/semi-icons';
import styles from './DataAnalysis.module.scss';

const { Title, Text } = Typography;

export default function DataAnalysis() {
  const [activeRange, setActiveRange] = useState('30d');

  const keyMetrics = [
    {
      title: '总浏览量 (PV)',
      value: '238,401',
      change: '+14.2%',
      isUp: true,
      icon: <IconEyeOpened style={{ color: 'var(--semi-color-primary)' }} />,
      tagColor: 'blue' as const
    },
    {
      title: '独立访客 (UV)',
      value: '19,542',
      change: '+18.6%',
      isUp: true,
      icon: <IconUserGroup style={{ color: 'var(--semi-color-success)' }} />,
      tagColor: 'green' as const
    },
    {
      title: '平均阅读时长',
      value: '4分32秒',
      change: '+6.1%',
      isUp: true,
      icon: <IconClock style={{ color: 'var(--semi-color-secondary)' }} />,
      tagColor: 'purple' as const
    },
    {
      title: '整站跳出率',
      value: '42.15%',
      change: '-2.4%',
      isUp: false,
      icon: <IconPieChartStroked style={{ color: 'var(--semi-color-warning)' }} />,
      tagColor: 'orange' as const
    },
  ];

  const trendData = [
    { date: '05-14', pv: 4000, uv: 1800 },
    { date: '05-15', pv: 4200, uv: 2100 },
    { date: '05-16', pv: 6000, uv: 3200 },
    { date: '05-17', pv: 7500, uv: 4100 },
    { date: '05-18', pv: 5800, uv: 2900 },
    { date: '05-19', pv: 6400, uv: 3300 },
    { date: '05-20', pv: 8200, uv: 4400 },
  ];

  const deviceDistribution = [
    { name: '桌面电脑', percentage: 58.4, icon: <IconDesktop />, color: 'var(--semi-color-primary)' },
    { name: '移动手机', percentage: 36.1, icon: <IconPhone />, color: 'var(--semi-color-success)' },
    { name: '平板设备', percentage: 5.5, icon: <IconDesktop />, color: 'var(--semi-color-warning)' },
  ];

  const popularArticles = [
    { rank: 1, title: 'Mac 效率工具清单（2025 版）', pv: 8571, uv: 6241, rate: '72.8%' },
    { rank: 2, title: '如何保持写作灵感：10 个实用方法', pv: 6108, uv: 4180, rate: '68.4%' },
    { rank: 3, title: '在路上小确幸的生活', pv: 5842, uv: 3950, rate: '67.6%' },
    { rank: 4, title: '独立创作者的个人 IP 突围指南', pv: 3254, uv: 2110, rate: '64.8%' },
    { rank: 5, title: '摄影入门：光线的魔法', pv: 2156, uv: 1542, rate: '71.5%' },
  ];

  const chartWidth = 560;
  const chartHeight = 220;
  const padX = 40;
  const padY = 30;
  const maxVal = 10000;

  const getPoints = (key: 'pv' | 'uv') => {
    return trendData.map((d, i) => {
      const x = padX + (i * (chartWidth - padX * 2)) / (trendData.length - 1);
      const y = chartHeight - padY - (d[key] / maxVal) * (chartHeight - padY * 2);
      return { x, y, val: d[key], date: d.date };
    });
  };

  const pvPoints = getPoints('pv');
  const uvPoints = getPoints('uv');

  const pvPath = pvPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const uvPath = uvPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const rankColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
      render: (rank: number) => (
        <span
          className={`${styles.rankBadge} ${rank === 1 ? styles.rankGold : rank === 2 ? styles.rankSilver : rank === 3 ? styles.rankBronze : styles.rankOther}`}
        >
          {rank}
        </span>
      )
    },
    {
      title: '热门文章标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>
    },
    {
      title: 'PV',
      dataIndex: 'pv',
      key: 'pv',
      width: 100,
      render: (val: number) => <span className={styles.tableMetric}>{val.toLocaleString()}</span>
    },
    {
      title: 'UV',
      dataIndex: 'uv',
      key: 'uv',
      width: 100,
      render: (val: number) => <span className={styles.tableMetric}>{val.toLocaleString()}</span>
    },
    {
      title: '完读率',
      dataIndex: 'rate',
      key: 'rate',
      width: 90,
      render: (rate: string) => <Tag color="green">{rate}</Tag>
    }
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeading}>
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            数据深度洞察
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            洞察受众画像、内容传播力与读者留存表现。
          </Text>
        </div>

        <RadioGroup
          type="button"
          value={activeRange}
          onChange={(e) => setActiveRange(e.target.value)}
        >
          <Radio value="7d">近 7 天</Radio>
          <Radio value="30d">近 30 天</Radio>
          <Radio value="90d">本季度</Radio>
        </RadioGroup>
      </div>

      {/* 4 Metric Cards */}
      <Row gutter={[16, 16]}>
        {keyMetrics.map((item, idx) => (
          <Col xs={12} lg={6} key={idx}>
            <Card
              bordered
              style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
              bodyStyle={{ padding: '16px' }}
            >
              <div className={styles.statHeading}>
                <Text type="secondary" size="small">{item.title}</Text>
                <div className={styles.statIcon}>
                  {item.icon}
                </div>
              </div>
              <div className={styles.statValueWrap}>
                <span className={styles.statValue}>
                  {item.value}
                </span>
              </div>
              <div className={styles.statTrend}>
                <Tag color={item.isUp ? 'green' : 'amber'} size="small">
                  {item.isUp ? <IconArrowUp size="small" /> : <IconArrowDown size="small" />} {item.change}
                </Tag>
                <Text type="tertiary" size="small" style={{ fontSize: 11 }}>环比前一周期</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Dual Trends & Devices */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className={styles.chartHeading}>
                <IconLineChartStroked style={{ color: 'var(--semi-color-primary)' }} />
                <span>PV / UV 双指标对比走势</span>
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '20px 16px' }}
          >
            <div className={styles.chartLegend}>
              <div className={styles.pageViewsLegend}>
                <span className={styles.pageViewsSwatch} />
                <span>浏览量 (PV)</span>
              </div>
              <div className={styles.uniqueVisitorsLegend}>
                <span className={styles.uniqueVisitorsSwatch} />
                <span>访客数 (UV)</span>
              </div>
            </div>

            <div className={styles.chartViewport}>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.chartSvg}>
                {/* Y guidelines */}
                {[0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
                  const y = chartHeight - padY - ratio * (chartHeight - padY * 2);
                  return (
                    <g key={i}>
                      <line
                        x1={padX}
                        y1={y}
                        x2={chartWidth - padX}
                        y2={y}
                        stroke="var(--semi-color-border)"
                        strokeDasharray="4 4"
                      />
                      <text x={padX - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--semi-color-text-2)">
                        {Math.round(ratio * maxVal)}
                      </text>
                    </g>
                  );
                })}

                {/* PV Line */}
                <path d={pvPath} fill="none" stroke="var(--semi-color-primary)" strokeWidth="2.5" />
                {/* UV Line */}
                <path d={uvPath} fill="none" stroke="var(--semi-color-success)" strokeWidth="2.5" />

                {/* Nodes & X labels */}
                {pvPoints.map((p, i) => (
                  <g key={i}>
                    <line x1={p.x} y1={chartHeight - padY} x2={p.x} y2={chartHeight - padY + 5} stroke="var(--semi-color-border)" />
                    <text x={p.x} y={chartHeight - padY + 16} textAnchor="middle" fontSize="10" fill="var(--semi-color-text-2)">
                      {p.date}
                    </text>
                    <circle cx={p.x} cy={p.y} r={3.5} fill="var(--semi-color-primary)" />
                    <circle cx={uvPoints[i].x} cy={uvPoints[i].y} r={3.5} fill="var(--semi-color-success)" />
                  </g>
                ))}
              </svg>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <div className={styles.sourcesHeading}>
                <IconDesktop style={{ color: 'var(--semi-color-primary)' }} />
                <span>终端设备分布</span>
              </div>
            }
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)', height: '100%' }}
            bodyStyle={{ padding: '20px 16px' }}
          >
            <div className={styles.sourceList}>
              {deviceDistribution.map((item, idx) => (
                <div key={idx} className={styles.sourceItem}>
                  <div className={styles.sourceLabelRow}>
                    <div className={styles.sourceName}>
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <span className={styles.sourcePercentage}>{item.percentage}%</span>
                  </div>
                  <Progress
                    percent={item.percentage}
                    stroke={item.color}
                    showInfo={false}
                    size="small"
                  />
                </div>
              ))}
            </div>

            <div className={styles.sourcesNote}>
              💡 提示：超过 36% 的读者通过移动设备访问，建议保持移动端排版简洁清晰。
            </div>
          </Card>
        </Col>
      </Row>

      {/* Popular Posts Ranking Table */}
      <Card
        title="热门文章留存与传播排行榜"
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={rankColumns}
          dataSource={popularArticles}
          rowKey="rank"
          pagination={false}
        />
      </Card>
    </div>
  );
}
