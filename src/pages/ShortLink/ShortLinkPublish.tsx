import {
  Button,
  Card,
  Result,
} from 'antd';

export default () => {
  return (
    <div>
      <Card>
        <Result
          status="success"
          title="恭喜你发布成功啦✨"
          subTitle="成功不是最终的，失败也不是致命的：关键在于勇气坚持不懈。"
          extra={[
            <Button type="primary" key="console">
              返回我的短链
            </Button>,
            // <Button key="buy">Buy Again</Button>,
          ]}
        />
      </Card>
    </div>
  );
};
