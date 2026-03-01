import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Badge, Popover, List } from 'antd';
import { 
  ShoppingOutlined, 
  MenuOutlined, 
  HomeOutlined, 
  TeamOutlined, 
  UserOutlined,
  GlobalOutlined 
} from '@ant-design/icons';
import { cartStore } from "../../Store/productCardStore";
import Banner from '../UsersInterface/Banner';
import Founder from '../UsersInterface/Founder'

const UserLayout = () => {
  const navigate = useNavigate();
  const cart = cartStore((state) => state.cart);
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

  // Menu items precisely matching your screenshot
  const menuItems = [
    // { title: 'KH', icon: <GlobalOutlined />, path: '/' },
    { title: 'Home', icon: <HomeOutlined />, path: '/' },
    { title: 'About', icon: <HomeOutlined />, path: '/about' },
    { title: 'Our Partners', icon: <TeamOutlined />, path: '/partners' },
    { title: 'Login', icon: <UserOutlined />, path: '/login' },
  ];

  // The "Small Dropdown" Content
  // The "Small Dropdown" Content aligned to the left
  const menuContent = (
    <div style={{ padding: "8px 0" }}>
      <List
        size="small"
        style={{ width: 180 }} // Set width as seen in the image
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item 
            onClick={() => {
              navigate(item.path);
            }}
            style={{ 
              cursor: 'pointer', 
              padding: '12px 16px', // Generous padding on the left
              border: 'none',
              display: 'flex',
              justifyContent: 'flex-start', // Forces icon and text to the left
              alignItems: 'center',
              gap: '12px', // Gap between icon and text
              transition: 'background 0.3s'
            }}
            className="dropdown-item"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ 
              fontSize: 18, 
              color: '#333', 
              display: 'flex', 
              alignItems: 'center',
              width: '20px' // Keeps icons perfectly aligned vertically
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: 14, 
              fontWeight: 500, 
              color: '#333' 
            }}>
              {item.title}
            </span>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* --- FIXED GLOBAL HEADER --- */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '15px 20px', 
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky', 
        top: 0, 
        zIndex: 1100, 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)'
      }}>
        
        {/* SMALL DROPDOWN TRIGGER */}
        <div style={{ position: 'absolute', left: 30 }}>
          <Popover 
            content={menuContent} 
            trigger="click" 
            placement="bottomLeft"
            overlayInnerStyle={{ padding: 0, borderRadius: '8px' }} // Sharp modern corners
          >
            <MenuOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Popover>
        </div>

        <h1 
          style={{ 
            fontFamily: "serif", fontWeight: "900", fontSize: 24, 
            margin: 0, cursor: 'pointer', letterSpacing: '2px'
          }} 
          onClick={() => navigate('/')}
        >
          SHEERLONG SHOP
        </h1>
        
        <div 
          style={{ position: 'absolute', right: 30, cursor: 'pointer' }}
          onClick={() => navigate('/checkout')}
        >
          <Badge count={totalQty} color="#000" size="small">
            <ShoppingOutlined style={{ fontSize: 22, color: '#000' }} />
          </Badge>
        </div>
      </header>

      {/* Sale Banner Bar */}
      <div style={{ 
        background: "#000", color: "#fff", textAlign: "center", 
        padding: "10px 0", fontSize: "11px", letterSpacing: "1px" 
      }}>
        FREE DELIVERY ON ALL ORDERS OVER $40
      </div>

      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <Banner/>
        <Outlet />
        <Founder/>
      </main>
    </div>
  );
};

export default UserLayout;