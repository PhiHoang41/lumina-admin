import { Card, Row, Col, Statistic } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import PageTitle from "../../components/PageTitle/PageTitle";

const DashboardPage = () => {
  return (
    <div>
      <PageTitle title="Dashboard" />
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={120}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={50}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={12500000}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
              formatter={(value) => `${value.toLocaleString()} đ`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={85}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
