import { getUrlRelateVoByShortLinkUsingGet } from '@/services/backend/shortLinkController';
import { Avatar, Badge, Card, Divider, Modal, Tag, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';

const ShortLinkReduction: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlRelateVo, setUrlRelateVo] = useState<API.UrlRelateVo>();

  //查找长链
  const findLongLink = async (value: string) => {
    const data = await getUrlRelateVoByShortLinkUsingGet({ shortLink: value });
    setUrlRelateVo(data.data);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Card>
        <Tooltip title="短链狗的热心提醒💗">
          <span>快来使用🐕来还原短链吧</span>
        </Tooltip>
      </Card>
      <Divider />
      <Card>
        短链还原✨✨✨
        <Divider type={'horizontal'} />
        <Search
          placeholder="输入要还原的短链，禁止违规违法内容，有权禁止账号或网址还原短链接"
          allowClear
          enterButton="还原"
          size="large"
          onSearch={findLongLink}
        />
        <Modal
          title="短链接还原🌈"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <Badge.Ribbon text={urlRelateVo?.tags?.[0].name}>
            <Card title={urlRelateVo?.title} size="small">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  src={urlRelateVo?.urlImg}
                  style={{ marginRight: '16px' }}
                />
                <div>
                  <div>长链：{decodeURIComponent(urlRelateVo?.longUrl as string)}</div>
                  <div>短链：{urlRelateVo?.sortUrl}</div>
                  <div>
                    {urlRelateVo?.tags?.map((tag) => (
                      <Tag key={tag.id} color={tag.color} style={{ marginBottom: 10 }}>
                        {tag.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Badge.Ribbon>
        </Modal>
      </Card>
    </div>
  );
};
export default ShortLinkReduction;
