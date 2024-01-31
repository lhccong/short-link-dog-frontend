import { BACKEND_HOST_LOCAL_REDIRECT } from '@/constants';
import {
  getUrlRelateVoByIdUsingGet,
  updateUrlRelateUsingPost,
} from '@/services/backend/shortLinkController';
import { addTagUsingPost, getAllTagsUsingGet } from '@/services/backend/urlTagController';
import { StringUtils } from '@/utils/stringUtil';
import { history } from '@@/core/history';
import {
  CheckOutlined,
  EditOutlined,
  LinkOutlined,
  MonitorOutlined,
  PlusOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import {
  Button,
  Card,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Steps,
  Switch,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useEffect, useRef, useState } from 'react';

const ShortLinkCheck: React.FC = () => {
  const location = useLocation();
  const [currentUrlTag, setCurrentUrlTag] = useState<API.UrlTagVo[]>();
  const [visible, setVisible] = useState(false);
  const [shortLink, setShortLink] = useState<API.UrlRelate>();
  const [shortLinkId, setShortLinkId] = useState<number>();
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState('0');
  const [allCategory, setAllCategory] = useState<API.UrlTagCategoryVo[] | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [editingTab, setEditingTab] = useState(0);
  const [tagInputValue, setTagInputValue] = useState('');
  const inputRef = useRef(null);
  const [form] = Form.useForm();

  // 标签移除
  const handleTagClose = (tag: API.UrlTagVo) => {
    setSelectedIds(selectedIds?.filter((tagId) => tagId !== tag.id));
    setCurrentUrlTag(currentUrlTag?.filter((selectedTag) => selectedTag.id !== tag.id));
  };

  //标签新增
  const handleTagInputConfirm = async (index: number) => {
    //当输入标签的长度不符合规范
    if (tagInputValue.length > 8) {
      message.error('标签最长8个字');
      return;
    }
    //当输入的标签值不为空才进行添加
    if (StringUtils.isNotEmpty(tagInputValue)) {
      const param: API.UrlTagAddRequest = {
        parentId: Number(currentTab),
        name: tagInputValue,
      };
      const res = await addTagUsingPost(param);
      //添加标签成功
      message.success('添加自定义标签成功');
      if (allCategory) {
        // @ts-ignore
        allCategory[index]?.tags.push(res.data as API.UrlTagVo);
      }
      // @ts-ignore
      setAllCategory([...allCategory]);
    }
    setTagInputVisible(false);
    setTagInputValue('');
  };
  const showTagInput = (tabKey: number) => {
    setTagInputVisible(true);
    setEditingTab(tabKey);
  };
  const addTagToUrl = (tag: API.UserVO) => {
    if (selectedIds && selectedIds.length && selectedIds.length >= 10) {
      message.error('每个用户至多选择10个标签');
    } else {
      // @ts-ignore
      setCurrentUrlTag([...(currentUrlTag || []), tag]);
      // @ts-ignore
      setSelectedIds([...(selectedIds || []), tag.id]);
    }
  };
  //获取短链详情
  const getShortLinkDetail = async (shortLinkId: number) => {
    const res = await getUrlRelateVoByIdUsingGet({
      id: shortLinkId,
    });
    return res.data;
  };

  useEffect(() => {
    if (tagInputVisible) {
      // @ts-ignore
      inputRef.current?.focus();
    }
  }, [tagInputVisible, editingTab]);
  useEffect(() => {
    async function fetchCategoryData() {
      return await getAllTagsUsingGet();
    }

    fetchCategoryData().then((res) => {
      setAllCategory(res.data);
      // @ts-ignore
      setCurrentTab(res.data[0]?.id as any);
    });
    // 获取查询参数
    const searchParams = new URLSearchParams(location.search);
    // @ts-ignore
    const shortUrlId = parseInt(searchParams?.get('shortUrlId'));
    setShortLinkId(shortUrlId);
    getShortLinkDetail(shortUrlId).then((data) => {
      // 根据数据设置初始值
      setShortLink(data);
      setOpenPassword(data?.privateTarget === 1);
      // @ts-ignore
      setSelectedIds(JSON.parse(data?.tags));
      form.setFieldsValue(data);
    });
  }, [location.search]);

  const getFutureTime = (minutesToAdd: any) => {
    const currentTime = new Date();
    // 将分钟转换为毫秒
    return new Date(currentTime.getTime() + minutesToAdd * 60000).toISOString();
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
  const handleInputChange = (e: any) => {
    setTagInputValue(e.target.value);
  };
  const changeTab = (activeKey: string) => {
    setCurrentTab(activeKey);
  };
  const onFinish = async (values: API.UrlRelateUpdateRequest) => {
    const res = await updateUrlRelateUsingPost({
      ...values,
      privateTarget: values.privateTarget ? 1 : 0,
      status: 1,
      tags: JSON.stringify(selectedIds || []),
      id: shortLinkId,
    });
    if (res.code === 0) {
      history.push('/shortLink/publish');
      console.log('Received values of form: ', values);
    }
  };

  // @ts-ignore
  // @ts-ignore
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
              {BACKEND_HOST_LOCAL_REDIRECT + shortLink?.sortUrl}
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

          <Form.Item label="标签">
            <div>
              {currentUrlTag?.map((tag) => (
                <Tag key={tag.id} color={tag.color}>
                  {tag.name}
                </Tag>
              ))}
              <Tag
                onClick={() => {
                  setVisible(true);
                }}
                style={{ background: '#fff', borderStyle: 'dashed', borderRadius: 8 }}
              >
                <EditOutlined />
                编辑
              </Tag>
            </div>
          </Form.Item>

          {/*</Form.Item>*/}
          <Form.Item name="privateTarget" label="是否私密" valuePropName="checked">
            <Switch onChange={switchChange} />
          </Form.Item>
          {openPassword && (
            <Form.Item label="短链密码" name="password">
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item label="允许访问次数">
            <Form.Item name="allowNum" noStyle>
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
              <Button
                style={{ marginRight: '20px' }}
                onClick={() => history.push('/shortLink/myLink')}
              >
                存为草稿📑
              </Button>
              <Button type="primary" htmlType="submit">
                发布🍑
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        style={{ borderRadius: 8 }}
        centered={true}
        open={visible}
        title="添加标签"
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        <Divider />
        <FormItem label="我的标签" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <div>
            <Card style={{ width: 400, height: 86 }} bodyStyle={{ padding: 8 }}>
              {currentUrlTag?.map((tag) => (
                <Tag
                  key={tag.id}
                  color={tag.color}
                  closable
                  onClose={() => handleTagClose(tag)}
                  style={{ marginBottom: 10 }}
                >
                  {tag.name}
                </Tag>
              ))}
            </Card>
          </div>
        </FormItem>
        <Tabs onChange={changeTab} activeKey={String(currentTab)} tabPosition="left">
          {allCategory?.map((category, index) => (
            <Tabs.TabPane key={category.id} tab={category.name}>
              {category.tags?.map(
                (tag) =>
                  (selectedIds?.includes(tag.id ? tag.id : 0) && (
                    <Tag
                      style={{ cursor: 'pointer', marginBottom: 10, borderRadius: 8 }}
                      color="#f50"
                      key={tag.id}
                      onClick={() => handleTagClose(tag)}
                    >
                      {tag.name}
                      <CheckOutlined />
                    </Tag>
                  )) || (
                    <Tag
                      style={{ cursor: 'pointer', marginBottom: 10, borderRadius: 8 }}
                      key={tag.id}
                      onClick={() => {
                        addTagToUrl(tag);
                      }}
                    >
                      {tag.name}
                    </Tag>
                  ),
              )}
              {(tagInputVisible && category.id === editingTab && (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={tagInputValue}
                  onChange={handleInputChange}
                  onBlur={() => handleTagInputConfirm(index)}
                  onPressEnter={() => handleTagInputConfirm(index)}
                />
              )) || (
                <Tag
                  onClick={() => showTagInput(category.id as number)}
                  style={{ background: '#fff', borderStyle: 'dashed', borderRadius: 8 }}
                >
                  <PlusOutlined />
                  添加
                </Tag>
              )}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Modal>
    </div>
  );
};
export default ShortLinkCheck;
