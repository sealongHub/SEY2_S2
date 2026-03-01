import React, { useEffect, useState } from 'react';
import {
  Row, Col, Input, Button, Divider, Radio, Space,
  Image, Checkbox, Select, Form, Modal, Upload, message
} from 'antd';
import {
  ShoppingOutlined, CreditCardOutlined,
  MinusOutlined, PlusOutlined, UploadOutlined
} from '@ant-design/icons';
import { cartStore } from "../../Store/productCardStore";
import Config from "../../util/Config";
import { request } from '../../util/request';
import QRCode from '../../assets/QRCode.png';

const CheckoutPage = () => {
  const { cart, addToCart, decreaseQty, removeFromCart } = cartStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 40 ? 0 : 1.5;
  const total = subtotal + deliveryFee;

  const [state, setState] = useState({
    list: [], // province list
    category: []
  });

  const [filter, setFilter] = useState({
    province_id: null,
  });

  const [formRef] = Form.useForm();
  const [qrVisible, setQrVisible] = useState(false);
  const [qrInfo, setQrInfo] = useState({ method: "", qrUrl: "" });
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getLists();
  }, []);

  const getLists = async () => {
    try {
      const res = await request('provinces', 'get');
      if (!res.errors) {
        setState(p => ({
          ...p,
          list: res.provinces || [],
          category: res.category || []
        }));
      }
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const onFinish = (values) => {
    console.log("Form values:", values);

    const selectedMethod = values.payment_method;
    let qrImage = "";

    if (selectedMethod === "aba") {
      qrImage = "https://www.ababank.com/uploads/qr/aba_qr_example.png";
    } else if (selectedMethod === "acleda") {
      qrImage = "https://www.acledabank.com.kh/kh/assets/qrcode_sample.png";
    }

    // Show QR modal
    setQrInfo({ method: selectedMethod, qrUrl: qrImage });
    setQrVisible(true);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const { clearCart } = cartStore(); // ✅ import clearCart

const handleTransactionSubmit = async () => {
  // 1️⃣ Make sure user uploaded a transaction screenshot
  if (fileList.length === 0) {
    message.warning("Please upload your transaction screenshot.");
    return;
  }

  // 2️⃣ Get form values
  const values = formRef.getFieldsValue();

  // 3️⃣ Prepare FormData
  const formData = new FormData();
  formData.append("buyer_name", values.buyer_name);
  formData.append("buyer_phone", values.buyer_phone);
  formData.append("address", values.address);
  formData.append("province_id", values.province_id);
  formData.append("note", values.note || "");
  formData.append("payment_method", values.payment_method);
  formData.append("total", total);
  formData.append("delivery_fee", deliveryFee);

  // ✅ Keep your original cart for frontend/receipts
  formData.append("cart", JSON.stringify(cart));

  // ✅ Add items for backend stock update
  // ✅ កែសម្រួលឱ្យត្រូវតាម Key ក្នុង Store (item.qty)
formData.append(
  "items",
  JSON.stringify(
    cart.map(item => ({
      id: item.id,      // ផ្ញើ id ទៅដើម្បីឱ្យ Laravel find($id) បាន
      qty: item.qty     // ប្រើ .qty ឱ្យដូចក្នុង Store របស់អ្នក
    }))
  )
);


  // ✅ Add transaction screenshot if uploaded
  if (fileList[0]?.originFileObj) {
    formData.append("transaction_image", fileList[0].originFileObj);
  }

  try {
    // 4️⃣ Send request to Laravel backend
    const res = await request("purchase", "post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 5️⃣ Handle response
    if (res.success) {
      message.success("Transaction submitted successfully!");

      // ✅ Open receipt PDF if provided
      if (res.receipt_url) {
        window.open(res.receipt_url, "_blank");
      }

      // ✅ Clear cart, reset form, hide QR
      clearCart();
      setQrVisible(false);
      formRef.resetFields();
      setFileList([]);
    } else {
      message.error(res.message || "Failed to submit order.");
    }
  } catch (err) {
    console.error(err);
    message.error("Server error. Please try again.");
  }
};





  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      {/* 1. Shopping Bag Section */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>
          <ShoppingOutlined style={{ marginRight: 8 }} /> Shopping Bag
        </h2>
        <Divider style={{ borderStyle: 'dashed' }} />

        {cart.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <Space size="large">
              <Image
                src={Config.imgPath + item.image}
                width={50}
                preview={false}
                style={{ borderRadius: 8, border: '1px solid #f0f0f0' }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '500' }}>{item.name}</div>
                <Space style={{ border: '1px solid #eee', padding: '2px 4px', borderRadius: 4, marginTop: 5 }}>
                  <Button type="text" size="small" icon={<MinusOutlined />} onClick={() => decreaseQty(item.id)} />
                  <span style={{ width: 25, textAlign: 'center', display: 'inline-block', fontWeight: 'bold' }}>{item.qty}</span>
                  <Button type="text" size="small" icon={<PlusOutlined />} onClick={() => addToCart(item)} />
                </Space>
              </div>
            </Space>
            <Button type="link" danger onClick={() => removeFromCart(item.id)} style={{ fontSize: 12 }}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <h2 style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 30 }}>
        <CreditCardOutlined style={{ marginRight: 8 }} /> Checkout
      </h2>

      <Form layout="vertical" onFinish={onFinish} form={formRef}>
        <Row gutter={40}>
          {/* 1. Left Side: Buyer & Delivery Info */}
          <Col xs={24} md={14}>
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: 15 }}>Buyer Information</h3>

              <Form.Item
                label="Name"
                name="buyer_name"
                rules={[{ required: true, message: 'Please enter buyer name' }]}
              >
                <Input placeholder="Ex: LEE SHEERLONG" prefix={<span style={{ color: '#ccc' }}>👤</span>} style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="buyer_phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input placeholder="Ex: 0xx xxx xxx" prefix={<span style={{ color: '#ccc' }}>📞</span>} style={{ borderRadius: 6 }} />
              </Form.Item>
            </div>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: 5 }}>Delivery Information</h3>
              <p style={{ fontSize: 12, color: '#666' }}>
                We will provide to <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>J&T</span>
              </p>

              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input placeholder="Ex: Chbar Ampov" prefix={<span style={{ color: '#ccc' }}>📍</span>} style={{ borderRadius: 6 }} />
              </Form.Item>

              <Form.Item
                label="Province"
                name="province_id"
                rules={[{ required: true, message: 'Please select province' }]}
              >
                <Select
                  placeholder="Select Provinces"
                  style={{ width: '100%' }}
                  options={state.list.map(item => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Note" name="note">
                <Input.TextArea rows={3} placeholder="Please help write.." style={{ borderRadius: 6 }} />
              </Form.Item>
            </div>

            <div>
              <h3 style={{ fontWeight: 'bold', marginBottom: 15 }}>Payment Method</h3>
              <Form.Item
                name="payment_method"
                rules={[{ required: true, message: 'Please select payment method' }]}
                initialValue="aba"
              >
                <Radio.Group style={{ width: '100%' }}>
                  {[
                    {
                      key: 'aba',
                      title: 'ABA Bakong',
                      desc: 'Scan to pay with upload transaction',
                      img: 'https://play-lh.googleusercontent.com/WU6sZMD1UspzwqYnlACtmN60rckp8hoINSgsR21mKLJBbsHPwXtzwvOocpjC7FcO1g=w240-h480-rw',
                    },
                    {
                      key: 'acleda',
                      title: 'Acleda Bank',
                      desc: 'Scan to pay with upload transaction',
                      img: 'https://www.acledasecurities.com.kh/as/assets/listed_company/ABC/logo.png',
                    },
                  ].map((option) => (
                    <Form.Item noStyle shouldUpdate key={option.key}>
                      {({ getFieldValue, setFieldsValue }) => {
                        const isActive = getFieldValue('payment_method') === option.key;
                        return (
                          <div
                            onClick={() => setFieldsValue({ payment_method: option.key })}
                            style={{
                              border: isActive ? '2px solid #1677ff' : '1px solid #f0f0f0',
                              padding: '12px 15px',
                              borderRadius: 8,
                              marginBottom: 10,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              background: isActive ? '#e6f4ff' : '#fff',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Space>
                              <img src={option.img} alt={option.title} style={{ width: 40, height: 40 }} />
                              <div>
                                <div style={{ fontWeight: 'bold', fontSize: 13 }}>{option.title}</div>
                                <div style={{ fontSize: 11, color: '#999' }}>{option.desc}</div>
                              </div>
                            </Space>
                            <Radio value={option.key} checked={isActive} />
                          </div>
                        );
                      }}
                    </Form.Item>
                  ))}
                </Radio.Group>
              </Form.Item>
            </div>
          </Col>

          {/* 2. Right Side: Summary */}
          <Col xs={24} md={10}>
            <div
              style={{
                border: '1px dashed #d9d9d9',
                padding: 20,
                borderRadius: 12,
                background: '#fff',
              }}
            >
              <h3 style={{ fontWeight: 'bold', marginBottom: 20 }}>Summary</h3>

              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    color: '#555',
                  }}
                >
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  color: '#555',
                }}
              >
                <span>Delivery fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>

              <Divider style={{ borderStyle: 'dashed', margin: '15px 0' }} />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                <span>Total:</span>
                <span style={{ color: '#000' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              style={{
                background: '#141414',
                color: '#fff',
                marginTop: 20,
                height: 50,
                borderRadius: 8,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <CreditCardOutlined /> Purchase
            </Button>
          </Col>
        </Row>
      </Form>

      {/* ✅ QR Modal */}
      <Modal
        title={null}
        open={qrVisible}
        onCancel={() => setQrVisible(false)}
        footer={null}
        centered
        width={380}
        bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}
      >
        <div
          style={{
            background: '#fff',
            textAlign: 'center',
            padding: '30px 20px',
            borderRadius: 16,
          }}
        >
          {/* Header */}
          <h3 style={{ fontWeight: 'bold', marginBottom: 5 }}>
            Pay with {qrInfo.method?.toUpperCase()}
          </h3>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 20 }}>
            Please scan the QR code below to complete your payment.
          </p>

          {/* QR Section */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              background: '#fafafa',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Image
              src={qrInfo.qrUrl}
              width={220}
              height={300}
              preview={false}
              style={{
                border: '2px solid #e6e6e6',
                borderRadius: 12,
                background: '#fff',
                objectFit: 'cover',
                marginBottom: 10,
              }}
              fallback={QRCode}
            />
            <span style={{ fontSize: 12, color: '#999' }}>Scan using your mobile banking app</span>
          </div>

          {/* Payment Info */}
          <div
            style={{
              background: '#f9f9f9',
              padding: '10px 15px',
              borderRadius: 8,
              marginBottom: 20,
              textAlign: 'left',
            }}
          >
            <p style={{ marginBottom: 5 }}>
              <strong>Buyer:</strong> {formRef.getFieldValue('buyer_name') || '—'}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Total:</strong>{' '}
              <span style={{ color: '#1677ff', fontWeight: 'bold' }}>
                ${total.toFixed(2)}
              </span>
            </p>
          </div>

          {/* Upload Proof */}
          <div
            style={{
              background: '#f9f9f9',
              padding: 15,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleUploadChange}
              fileList={fileList}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Transaction Screenshot</Button>
            </Upload>
          </div>

          {/* Submit */}
          <Button
            type="primary"
            block
            style={{
              height: 45,
              borderRadius: 8,
              fontWeight: 'bold',
              background: '#141414',
            }}
            onClick={handleTransactionSubmit}
          >
            Submit Transaction
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default CheckoutPage;