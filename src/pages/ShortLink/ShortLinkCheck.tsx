import { BACKEND_HOST_LOCAL } from '@/constants';
import { getUrlRelateVoByIdUsingGet } from '@/services/backend/shortLinkController';
import { history } from '@@/core/history';
import { LinkOutlined, MonitorOutlined, RocketOutlined } from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  Steps,
  Switch,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';

const ShortLinkCheck: React.FC = () => {
  const location = useLocation();
  const [shortLink, setShortLink] = useState<API.UrlRelate>();
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const getShortLinkDetail = async (shortLinkId: number) => {
    const res = await getUrlRelateVoByIdUsingGet({
      id: shortLinkId,
    });
    return res.data;
  };
  const [form] = Form.useForm();
  useEffect(() => {
    // 获取查询参数
    const searchParams = new URLSearchParams(location.search);
    // @ts-ignore
    const shortUrlId = parseInt(searchParams?.get('shortUrlId'));
    getShortLinkDetail(shortUrlId).then((data) => {
      // 根据数据设置初始值
      setShortLink(data);
      form.setFieldsValue(data);
    });
  }, [location.search]);
  const onPublish = () => {
    history.push('/shortLink/publish');
  };
  const { Option } = Select;
  const getFutureTime = (minutesToAdd: any) => {
    const currentTime = new Date();
    const futureTime = new Date(currentTime.getTime() + minutesToAdd * 60000); // 将分钟转换为毫秒
    return futureTime.toISOString(); // 返回 ISO 格式的时间字符串
  };
  const timeOption = [
    { value: null, label: '永久' },
    { value: getFutureTime(15), label: '15分钟' },
    { value: getFutureTime(60), label: '1小时' },
    { value: getFutureTime(360), label: '6小时' },
    { value: getFutureTime(1440), label: '1天' },
    { value: getFutureTime(10080), label: '1周' },
    { value: getFutureTime(43200), label: '1个月' },
  ];

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const switchChange = (value: any) => {
    setOpenPassword(value);
  };
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div>
      <Card>
        <Tooltip title="短链狗的热心提醒💗">
          <span>短链已经生成啦，快来看看✨</span>
        </Tooltip>
      </Card>
      <Divider />
      <Card>
        <Steps
          current={1}
          items={[
            {
              title: '生成',
              description: '开始生成短链',
              icon: <LinkOutlined />,
            },
            {
              title: '查看',
              description: '查看短链',
              icon: <MonitorOutlined />,
            },
            {
              title: '发布',
              description: '发布短链',
              icon: <RocketOutlined />,
            },
          ]}
        />

        <Divider type={'horizontal'} />
        <Form form={form} name="validate_other" {...formItemLayout} onFinish={onFinish}>
          <Form.Item label="短链图标">
            <Image.PreviewGroup>
              <Image width={200} src={shortLink?.urlImg} />
            </Image.PreviewGroup>
          </Form.Item>
          <Form.Item label="目标短链">
            <span className="ant-form-text">
              {BACKEND_HOST_LOCAL}/link_dog/{shortLink?.sortUrl}
            </span>
          </Form.Item>
          <Form.Item label="原本长链">
            <span className="ant-form-text">
              {decodeURIComponent(shortLink?.longUrl as string)}
            </span>
          </Form.Item>
          <Form.Item label="短链标题" name="title">
            <Input />
          </Form.Item>

          <Form.Item name="expireTime" label="过期时间" hasFeedback>
            <Select placeholder="过期时间" options={timeOption}></Select>
            {form.getFieldValue('switch')}
          </Form.Item>

          <Form.Item name="select-multiple" label="选择标签">
            <Select mode="tags" placeholder="支持自定义标签">
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>
          </Form.Item>
          <Form.Item name="switch" label="是否私密" valuePropName="checked">
            <Switch onChange={switchChange} />
          </Form.Item>
          {openPassword && (
            <Form.Item label="短链密码" name="password">
              <Input />
            </Form.Item>
          )}
          <Form.Item label="允许访问次数">
            <Form.Item name="input-number" noStyle>
              <InputNumber
                style={{ width: '250px' }}
                min={1}
                max={100}
                placeholder={'充值vip可获得更高的使用次数哦💗'}
              />
            </Form.Item>
            <span className="ant-form-text" style={{ marginLeft: 8 }}>
              次
            </span>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <div style={{ textAlign: 'right' }}>
              <Button htmlType="reset" style={{ marginRight: '20px' }}>
                存为草稿📑
              </Button>
              <Button type="primary" htmlType="submit" onClick={onPublish}>
                发布🍑
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default ShortLinkCheck;
