import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Select, Button, message, Spin } from 'antd';
import { request } from '../../util/request';

const StockInAction = ({ onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // បន្ថែមថ្មី
  const [fetching, setFetching] = useState(false);
  const [form] = Form.useForm();

  // កែសម្រួលមកជាការ Fetch ទិន្នន័យចាំបាច់ទាំងអស់
  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const [resPro, resSup] = await Promise.all([
        request('product', 'get'),
        request('supplier', 'get') // ហៅទៅ API supplier
      ]);

      if (resPro && resPro.proList) {
        setProducts(resPro.proList);
      }
      if (resSup && resSup.list) {
        setSuppliers(resSup.list); // កែតម្រូវតាម key នៃ API response របស់អ្នក (ឧទាហរណ៍៖ .list)
      }
    } catch (error) {
      message.error("មិនអាចទាញយកទិន្នន័យបានទេ!");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchInitialData();
    }
  }, [open]);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await request('stock-in', 'post', values);
    if (res && !res.error) {
      message.success("បញ្ចូលស្តុកជោគជ័យ!");
      setOpen(false);
      form.resetFields();
      if (onRefresh) onRefresh();
    }
    setLoading(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
          Stock In
      </Button>

      <Modal 
        title="បញ្ចូលទំនិញថ្មីទៅក្នុងស្តុក" 
        open={open} 
        onCancel={() => setOpen(false)} 
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Spin spinning={fetching}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            
            {/* បន្ថែមថ្មី: ជ្រើសរើសអ្នកផ្គត់ផ្គង់ */}
            <Form.Item 
              name="supplier_id" 
              label="អ្នកផ្គត់ផ្គង់ (Supplier)" 
              rules={[{ required: true, message: 'សូមជ្រើសរើសអ្នកផ្គត់ផ្គង់' }]}
            >
              <Select 
                showSearch
                placeholder="ជ្រើសរើសអ្នកផ្គត់ផ្គង់..."
                optionFilterProp="label"
                options={suppliers.map(s => ({ 
                  label: s.name, 
                  value: s.id 
                }))} 
              />
            </Form.Item>

            <Form.Item 
              name="product_id" 
              label="ជ្រើសរើសផលិតផល" 
              rules={[{ required: true, message: 'សូមជ្រើសរើសទំនិញ' }]}
            >
              <Select 
                showSearch
                placeholder="ស្វែងរកឈ្មោះទំនិញ..."
                optionFilterProp="label"
                options={products.map(p => ({ 
                  label: `${p.name} (${p.code})`,
                  value: p.id 
                }))} 
              />
            </Form.Item>

            <Form.Item 
              name="qty" 
              label="ចំនួនបញ្ចូល (Quantity)" 
              rules={[{ required: true, message: 'សូមបញ្ចូលចំនួន' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>

            <Form.Item 
              name="cost_price" 
              label="តម្លៃដើមក្នុងមួយឯកតា (Cost Price per Unit)" 
              rules={[{ required: true, message: 'សូមបញ្ចូលតម្លៃដើម' }]}
            >
              <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default StockInAction;