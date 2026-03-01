import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Input, Space, Modal, Form, message, Typography, Tag, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  PhoneOutlined, 
  UserOutlined, 
  HomeOutlined, 
  ShopOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { request } from '../../util/request';

const { Title, Text } = Typography;

const SupplierPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await request('supplier', 'get');
    if (res) setData(res.list);
    setLoading(false);
  };

  const onFinish = async (values) => {
    // ចំណុចបន្ថែម៖ ពិនិត្យមើលថាជាការ Edit ឬ Add ថ្មី (តាមរយៈ id)
    const method = values.id ? 'put' : 'post';
    const url = values.id ? `supplier/${values.id}` : 'supplier';
    
    const res = await request(url, method, values);
    if (res) {
      message.success(values.id ? "Updated successfully!" : "Supplier added successfully!");
      setIsModalOpen(false);
      form.resetFields();
      fetchSuppliers();
    }
  };

  const columns = [
    { 
      title: 'Supplier Info', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>ID: SUP-00{Math.floor(Math.random() * 100)}</Text>
        </Space>
      )
    },
    { 
      title: 'Representative', 
      dataIndex: 'contact_name', 
      render: (text) => (
        <Tag icon={<UserOutlined />} color="blue">
          {text || 'N/A'}
        </Tag>
      )
    },
    { 
      title: 'Contact', 
      dataIndex: 'phone', 
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: '#52c41a' }} />
          <Text>{text || 'No Phone'}</Text>
        </Space>
      )
    },
    { 
      title: 'Address', 
      dataIndex: 'address',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Text type="secondary"><HomeOutlined /> {text || 'No Address'}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Action',
      align: 'center',
      render: (record) => (
        <Button 
          type="primary" 
          ghost 
          icon={<EditOutlined />} 
          onClick={() => {
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }}
        >
          Edit
        </Button>
      )
    }
  ];

  return (
    <div style={{minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Supplier Management</Title>
          <Text type="secondary">View and manage your product suppliers and vendors</Text>
        </div>
        <Button 
          type="primary" 
          size="large"
          icon={<PlusOutlined />} 
          onClick={() => {
            form.resetFields();
            setIsModalOpen(true);
          }}
          style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)' }}
        >
          Add New Supplier
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '16px' }}>
            <Input 
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="Search suppliers..." 
                style={{ width: 300, borderRadius: '6px' }} 
            />
        </div>
        
        <Table 
          dataSource={data} 
          columns={columns} 
          loading={loading} 
          rowKey="id" 
          pagination={{ pageSize: 8 }}
          style={{ cursor: 'pointer' }}
        />
      </Card>

      <Modal 
        title={
            <Space>
                <ShopOutlined style={{ color: '#1890ff' }} />
                <span>Supplier Details</span>
            </Space>
        }
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()}
        width={500}
        okText="Save Changes"
        centered
      >
        <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish} 
            style={{ marginTop: '20px' }}
        >
          {/* Hidden ID field for update logic */}
          <Form.Item name="id" hidden><Input /></Form.Item>

          <Form.Item 
            name="name" 
            label={<Text strong>Company / Supplier Name</Text>} 
            rules={[{ required: true, message: 'Please input company name!' }]}
          >
            <Input prefix={<ShopOutlined />} placeholder="e.g. Coca Cola Co., Ltd" size="large" />
          </Form.Item>

          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item name="contact_name" label={<Text strong>Representative</Text>} style={{ flex: 1 }}>
                <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
            </Form.Item>
            <Form.Item name="phone" label={<Text strong>Phone Number</Text>} style={{ flex: 1 }}>
                <Input prefix={<PhoneOutlined />} placeholder="012 345 678" size="large" />
            </Form.Item>
          </Space>

          <Form.Item name="address" label={<Text strong>Office Address</Text>}>
            <Input.TextArea 
                placeholder="Enter full address details" 
                rows={3} 
                style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierPage;