import React, { useEffect, useState } from 'react';
import { 
  Table, Tag, Space, Typography, Card, Input, 
  DatePicker, Button, Statistic, Row, Col, 
  Avatar, Badge, Divider, Tooltip 
} from 'antd';
import { 
  ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined, 
  FileTextOutlined, ShoppingCartOutlined, DatabaseOutlined, 
  UserOutlined, SearchOutlined, HistoryOutlined
} from '@ant-design/icons';
import { request } from '../../util/request';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const StockHistory = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ 
    cost_in: 0, 
    sale_out: 0, 
    total_qty_in: 0, 
    total_qty_out: 0, 
    qty_balance: 0 
  });
  const [filter, setFilter] = useState({ text_search: "", date_range: null });

  useEffect(() => { 
    fetchHistory(); 
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // ហៅទៅកាន់ API របស់អ្នក
      const res = await request('stock-transaction', 'get');
      if (res && res.list) {
        const list = res.list;
        setData(list);

        // គណនាផ្នែកហិរញ្ញវត្ថុ (Financial)
        const costIn = list.filter(i => i.type === 'in').reduce((a, b) => a + (Number(b.quantity) * Number(b.cost_price)), 0);
        const saleOut = list.filter(i => i.type === 'out').reduce((a, b) => a + (Number(b.quantity) * Number(b.cost_price)), 0);

        // គណនាផ្នែកចំនួនទំនិញ (Inventory Units)
        const qtyIn = list.filter(i => i.type === 'in').reduce((a, b) => a + Number(b.quantity), 0);
        const qtyOut = list.filter(i => i.type === 'out').reduce((a, b) => a + Number(b.quantity), 0);

        setSummary({ 
          cost_in: costIn, 
          sale_out: saleOut, 
          total_qty_in: qtyIn, 
          total_qty_out: qtyOut, 
          qty_balance: qtyIn - qtyOut 
        });
      }
    } catch (error) { 
      console.error("Fetch History Error:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const columns = [
    {
      title: 'REFERENCE / DATE',
      key: 'ref',
      width: 200,
      render: (record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff', fontSize: '13px' }}>
            {record.type === 'in' ? 'INV-IN-' : 'ORD-OUT-'}{record.id.toString().padStart(5, '0')}
          </Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            <HistoryOutlined style={{ marginRight: 4 }} />
            {dayjs(record.created_at).format('DD MMM YYYY | hh:mm A')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'PRODUCT DETAILS',
      dataIndex: 'product',
      key: 'product',
      render: (product) => (
        <Space>
          <div style={{ padding: '10px', background: '#f0f2f5', borderRadius: '8px' }}>
            <DatabaseOutlined style={{ color: '#595959' }} />
          </div>
          <div>
            <Text strong block style={{ fontSize: '14px' }}>{product?.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {product?.code}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'TXN TYPE',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (type) => (
        <Tag color={type === 'in' ? 'green' : 'volcano'} style={{ borderRadius: '4px', border: 'none', fontWeight: 600 }}>
          {type === 'in' ? 'STOCK-IN' : 'STOCK-OUT'}
        </Tag>
      )
    },
    {
      title: 'MOVEMENT',
      key: 'movement',
      align: 'right',
      render: (record) => (
        <div style={{ textAlign: 'right' }}>
          <Text strong style={{ color: record.type === 'in' ? '#52c41a' : '#ff4d4f', fontSize: '16px' }}>
            {record.type === 'in' ? '+' : '-'}{record.quantity}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>Units</Text>
        </div>
      )
    },
    {
      title: 'UNIT PRICE',
      dataIndex: 'cost_price',
      key: 'price',
      align: 'right',
      render: (price) => <Text style={{ color: '#595959' }}>${Number(price).toFixed(2)}</Text>
    },
    {
      title: 'TOTAL AMOUNT',
      key: 'total',
      align: 'right',
      render: (record) => (
        <Text strong style={{ fontSize: '14px' }}>
          ${(record.quantity * record.cost_price).toLocaleString()}
        </Text>
      )
    },
    {
      title: 'OPERATOR',
      dataIndex: 'user',
      key: 'user',
      align: 'center',
      render: (user) => (
        <Tooltip title={user?.name || 'Authorized Admin'}>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
        </Tooltip>
      )
    }
  ];

  return (
    <div style={{background: '#f4f7f6', minHeight: '100vh' }}>
      {/* 🚀 Financial & Inventory Summary Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', borderLeft: '5px solid #52c41a' }}>
            <Statistic 
              title={<Text type="secondary" strong uppercase>Inventory Purchase (IN)</Text>} 
              value={summary.cost_in} 
              prefix="$" 
              valueStyle={{ color: '#52c41a', fontWeight: '800' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>សរុបដើមទុនដែលបានទិញទំនិញចូល</Text>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card bordered={false} style={{ borderRadius: '12px', borderLeft: '5px solid #1890ff' }}>
            <Statistic 
              title={<Text type="secondary" strong uppercase>Sales Revenue (OUT)</Text>} 
              value={summary.sale_out} 
              prefix="$" 
              valueStyle={{ color: '#1890ff', fontWeight: '800' }}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>សរុបទឹកប្រាក់ដែលលក់បាន</Text>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: '12px', 
              background: '#001529', 
              boxShadow: '0 4px 15px rgba(0,21,41,0.2)' 
            }}
          >
            <Statistic 
              title={<Text style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>NET STOCK BALANCE</Text>} 
              value={summary.qty_balance} 
              valueStyle={{ color: '#fff', fontWeight: '800', fontSize: '28px' }}
              suffix={<span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Units</span>}
            />
            <Divider style={{ margin: '12px 0', borderColor: 'rgba(255,255,255,0.1)' }} />
            <Row justify="space-between">
              <Col>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Total In: </Text>
                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>+{summary.total_qty_in}</Text>
              </Col>
              <Col>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Total Out: </Text>
                <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>-{summary.total_qty_out}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 📊 Main Ledger Table */}
      <Card 
        bordered={false} 
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
        title={
          <Space>
            <div style={{ padding: '8px', background: '#e6f7ff', borderRadius: '8px' }}>
              <FileTextOutlined style={{ color: '#1890ff' }} />
            </div>
            <Title level={4} style={{ margin: 0 }}>Transaction Ledger</Title>
          </Space>
        }
        extra={
          <Space>
            <Input 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Search Reference or Product..." 
              style={{ width: 260, borderRadius: '8px' }} 
              onChange={(e) => setFilter({...filter, text_search: e.target.value})}
            />
            <RangePicker style={{ borderRadius: '8px' }} />
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchHistory} 
              type="primary" 
              style={{ borderRadius: '8px' }}
            >
              Sync Data
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          rowKey="id"
          pagination={{ 
            pageSize: 10, 
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true 
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default StockHistory;