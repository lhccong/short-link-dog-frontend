import { Card, Divider, Modal, Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';

const ShortLinkReduction: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
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
          onSearch={showModal}
        />
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Card>
    </div>
  );
};
export default ShortLinkReduction;
