/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Tag,
  Badge,
  Typography,
  Space
} from '@douyinfe/semi-ui';
import {
  IconUserGroup,
  IconGlobeStroke,
  IconDesktop,
  IconClock,
  IconSearch,
  IconShield
} from '@douyinfe/semi-icons';
import { defaultVisitorLogs } from '../mockData';
import styles from './VisitorsLog.module.scss';

const { Title, Text } = Typography;

export default function VisitorsLog() {
  const [visitorLogs, setVisitorLogs] = useState(defaultVisitorLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveOnlineCount, setLiveOnlineCount] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOnlineCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next > 5 ? (next < 25 ? next : 20) : 8;
      });

      if (Math.random() > 0.75) {
        const ips = ['220.191.82.145', '120.231.14.99', '180.110.22.45', '61.135.169.121', '64.233.160.20'];
        const locations = ['中国 浙江省 杭州市', '中国 湖北省 武汉市', '中国 江苏省 苏州市', '中国 北京市 海淀区', '美国 谷歌数据中心'];
        const browsers = ['Chrome 122.0', 'Safari Mobile', 'Edge 120.0', 'Firefox 123.0', 'Googlebot'];
        const OSs = ['Windows 11', 'iOS 17.4', 'macOS 14.3', 'Android 14', 'Linux'];
        const entryPages = ['/', '/posts/mac-efficiency-tools-2025', '/posts/keep-writing-inspiration-tips', '/categories/efficiency-tools'];

        const randomIndex = Math.floor(Math.random() * ips.length);
        const now = new Date();
        const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const newLog = {
          id: `vlog-${Date.now()}`,
          ip: ips[randomIndex],
          location: locations[randomIndex],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: OSs[Math.floor(Math.random() * OSs.length)],
          entryPage: entryPages[Math.floor(Math.random() * entryPages.length)],
          duration: '00:01',
          time: timeString
        };

        setVisitorLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 15)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = visitorLogs.filter(
    (log) =>
      log.ip.includes(searchQuery) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entryPage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: '访问者 IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 150,
      render: (ip: string) => (
        <span className={styles.visitorId}>
          {ip}
        </span>
      )
    },
    {
      title: '地理位置',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => (
        <div className={styles.visitorDevice}>
          <IconGlobeStroke style={{ color: 'var(--semi-color-text-2)' }} />
          <span>{loc}</span>
        </div>
      )
    },
    {
      title: '受访入口',
      dataIndex: 'entryPage',
      key: 'entryPage',
      render: (page: string) => (
        <span className={styles.visitorIp}>
          {page}
        </span>
      )
    },
    {
      title: '终端与系统',
      dataIndex: 'os',
      key: 'os',
      width: 200,
      render: (os: string, record: any) => (
        <div className={styles.visitorPlatform}>
          <div>{record.browser}</div>
          <div className={styles.visitorOs}>{os}</div>
        </div>
      )
    },
    {
      title: '停留时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (dur: string) => (
        <Tag color="cyan" size="small">
          {dur}
        </Tag>
      )
    },
    {
      title: '访问时间',
      dataIndex: 'time',
      key: 'time',
      width: 100,
      render: (time: string) => (
        <span className={styles.visitorTime}>
          {time}
        </span>
      )
    }
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div>
        <Title heading={3} style={{ margin: 0 }}>
          实时访客日志
        </Title>
        <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
          观察读者的实时流式接入情况，监控地域分布与搜索引擎爬虫动态。
        </Text>
      </div>

      {/* Online metrics counters row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div className={styles.statContent}>
              <div className={styles.visitsIcon}>
                <IconUserGroup size="large" />
              </div>
              <div>
                <Text type="secondary" size="small">当前实时在线</Text>
                <div className={styles.statValueRow}>
                  <span className={styles.statValue}>
                    {liveOnlineCount}
                  </span>
                  <Tag color="green" size="small">实时活跃</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div className={styles.statContent}>
              <div className={styles.uniqueIcon}>
                <IconGlobeStroke size="large" />
              </div>
              <div>
                <Text type="secondary" size="small">今日独立 IP 覆盖</Text>
                <div className={styles.statValueRow}>
                  <span className={styles.statValue}>
                    1,428
                  </span>
                  <Text type="tertiary" size="small">涵盖 28 个城市</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered
            style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
            bodyStyle={{ padding: '16px' }}
          >
            <div className={styles.statContent}>
              <div className={styles.viewsIcon}>
                <IconShield size="large" />
              </div>
              <div>
                <Text type="secondary" size="small">合规搜索引擎蜘蛛</Text>
                <div className={styles.statValueRow}>
                  <span className={styles.statValue}>
                    312
                  </span>
                  <Text type="tertiary" size="small">Google / Baidu Bot</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Control Panel */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className={styles.pageHeading}>
          <div className={styles.liveStatus}>
            <span className={styles.liveIndicator} />
            <Text strong>实时访问流已连接 (WebSocket 模拟心跳)</Text>
          </div>
          <Input
            prefix={<IconSearch />}
            placeholder="搜索 IP、城市或受访页面..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            style={{ width: 280 }}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
