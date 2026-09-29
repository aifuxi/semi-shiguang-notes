/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Card,
  Tabs,
  TabPane,
  Input,
  TextArea,
  Switch,
  Button,
  Avatar,
  Toast,
  Typography,
  Space,
  Divider,
  Banner
} from '@douyinfe/semi-ui';
import {
  IconUser,
  IconSetting,
  IconCode,
  IconSave,
  IconShield,
  IconTick,
  IconKey
} from '@douyinfe/semi-icons';
import { BlogSettings } from '../types';
import styles from './SettingsPanel.module.scss';

const { Title, Text, Paragraph } = Typography;

interface SettingsPanelProps {
  settings: BlogSettings;
  setSettings: (settings: BlogSettings) => void;
}

export default function SettingsPanel({ settings, setSettings }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('profile');

  // Input states synchronized with props
  const [title, setTitle] = useState(settings.title);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [authorRole, setAuthorRole] = useState(settings.authorRole);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl);
  const [aboutMe, setAboutMe] = useState(settings.aboutMe);

  // System states
  const [postsPerPage, setPostsPerPage] = useState(settings.postsPerPage);
  const [enableComments, setEnableComments] = useState(settings.enableComments);
  const [autoBackup, setAutoBackup] = useState(settings.autoBackup);

  const handleSaveSettings = () => {
    setSettings({
      title,
      subtitle,
      authorName,
      authorRole,
      avatarUrl,
      aboutMe,
      postsPerPage: Number(postsPerPage) || 10,
      enableComments,
      autoBackup,
      theme: settings.theme
    });

    Toast.success('系统设置已成功保存并实时生效');
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeading}>
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            系统设置
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            定制博客基础信息、博主档案资料、系统自动化运维策略与开发配置。
          </Text>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconSave />}
          onClick={handleSaveSettings}
        >
          保存所有变更
        </Button>
      </div>

      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '20px' }}
      >
        <Tabs
          type="line"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
        >
          {/* TAB 1: Profile & Blog Info */}
          <TabPane
            tab={
              <span className={styles.sectionHeading}>
                <IconUser />
                个人资料与站点信息
              </span>
            }
            itemKey="profile"
          >
            <div className={styles.siteSettings}>
              {/* Avatar Preview */}
              <div className={styles.siteIdentity}>
                <Avatar
                  size="large"
                  src={avatarUrl}
                  style={{ backgroundColor: 'var(--semi-color-primary)' }}
                >
                  {authorName.slice(0, 1)}
                </Avatar>
                <div className={styles.siteIdentityText}>
                  <Text strong>博主头像预览</Text>
                  <Text type="secondary" size="small" style={{ display: 'block' }}>
                    在下方输入头像图片外链 URL 进行更新
                  </Text>
                </div>
              </div>

              <div className={styles.siteFields}>
                <div>
                  <Text strong>博客站点名称</Text>
                  <Input
                    value={title}
                    onChange={(val) => setTitle(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text strong>站点副标题 / Slogan</Text>
                  <Input
                    value={subtitle}
                    onChange={(val) => setSubtitle(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>

              <div className={styles.siteFields}>
                <div>
                  <Text strong>博主昵称 / 显示名</Text>
                  <Input
                    value={authorName}
                    onChange={(val) => setAuthorName(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
                <div>
                  <Text strong>身份头衔 / 标签</Text>
                  <Input
                    value={authorRole}
                    onChange={(val) => setAuthorRole(val)}
                    style={{ marginTop: 6 }}
                  />
                </div>
              </div>

              <div>
                <Text strong>头像图片链接 (URL)</Text>
                <Input
                  value={avatarUrl}
                  onChange={(val) => setAvatarUrl(val)}
                  style={{ marginTop: 6 }}
                />
              </div>

              <div>
                <Text strong>个人简介 (关于我)</Text>
                <TextArea
                  rows={4}
                  value={aboutMe}
                  onChange={(val) => setAboutMe(val)}
                  style={{ marginTop: 6 }}
                />
              </div>
            </div>
          </TabPane>

          {/* TAB 2: System Preference */}
          <TabPane
            tab={
              <span className={styles.sectionHeading}>
                <IconSetting />
                系统偏好与自动化
              </span>
            }
            itemKey="system"
          >
            <div className={styles.displaySettings}>
              <div className={styles.themeSetting}>
                <div>
                  <Text strong>允许读者发表评论</Text>
                  <Text type="secondary" size="small" style={{ display: 'block', marginTop: 2 }}>
                    开启后，读者可在前台博文底部留言，新评论进入待审核队列。
                  </Text>
                </div>
                <Switch
                  checked={enableComments}
                  onChange={(checked) => setEnableComments(checked)}
                />
              </div>

              <div className={styles.layoutSetting}>
                <div>
                  <Text strong>每日自动云端备份</Text>
                  <Text type="secondary" size="small" style={{ display: 'block', marginTop: 2 }}>
                    凌晨自动导出文章、评论及配置为加密归档，确保数据绝对安全。
                  </Text>
                </div>
                <Switch
                  checked={autoBackup}
                  onChange={(checked) => setAutoBackup(checked)}
                />
              </div>

              <div>
                <Text strong>每页文章展示数量</Text>
                <Input
                  type="number"
                  value={String(postsPerPage)}
                  onChange={(val) => setPostsPerPage(Number(val) || 10)}
                  style={{ maxWidth: 200, marginTop: 6 }}
                />
              </div>
            </div>
          </TabPane>

          {/* TAB 3: Developer / API */}
          <TabPane
            tab={
              <span className={styles.sectionHeading}>
                <IconCode />
                高阶开发与 API 凭证
              </span>
            }
            itemKey="developer"
          >
            <div className={styles.systemSettings}>
              <Banner
                type="info"
                description="安全提示：API 密钥由云端安全隔离环境统一注入，严禁在客户端直接暴露明文。"
              />

              <div>
                <Text strong>Gemini AI 大模型服务状态</Text>
                <div className={styles.sdkStatus}>
                  <div className={styles.statusHeading}>
                    <span className={styles.statusLabel}>SDK: @google/genai</span>
                    <span className={styles.statusValue}><IconTick /> 已就绪</span>
                  </div>
                  <div className={styles.statusDetails}>
                    <span>GEMINI_API_KEY</span>
                    <span>●●●●●●●●●●●●●●●●●●●● (系统注入保护)</span>
                  </div>
                </div>
              </div>

              <div>
                <Text strong>前端设计系统框架</Text>
                <div className={styles.designStatus}>
                  <div className={styles.statusHeading}>
                    <span className={styles.statusLabel}>Design System: Semi Design</span>
                    <span className={styles.statusValue}><IconTick /> @douyinfe/semi-ui</span>
                  </div>
                  <div className={styles.designStatusDetails}>
                    <span>字体家族体系</span>
                    <span className={styles.fontName}>Space Grotesk &amp; JetBrains Mono</span>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
