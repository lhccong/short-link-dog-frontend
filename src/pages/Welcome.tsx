import { Line } from '@ant-design/charts';
import { AliwangwangFilled, ThunderboltFilled } from '@ant-design/icons';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { Card, Col, Divider, Row, Statistic } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];
const config = {
  data,
  height: 400,
  xField: 'year',
  yField: 'value',
  point: {
    size: 5,
    shape: 'diamond',
  },
};
export default () => {
  const [responsive, setResponsive] = useState(false);

  // @ts-ignore
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="用户数"
              value={60000}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<AliwangwangFilled />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="已生成短链数"
              value={90000}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ThunderboltFilled />}
            />
          </Card>
        </Col>
      </Row>
      <Divider type={'horizontal'} />
      <ProCard
        title="数据概览"
        extra="2019年9月28日 星期五"
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <StatisticCard title="流量走势" chart={<Line {...config} />} />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
};
