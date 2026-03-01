import React, { useState } from 'react';
import {
  PieChartOutlined,
  DesktopOutlined,
  ShopOutlined,
  TagsOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Space, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import BIS_logo from '../../assets/BIS_logo.png';
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem('Dashboard', '/dashboard', <PieChartOutlined />),
  getItem('Role', '/role', <TeamOutlined />),
  getItem('Categories', '/category', <AppstoreOutlined />),
  getItem('Supplier', '/supplier', <ShoppingOutlined />),
  getItem('Products', '/products', <ShoppingOutlined />),
  getItem('Order', '/orders', <ShoppingOutlined />),
  getItem('Brands', '/brand', <TagsOutlined />),
  getItem('Provinces', '/provinces', <EnvironmentOutlined />),
  getItem('Stock History', '/stock-transaction', <EnvironmentOutlined />),
  getItem('Reports', '/reports', <FileTextOutlined />),
  getItem('Manage', 'sub1', <UserOutlined />, [
    getItem('Founder Image', '/founder', <PictureOutlined />),
    getItem('About', '/about', <InfoCircleOutlined />),
  ]),
];
const MasterPage = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={location.pathname} mode="inline" items={items}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{display:'flex', justifyContent:'space-between', padding: 20, background: colorBgContainer, marginBottom:15}} >
          <Space >
            <div style={{ width:"50px", height:'50px'}}>
              <img src={BIS_logo} alt="BIS Logo"  style={{width:'100%', height:'100%', objectFit:'contain'}}/>
            </div>
            <h4>GenZ Coder</h4>
          </Space>

          <Space style={{display:'flex'}}>
            <div>Neymar Junior</div>
            <div style={{ width:"50px", height:'50px', borderRadius:'50%', backgroundColor:'gray'}}>
              
            </div>
          </Space>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MasterPage;