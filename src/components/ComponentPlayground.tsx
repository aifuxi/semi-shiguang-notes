/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  Avatar,
  Banner,
  Button,
  Card,
  Divider,
  Dropdown,
  Input,
  Layout,
  Modal,
  Nav,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  TextArea,
  Tooltip,
  Typography
} from '@douyinfe/semi-ui';
import { IconMoon, IconSetting, IconSun } from '@douyinfe/semi-icons';
import { BlogSettings } from '../types';
import styles from './ComponentPlayground.module.scss';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

interface ComponentPlaygroundProps {
  settings: BlogSettings;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onEnterAdmin: () => void;
}

const tableColumns = [
  { title: '组件', dataIndex: 'name', key: 'name' },
  { title: '覆盖范围', dataIndex: 'coverage', key: 'coverage' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <Tag color="green">{status}</Tag>
  }
];

const tableData = [
  { key: 'button', name: 'Button', coverage: '主题、焦点、按下、禁用', status: '已覆盖' },
  { key: 'form', name: 'Form controls', coverage: '默认、聚焦、错误、禁用', status: '已覆盖' },
  { key: 'overlay', name: 'Overlays', coverage: '主题圆角、Semi 原生阴影、焦点', status: '已覆盖' }
];

function PreviewSection({
  id,
  eyebrow,
  title,
  description,
  children
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeading}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <Title heading={3} className={styles.sectionTitle}>{title}</Title>
        <Text type="tertiary">{description}</Text>
      </div>
      {children}
    </section>
  );
}

