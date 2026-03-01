import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Image, Typography, message, Card, Row, Col, Statistic, Tooltip, Divider, Popconfirm } from 'antd';
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    EyeOutlined, 
    ShoppingCartOutlined, 
    ClockCircleOutlined, 
    CheckOutlined,
    StopOutlined 
} from '@ant-design/icons';
import { request } from '../../util/request';

const { Title, Text } = Typography;

const OrderPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await request('orders', 'get');
        if (res) setData(res.list);
        setLoading(false);
    };

    const handleUpdateStatus = async (id, status) => {
    setLoading(true);
    try {
        // ✅ ត្រូវបន្ថែម await នៅទីនេះ ដើម្បីឱ្យវាចាំទាល់តែ API ធ្វើការចប់ ១០០%
        const res = await request(`orders/${id}/status`, 'put', { status });

        if (res && res.success) {
            message.success(res.message);
            
            // ✅ ប្រើ await មួយទៀត ដើម្បីប្រាកដថាវាទាញទិន្នន័យថ្មីមកវិញបានត្រឹមត្រូវ
            await fetchOrders(); 
        } else {
            message.error(res?.message || "មានបញ្ហាក្នុងការ Update");
        }
    } catch (error) {
        message.error("Error connection!");
    } finally {
        setLoading(false);
    }
};
    // គណនាស្ថិតិសង្ខេប
    const stats = {
        total: data.length,
        pending: data.filter(item => !item.status || item.status === 'pending').length,
        approved: data.filter(item => item.status === 'approved').length,
        cancelled: data.filter(item => item.status === 'cancelled').length,
    };

    const columns = [
    { 
        title: 'ORDER ID', 
        dataIndex: 'id', 
        key: 'id',
        render: (id) => <Text code>#{id}</Text>
    },
    { 
        title: 'CUSTOMER', 
        dataIndex: 'buyer_name', 
        key: 'buyer_name',
        render: (name, record) => (
            <Space direction="vertical" size={0}>
                <Text strong>{name}</Text>
                <Text type="secondary" size="small">{record.buyer_phone}</Text>
            </Space>
        )
    },
    { 
        title: 'TOTAL AMOUNT', 
        dataIndex: 'total', 
        render: (total) => (
            <Text strong style={{ color: '#2ecc71', fontSize: '16px' }}>
                ${Number(total).toLocaleString()}
            </Text>
        )
    },
    {
        title: 'PAYMENT SLIP',
        dataIndex: 'transaction_image',
        align: 'center',
        render: (img) => (
            <Image 
                width={45} 
                height={45}
                style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid #f0f0f0' }}
                src={`http://localhost:8000/storage/${img}`}
                fallback="https://via.placeholder.com/45?text=NA"
            />
        )
    },
    {
        title: 'STATUS',
        dataIndex: 'status',
        render: (status) => {
            const s = status ? status.toLowerCase() : 'pending';
            if (s === 'approved') return <Tag icon={<CheckOutlined />} color="success">APPROVED</Tag>;
            if (s === 'cancelled') return <Tag icon={<StopOutlined />} color="error">CANCELLED</Tag>;
            return <Tag icon={<ClockCircleOutlined />} color="warning">PENDING</Tag>;
        }
    },
    {
        title: 'ACTIONS',
        align: 'right',
        render: (record) => (
            <Space size="middle">
                {(record.status === 'pending' || !record.status) && (
                    <>
                        <Tooltip title="Approve Order">
                            <Popconfirm
                                title="បញ្ជាក់ការអនុម័ត"
                                description="តើអ្នកច្បាស់ទេថាបានទទួលប្រាក់ត្រឹមត្រូវ?"
                                onConfirm={() => handleUpdateStatus(record.id, 'approved')}
                                okText="បាទ/ចាស"
                                cancelText="ទេ"
                            >
                                <Button 
                                    type="primary" 
                                    shape="circle"
                                    icon={<CheckCircleOutlined />} 
                                    style={{ backgroundColor: '#2ecc71', borderColor: '#2ecc71' }}
                                />
                            </Popconfirm>
                        </Tooltip>

                        <Tooltip title="Cancel Order">
                            <Popconfirm
                                title="បោះបង់ការកុម្ម៉ង់?"
                                description="ទំនិញនឹងត្រូវបូកបញ្ចូលក្នុងស្តុកវិញ!"
                                onConfirm={() => handleUpdateStatus(record.id, 'cancelled')}
                                okText="បោះបង់"
                                cancelText="ត្រឡប់ក្រោយ"
                                okButtonProps={{ danger: true }}
                            >
                                <Button 
                                    danger 
                                    shape="circle"
                                    icon={<CloseCircleOutlined />} 
                                />
                            </Popconfirm>
                        </Tooltip>
                    </>
                )}
                <Tooltip title="View Details">
                    <Button 
                        shape="circle" 
                        icon={<EyeOutlined />} 
                        onClick={() => {/* កូដសម្រាប់បើក Modal មើល Details */}}
                    />
                </Tooltip>
            </Space>
        )
    }
];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Order Management</Title>
                    <Text type="secondary">Manage and track your customer purchases</Text>
                </div>
                <Button type="primary" icon={<ShoppingCartOutlined />} size="large">
                    Export Orders
                </Button>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={12} sm={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic title="Total Orders" value={stats.total} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} prefix={<ClockCircleOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} prefix={<CheckOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic title="Cancelled" value={stats.cancelled} valueStyle={{ color: '#f5222d' }} prefix={<StopOutlined />} />
                    </Card>
                </Col>
            </Row>

            {/* Table Section */}
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table 
                    columns={columns} 
                    dataSource={data} 
                    loading={loading} 
                    rowKey="id" 
                    pagination={{ pageSize: 8 }}
                />
            </Card>

            <style dangerouslySetInnerHTML={{ __html: `
                .stat-card { border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s; }
                .stat-card:hover { transform: translateY(-5px); }
                .ant-table-thead > tr > th { background-color: #fafafa !important; font-weight: 700 !important; color: #8c8c8c !important; font-size: 12px !important; text-transform: uppercase; }
            `}} />
        </div>
    );
};

export default OrderPage;