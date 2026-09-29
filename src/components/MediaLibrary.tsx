/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Tag,
  Modal,
  Image,
  Popconfirm,
  Toast,
  Typography,
  Space,
  RadioGroup,
  Radio,
  Empty
} from '@douyinfe/semi-ui';
import {
  IconUpload,
  IconSearch,
  IconCopy,
  IconDelete,
  IconEyeOpened,
  IconImage
} from '@douyinfe/semi-icons';
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import styles from './MediaLibrary.module.scss';

const { Title, Text } = Typography;

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  dimension: string;
  time: string;
  type: string;
}

export default function MediaLibrary() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 'media-1',
      name: '在路上的风景.jpg',
      url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
      size: '1.2 MB',
      dimension: '1920x1080',
      time: '2025-05-19 20:12',
      type: 'image/jpeg'
    },
    {
      id: 'media-2',
      name: '极简咖啡杯.jpg',
      url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
      size: '840 KB',
      dimension: '1200x1200',
      time: '2025-05-18 15:30',
      type: 'image/jpeg'
    },
    {
      id: 'media-3',
      name: '摄影镜头微距.jpg',
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      size: '2.1 MB',
      dimension: '2400x1600',
      time: '2025-05-16 11:24',
      type: 'image/jpeg'
    },
    {
      id: 'media-4',
      name: '复古黑胶唱片.jpg',
      url: 'https://images.unsplash.com/photo-1489410141556-372c0b85040f?auto=format&fit=crop&w=600&q=80',
      size: '1.5 MB',
      dimension: '1800x1200',
      time: '2025-05-15 09:40',
      type: 'image/jpeg'
    },
    {
      id: 'media-5',
      name: '博主精选写字台.jpg',
      url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
      size: '1.8 MB',
      dimension: '2000x1333',
      time: '2025-05-14 14:15',
      type: 'image/jpeg'
    },
    {
      id: 'media-6',
      name: '绿色苔藓森林.jpg',
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
      size: '2.4 MB',
      dimension: '2560x1440',
      time: '2025-05-12 18:22',
      type: 'image/jpeg'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMedia: MediaItem = {
      id: `media-${Date.now()}`,
      name: file.name,
      url: objectUrl,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      dimension: '原始分辨率',
      time: formattedTime,
      type: file.type || 'image/jpeg'
    };

    setMediaItems(prevMediaItems => [newMedia, ...prevMediaItems]);
    Toast.success(`图片 “${file.name}” 已成功上传到媒体库`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    Toast.success('图片链接已复制到剪贴板！可在 Markdown 中直接引用');
  };

  const deleteMedia = (id: string) => {
    setMediaItems(prevMediaItems => prevMediaItems.filter(m => m.id !== id));
    Toast.success('媒体文件已移除');
  };

  const filteredMedia = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title heading={3} style={{ margin: 0 }}>
            媒体资产库
          </Title>
          <Text type="secondary" size="small" style={{ marginTop: 4, display: 'block' }}>
            统一管理博文配图、图表与封面素材，支持一键复制 Markdown 外链。
          </Text>
        </div>
        <Button
          theme="solid"
          type="primary"
          icon={<IconUpload />}
          onClick={() => fileInputRef.current?.click()}
        >
          上传本地图片
        </Button>
      </div>

      {/* Search Bar */}
      <Card
        bordered
        style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div className="flex items-center justify-between gap-4">
          <Input
            prefix={<IconSearch />}
            placeholder="搜索图片文件名..."
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            showClear
            style={{ maxWidth: 320 }}
          />
          <Text type="secondary" size="small">
            共计 <strong className="font-mono text-[var(--semi-color-primary)]">{filteredMedia.length}</strong> 份素材
          </Text>
        </div>
      </Card>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Card bordered style={{ borderRadius: 'var(--semi-border-radius-medium)' }}>
          <div className="py-12">
            <Empty
              image={<IllustrationNoContent style={{ width: 140, height: 140 }} />}
              title="未找到对应媒体素材"
              description="点击右上角按钮上传新图片"
            />
          </div>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredMedia.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                bordered
                cover={
                  <div className="relative group overflow-hidden bg-[var(--semi-color-fill-0)] h-44 flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        theme="solid"
                        type="tertiary"
                        icon={<IconEyeOpened />}
                        onClick={() => setSelectedMedia(item)}
                      >
                        预览
                      </Button>
                      <Button
                        theme="solid"
                        type="primary"
                        icon={<IconCopy />}
                        onClick={() => copyUrl(item.url)}
                      >
                        复制
                      </Button>
                    </div>
                  </div>
                }
                style={{ borderRadius: 'var(--semi-border-radius-medium)' }}
                bodyStyle={{ padding: '12px' }}
              >
                <div className="space-y-1">
                  <div className="font-medium text-xs text-[var(--semi-color-text-0)] truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--semi-color-text-2)] font-mono">
                    <span>{item.dimension}</span>
                    <span>{item.size}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-[var(--semi-color-border)]">
                    <Text type="tertiary" size="small" style={{ fontSize: 10 }}>{item.time.slice(5)}</Text>
                    <Popconfirm
                      title="确认移除此素材？"
                      onConfirm={() => deleteMedia(item.id)}
                    >
                      <Button
                        theme="borderless"
                        type="danger"
                        size="small"
                        icon={<IconDelete />}
                      />
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Preview Modal */}
      <Modal
        title={selectedMedia?.name || '图片预览'}
        visible={Boolean(selectedMedia)}
        onCancel={() => setSelectedMedia(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              theme="solid"
              type="primary"
              icon={<IconCopy />}
              onClick={() => {
                if (selectedMedia) copyUrl(selectedMedia.url);
              }}
            >
              复制外链链接
            </Button>
            <Button onClick={() => setSelectedMedia(null)}>关闭</Button>
          </div>
        }
        width={680}
      >
        {selectedMedia && (
          <div className="space-y-4 pt-2">
            <div className="max-h-96 overflow-hidden rounded-lg bg-[var(--semi-color-fill-0)] flex items-center justify-center">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.name}
                className="max-h-96 object-contain"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-lg bg-[var(--semi-color-fill-0)]">
              <div>
                <Text type="tertiary" size="small">文件体积</Text>
                <div className="font-mono font-medium">{selectedMedia.size}</div>
              </div>
              <div>
                <Text type="tertiary" size="small">图片分辨率</Text>
                <div className="font-mono font-medium">{selectedMedia.dimension}</div>
              </div>
              <div>
                <Text type="tertiary" size="small">上传时间</Text>
                <div className="font-mono font-medium">{selectedMedia.time}</div>
              </div>
              <div>
                <Text type="tertiary" size="small">媒体格式</Text>
                <div className="font-mono font-medium">{selectedMedia.type}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