export default function ComponentPlayground({
  settings,
  isDarkMode,
  setIsDarkMode,
  onEnterAdmin
}: ComponentPlaygroundProps) {
  const [selectedRadio, setSelectedRadio] = useState('default');
  const [switchEnabled, setSwitchEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('buttons');
  const [activeNavItem, setActiveNavItem] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Layout className={styles.page}>
      <Header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.brand} onClick={() => window.location.assign('/')}>
            <Avatar
              size="small"
              shape="square"
              style={{ backgroundColor: 'var(--semi-color-primary)', fontWeight: 700 }}
            >
              {settings.title.slice(0, 1)}
            </Avatar>
            <span>{settings.title}</span>
          </button>
          <div className={styles.headerActions}>
            <Text type="tertiary" className={styles.headerLabel}>Semi Design Playground</Text>
            <Tooltip content={isDarkMode ? '切换为浅色主题' : '切换为深色主题'}>
              <Button
                theme="borderless"
                type="tertiary"
                icon={isDarkMode ? <IconSun /> : <IconMoon />}
                aria-label={isDarkMode ? '切换为浅色主题' : '切换为深色主题'}
                onClick={() => setIsDarkMode(!isDarkMode)}
              />
            </Tooltip>
            <Button theme="light" type="primary" icon={<IconSetting />} onClick={onEnterAdmin}>
              管理后台
            </Button>
          </div>
        </div>
      </Header>

      <Content className={styles.content}>
        <div className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>DESIGN SYSTEM / COMPONENTS</span>
            <Title heading={1} className={styles.heroTitle}>组件主题预览</Title>
            <Text type="secondary" className={styles.heroDescription}>
              集中查看站点正在使用的 Semi 组件主题，尝试交互状态，并对照明暗模式下的视觉表现。
            </Text>
          </div>
          <div className={styles.heroMeta}>
            <Tag color="blue">增量 Sass 主题</Tag>
            <Text type="tertiary">颜色沿用 Semi Design token</Text>
          </div>
        </div>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label="组件预览目录">
            <Text type="tertiary" className={styles.sidebarLabel}>组件目录</Text>
            <Nav
              selectedKeys={[activeNavItem]}
              onSelect={({ itemKey }) => {
                const key = String(itemKey);
                setActiveNavItem(key);
                document.getElementById(key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Nav.Item itemKey="overview" text="快速概览" />
              <Nav.Item itemKey="buttons" text="按钮与表单" />
              <Nav.Item itemKey="navigation" text="导航与选择" />
              <Nav.Item itemKey="data" text="数据展示" />
              <Nav.Item itemKey="surfaces" text="卡片与浮层" />
            </Nav>
            <div className={styles.sidebarNote}>
              <Text strong>交互提示</Text>
              <Text type="tertiary">可点击控件查看悬停、焦点和展开状态。</Text>
            </div>
          </aside>

          <main className={styles.main}>
            <PreviewSection
              id="overview"
              eyebrow="01 / OVERVIEW"
              title="主题范围"
              description="当前增量主题整理并补齐项目已有控件的状态反馈，同时统一常用表面和浮层。"
            >
              <Card className={styles.panel} bordered>
                <div className={styles.overviewGrid}>
                  {[
                    ['交互控件', 'Button · Input · Select · Radio · Switch'],
                    ['导航与数据', 'Tabs · Nav · Pagination · Table'],
                    ['信息与反馈', 'Tag · Progress · Banner · Tooltip'],
                    ['表面与浮层', 'Card · Dropdown · Popover · Dialog']
                  ].map(([label, value]) => (
                    <div className={styles.overviewItem} key={label}>
                      <Text type="tertiary">{label}</Text>
                      <Text strong>{value}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </PreviewSection>

            <PreviewSection
              id="buttons"
              eyebrow="02 / CONTROLS"
              title="按钮与表单"
              description="对照常用按钮主题，以及输入、选择和开关控件的默认、错误与禁用状态。"
            >
              <Card className={styles.panel} title="Button" bordered>
                <div className={styles.controlRows}>
                  <div className={styles.controlRow}>
                    <Text className={styles.rowLabel}>Solid</Text>
                    <Space wrap>
                      <Button theme="solid" type="primary">Primary</Button>
                      <Button theme="solid" type="secondary">Secondary</Button>
                      <Button theme="solid" type="tertiary">Tertiary</Button>
                      <Button theme="solid" type="danger">Danger</Button>
                    </Space>
                  </div>
                  <Divider margin="0" />
                  <div className={styles.controlRow}>
                    <Text className={styles.rowLabel}>Light / Outline / Borderless</Text>
                    <Space wrap>
                      <Button theme="light" type="primary">Light</Button>
                      <Button theme="outline" type="primary">Outline</Button>
                      <Button theme="borderless" type="primary">Borderless</Button>
                      <Button theme="solid" type="primary" disabled>Disabled</Button>
                    </Space>
                  </div>
                </div>
              </Card>

              <Card className={styles.panel} title="Input · TextArea · Select" bordered>
                <div className={styles.formGrid}>
                  <label className={styles.field}>
                    <Text strong>默认输入</Text>
                    <Input defaultValue="一段简短的标题" placeholder="请输入标题" />
                  </label>
                  <label className={styles.field}>
                    <Text strong>错误状态</Text>
                    <Input validateStatus="error" defaultValue="invalid-value" />
                    <Text type="danger" size="small">请检查输入格式</Text>
                  </label>
                  <label className={styles.field}>
                    <Text strong>禁用输入</Text>
                    <Input disabled defaultValue="当前不可编辑" />
                  </label>
                  <label className={styles.field}>
                    <Text strong>Select</Text>
                    <Select defaultValue="design" style={{ width: '100%' }}>
                      <Select.Option value="design">设计灵感</Select.Option>
                      <Select.Option value="notes">读书笔记</Select.Option>
                      <Select.Option value="life">生活随感</Select.Option>
                    </Select>
                  </label>
                  <label className={`${styles.field} ${styles.fieldWide}`}>
                    <Text strong>TextArea</Text>
                    <TextArea rows={3} defaultValue="Semi 组件主题通过 Sass 增量覆盖，继续使用项目现有的颜色 token。" />
                  </label>
                </div>
              </Card>

              <Card className={styles.panel} title="Radio · Switch" bordered>
                <div className={styles.choiceGrid}>
                  <div className={styles.field}>
                    <Text strong>Radio 状态</Text>
                    <RadioGroup value={selectedRadio} onChange={event => setSelectedRadio(String(event.target.value))}>
                      <Radio value="default">默认</Radio>
                      <Radio value="selected">已选中</Radio>
                      <Radio value="disabled" disabled>禁用</Radio>
                    </RadioGroup>
                  </div>
                  <div className={styles.field}>
                    <Text strong>Switch 状态</Text>
                    <Space>
                      <Switch checked={switchEnabled} onChange={setSwitchEnabled} />
                      <Text>{switchEnabled ? '已开启' : '已关闭'}</Text>
                      <Switch disabled checked />
                      <Text type="tertiary">禁用</Text>
                    </Space>
                  </div>
                </div>
              </Card>
            </PreviewSection>

            <PreviewSection
              id="navigation"
              eyebrow="03 / NAVIGATION"
              title="导航与选择"
              description="Tabs、Nav 和 Pagination 使用真实交互，观察选中项、焦点和当前页反馈。"
            >
              <Card className={styles.panel} title="Tabs" bordered>
                <Tabs activeKey={activeTab} onChange={key => setActiveTab(String(key))}>
                  <Tabs.TabPane tab="按钮" itemKey="buttons">按钮状态可在上方区域查看。</Tabs.TabPane>
                  <Tabs.TabPane tab="表单" itemKey="forms">默认、错误及禁用状态保持一致的焦点和边界表现。</Tabs.TabPane>
                  <Tabs.TabPane tab="浮层" itemKey="overlays">浮层主题统一了内高光与阴影层次，Tooltip 保持轻量。</Tabs.TabPane>
                </Tabs>
              </Card>
              <Card className={styles.panel} title="Nav · Pagination" bordered>
                <div className={styles.navPagination}>
                  <Nav
                    mode="horizontal"
                    selectedKeys={[activeNavItem]}
                    onSelect={({ itemKey }) => setActiveNavItem(String(itemKey))}
                  >
                    <Nav.Item itemKey="overview" text="概览" />
                    <Nav.Item itemKey="controls" text="控件" />
                    <Nav.Item itemKey="feedback" text="反馈" />
                  </Nav>
                  <Pagination
                    total={60}
                    pageSize={10}
                    currentPage={currentPage}
                    onChange={setCurrentPage}
                    showTotal
                  />
                </div>
              </Card>
            </PreviewSection>

            <PreviewSection
              id="data"
              eyebrow="04 / DATA DISPLAY"
              title="数据展示"
              description="查看 Tag、Progress、Banner 和 Table 的边界、层级与内容密度。"
            >
              <Card className={styles.panel} title="Tag · Progress" bordered>
                <div className={styles.dataStack}>
                  <Space wrap>
                    <Tag color="blue">默认标签</Tag>
                    <Tag color="green">成功</Tag>
                    <Tag color="orange">待处理</Tag>
                    <Tag color="red">需要关注</Tag>
                    <Tag color="white">中性</Tag>
                  </Space>
                  <div className={styles.progressList}>
                    <div><Text>主题覆盖</Text><Progress percent={82} showInfo /></div>
                    <div><Text>构建状态</Text><Progress percent={100} stroke="var(--semi-color-success)" showInfo /></div>
                  </div>
                </div>
              </Card>
              <Card className={styles.panel} title="Banner" bordered>
                <div className={styles.bannerStack}>
                  <Banner type="info" title="主题预览" description="该页面使用与站点其他页面相同的 Semi Sass 主题。" />
                  <Banner type="success" description="组件状态已就绪，可使用顶部开关查看暗色主题。" />
                </div>
              </Card>
              <Card className={styles.panel} title="Table" bordered>
                <Table columns={tableColumns} dataSource={tableData} pagination={false} />
              </Card>
            </PreviewSection>

            <PreviewSection
              id="surfaces"
              eyebrow="05 / SURFACES"
              title="卡片与浮层"
              description="通过实际展开的交互查看 Dropdown、Popover、Tooltip、Popconfirm 和 Modal。"
            >
              <Card className={styles.surfaceCard} bordered>
                <div className={styles.surfaceHeader}>
                  <div>
                    <Text type="tertiary">CARD / BORDERED</Text>
                    <Title heading={5}>主题说明卡片</Title>
                  </div>
                  <Tag color="blue">Card</Tag>
                </div>
                <Text type="secondary">普通卡片沿用 Semi 边框；只有显式启用阴影模式时才显示 Semi 原生阴影。</Text>
              </Card>
              <Card className={styles.panel} title="Overlay 交互" bordered>
                <Space wrap>
                  <Dropdown
                    position="bottomLeft"
                    trigger="click"
                    render={(
                      <Dropdown.Menu>
                        <Dropdown.Item>编辑主题</Dropdown.Item>
                        <Dropdown.Item>查看组件文档</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>更多操作</Dropdown.Item>
                      </Dropdown.Menu>
                    )}
                  >
                    <Button>打开 Dropdown</Button>
                  </Dropdown>
                  <Popover content={<div className={styles.popoverContent}><Text strong>Popover 内容</Text><Text type="secondary">主题为浮层增加了细腻高光与柔和阴影。</Text></div>}>
                    <Button theme="light" type="primary">打开 Popover</Button>
                  </Popover>
                  <Tooltip content="统一的轻量提示层">
                    <Button theme="borderless" type="tertiary">悬停查看 Tooltip</Button>
                  </Tooltip>
                  <Popconfirm
                    title="确认此操作？"
                    content="这是一个用于预览确认浮层的示例。"
                    onConfirm={() => undefined}
                  >
                    <Button theme="outline" type="danger">打开 Popconfirm</Button>
                  </Popconfirm>
                  <Button theme="solid" type="primary" onClick={() => setModalVisible(true)}>打开 Modal</Button>
                </Space>
              </Card>
            </PreviewSection>

            <Divider />
            <div className={styles.pageEnd}>
              <Text type="tertiary">主题预览范围基于项目当前使用的 Semi 组件。</Text>
              <Button theme="borderless" type="tertiary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>返回顶部</Button>
            </div>
          </main>
        </div>
      </Content>

      <Footer className={styles.footer}>
        <span>© 2025 {settings.title} · Semi Design 组件主题预览</span>
        <button onClick={() => window.location.assign('/')}>返回前台首页</button>
      </Footer>

      <Modal
        title="Modal 主题预览"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
      >
        <Text>Modal 使用主题浮层阴影与无分割线布局，全屏模式保持原有样式。</Text>
      </Modal>
    </Layout>
  );
}
