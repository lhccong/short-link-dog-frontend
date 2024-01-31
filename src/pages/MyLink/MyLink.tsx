import { BACKEND_HOST_LOCAL_REDIRECT } from '@/constants';
import {
  deleteUrlRelateUsingPost,
  listUrlRelateVoByPageUsingPost,
  updateUrlRelateUsingPost,
} from '@/services/backend/shortLinkController';
import { addTagUsingPost, getAllTagsUsingGet } from '@/services/backend/urlTagController';
import { StringUtils } from '@/utils/stringUtil';
import { useModel } from '@@/plugin-model';
import {
  CheckOutlined,
  ChromeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  QRCode,
  Row,
  Space,
  Statistic,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import Meta from 'antd/es/card/Meta';
import FormItem from 'antd/es/form/FormItem';
import React, { useEffect, useRef, useState } from 'react';

const MyLink: React.FC = () => {
  const [pageNum, setPageNum] = useState(0);
  const [total, setTotal] = useState(0);
  const { initialState } = useModel('@@initialState');
  const [urlList, setUrlList] = useState<API.UrlRelateVo[]>();
  const [currentUrlTag, setCurrentUrlTag] = useState<API.UrlTagVo[]>();
  const [allCategory, setAllCategory] = useState<API.UrlTagCategoryVo[] | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState('0');
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [editingTab, setEditingTab] = useState(0);
  const [tagInputValue, setTagInputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.UrlRelateVo>();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  //刷新数据
  const getUrlList = async () => {
    return await listUrlRelateVoByPageUsingPost({
      userId: initialState?.currentUser?.id,
      pageSize: 8,
      current: pageNum,
      sortField: 'createTime',
      sortOrder: 'desc',
    });
  };
  const fresh = () => {
    getUrlList().then((res) => {
      if (res.code === 0) {
        setUrlList(res?.data?.records);
        setTotal(res?.data?.total as number);
      }
    });
  };
  //删除短链
  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleDeleteOk = () => {
    setConfirmLoading(true);

    deleteUrlRelateUsingPost({
      id: currentRow?.id,
    }).then((res) => {
      if (res.code === 0) {
        fresh();
        message.success('删除成功');
        setOpen(false);
        setConfirmLoading(false);
      }
    });
  };

  const handleDeleteCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };
  // 标签移除
  const handleTagClose = (tag: API.UrlTagVo) => {
    setSelectedIds(selectedIds?.filter((tagId) => tagId !== tag.id));
    setCurrentUrlTag(currentUrlTag?.filter((selectedTag) => selectedTag.id !== tag.id));
  };
  const switchChange = (value: any) => {
    setOpenPassword(value);
  };
  const showTagInput = (tabKey: number) => {
    setTagInputVisible(true);
    setEditingTab(tabKey);
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
  const handleInputChange = (e: any) => {
    setTagInputValue(e.target.value);
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
  const changeTab = (activeKey: string) => {
    setCurrentTab(activeKey);
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  const handleUpdateOk = async () => {
    setConfirmLoading(true);
    const res = await updateUrlRelateUsingPost({
      privateTarget: openPassword ? 1 : 0,
      tags: JSON.stringify(selectedIds || []),
      password: form.getFieldValue('password'),
      id: currentRow?.id,
    });
    if (res.code === 0) {
      fresh();
      message.success('修改成功');
      setUpdateModalVisible(false);
      setConfirmLoading(false);
    }
  };

  const handleUpdateCancel = () => {
    console.log('Clicked cancel button');
    setUpdateModalVisible(false);
  };

  // 组件加载时和页码变化时触发数据获取
  useEffect(() => {
    async function fetchCategoryData() {
      return await getAllTagsUsingGet();
    }

    fetchCategoryData().then((res) => {
      setAllCategory(res.data);
      // @ts-ignore
      setCurrentTab(res.data[0]?.id as any);
    });
    getUrlList().then((res) => {
      if (res.code === 0) {
        setUrlList(res?.data?.records);
        setTotal(res?.data?.total as number);
      }
    });
  }, [pageNum]);

  // 分页器改变时更新当前页码
  const handlePageChange = (page: React.SetStateAction<number>) => {
    setPageNum(page);
  };
  useEffect(() => {
    getUrlList().then((res) => {
      if (res.code === 0) {
        setUrlList(res?.data?.records);
        setTotal(res?.data?.total as number);
      }
    });
  }, []);
  const statusChange = (item: API.UrlRelateVo) => {
    updateUrlRelateUsingPost({
      id: item.id,
      status: item.status === 1 ? 0 : 1,
    }).then((r) => {
      if (r.code === 0) {
        message.success('状态已变更');
      }
    });
  };
  // @ts-ignore
  // @ts-ignore
  return (
    <Card>
      <List
        pagination={{
          position: 'bottom',
          align: 'center',
          total: total,
          pageSize: 8,
          onChange: handlePageChange,
        }}
        grid={{ gutter: 16, column: 4 }}
        dataSource={urlList}
        renderItem={(item) => (
          <List.Item>
            <Badge.Ribbon text={<text>{item?.tags?.[0].name}</text>}>
              <Card
                actions={[
                  // <SettingOutlined key="setting" />,
                  <EditOutlined
                    key="edit"
                    onClick={() => {
                      setUpdateModalVisible(true);
                      setCurrentRow(item);
                      setOpenPassword(item?.privateTarget === 1);
                      setCurrentUrlTag(item.tags);
                      if (item?.tags && item?.tags.length !== 0) {
                        // @ts-ignore
                        setSelectedIds(item.tags.map((tag) => tag.id ?? 0));
                      }
                      form.setFieldsValue(item);
                    }}
                  />,
                  // eslint-disable-next-line react/jsx-key
                  <Popconfirm
                    description="确定要删除此短链吗？"
                    open={open && currentRow?.id === item.id}
                    onConfirm={handleDeleteOk}
                    okButtonProps={{ loading: confirmLoading }}
                    onCancel={handleDeleteCancel}
                    title={'❌'}
                  >
                    <DeleteOutlined
                      key="ellipsis"
                      onClick={() => {
                        setCurrentRow(item);
                        showPopconfirm();
                      }}
                    />
                  </Popconfirm>,
                ]}
                cover={
                  <Card
                    title={
                      <a href={BACKEND_HOST_LOCAL_REDIRECT + item.sortUrl}>
                        🚀：{BACKEND_HOST_LOCAL_REDIRECT + item.sortUrl}{' '}
                      </a>
                    }
                  >
                    <Space size={[0, 8]} wrap>
                      {item?.tags?.map((tag) => (
                        <Tag key={tag.id} color={tag.color} style={{ marginBottom: 10 }}>
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                    <Row gutter={16}>
                      <Col span={12}>
                        <QRCode
                          errorLevel="H"
                          value={item?.sortUrl ? BACKEND_HOST_LOCAL_REDIRECT + item.sortUrl : ''}
                          icon={item.urlImg}
                        />
                      </Col>
                      <Col span={12}>
                        <Card bordered={false}>
                          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <Statistic
                              title="IP访问次数"
                              value={item.ipNums}
                              precision={2}
                              valueStyle={{ color: '#3f8600' }}
                              prefix={<ChromeOutlined />}
                            />
                            <div>
                              短链状态：
                              <Switch
                                checkedChildren="发布"
                                unCheckedChildren="下架"
                                defaultChecked={item.status === 1}
                                onChange={() => statusChange(item)}
                              />
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                }
              >
                <Meta
                  avatar={<Avatar src={item.urlImg} />}
                  title={item.title}
                  description={'长链地址：' + item.longUrl}
                />
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />
      <Modal
        title="Title"
        visible={updateModalVisible}
        confirmLoading={confirmLoading}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <div>
          <Form form={form} name="validate_other" {...formItemLayout}>
            <Form.Item label="短链标题" name="title">
              <Input />
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
            <Form.Item name="privateTarget" label="是否私密" valuePropName="checked">
              <Switch onChange={switchChange} defaultValue={currentRow?.privateTarget === 1} />
            </Form.Item>
            {openPassword && (
              <Form.Item label="短链密码" name="password">
                <Input.Password />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>

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
    </Card>
  );
};
export default MyLink;
