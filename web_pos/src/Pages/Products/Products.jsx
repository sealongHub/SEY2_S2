import React, { useEffect, useState } from 'react'
import { Space, Input, Table, Tag, Button, Modal, Form, Select, message, Spin, Image, Row, Col, InputNumber } from 'antd';
import { CloseSquareFilled, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { request } from '../../util/request'
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/Config';
import StockInAction from '../Stockin/StockInAction';
const Products = () => {

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const [formRef] = Form.useForm();

  const [validate, setValidate] = useState({});

  const [filter, setFilter] = useState({
    text_search: null,
    status: null,
    category_id: null,
    brand_id: null
  })

  const [state, setState] = useState({
    list: [],
    brand: [],
    category: [],
    open: false,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      total: 0
    }
  })

  useEffect(() => {
    // ប្រសិនបើជាការ Load លើកដំបូង (អត់មាន Search) ឱ្យវាហៅ API ភ្លាមៗតែម្តង
    if (!filter.text_search && !filter.status && !filter.category_id && !filter.brand_id) {
      getLists();
      return;
    }

    // ប្រសិនបើកំពុង Search ទើបយើងប្រើ Delay 400ms
    const delay = setTimeout(() => {
      getLists();
    }, 400);

    return () => clearTimeout(delay);
  }, [filter]);

  const getLists = async (page = 1) => {
      setState(p => ({ ...p, loading: true }));

      const params = new URLSearchParams({
          page: page, // បញ្ជូនលេខទំព័រទៅ Laravel
          ...Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ''))
      });

      const res = await request('product?' + params.toString(), 'get');

      if (res && !res.errors) {
          setState(p => ({
              ...p,
              list: res.proList || [],
              category: res.category?.length > 0 ? res.category : p.category,
              brand: res.brand?.length > 0 ? res.brand : p.brand,
              pagination: res.pagination, // ត្រូវប្រាកដថា Backend ផ្ញើ pagination object មក
              loading: false
          }));
      } else {
          setState(p => ({ ...p, loading: false }));
      }
  }

  const handlePageChange = (page) => {
    getLists(page);
  }

  const openModal = () => {
    setState(p => ({ ...p, open: true }));
  }



  const closeModal = () => {
    setState(p => ({ ...p, open: false }));
    formRef.resetFields();
    setValidate({});
    setFileList([]);
  }
  //store data
  const onFinish = async (value) => {
    const formData = new FormData();
    formData.append('name', value.name);
    formData.append('code', value.code);
    
    // ✅ កែប្រែ៖ ការពារកុំឱ្យផ្ញើ 'undefined' ទៅកាន់ Laravel (មូលហេតុ Error 500)
    formData.append('description', value.description || ""); 
    
    formData.append('quantity', value.quantity || 0);
    formData.append('price', value.price);
    formData.append('category_id', value.category_id);
    formData.append('brand_id', value.brand_id);
    formData.append('status', value.status ? 1 : 0);

    // គ្រប់គ្រងរូបភាព
    if (value.image && value.image.file) {
      if (value.image.file.originFileObj) {
        formData.append("image", value.image.file.originFileObj);
      } 
      // បើលុបរូបភាពចេញ
      else if (value.image.file.status === "removed") {
        formData.append("image_remove", "true");
      }
    }

    let url = 'product';
    let method = "post";

    // ✅ កែប្រែ៖ ពិនិត្យ ID ឱ្យបានច្បាស់លាស់សម្រាប់ Update
    const id = formRef.getFieldValue('id');
    if (id) {
      url = `product/${id}`; // កែឱ្យទៅជា product/1
      formData.append('_method', 'put'); // បន្លំភ្នែក Laravel ឱ្យស្គាល់ជា PUT method
    }

    // ផ្ញើ Request
    const res = await request(url, method, formData);

    if (res && !res.errors) {
      message.success(res.message);
      closeModal();
      getLists();
    } else {
      setValidate(res.errors);
    }
  }

  //delete data
  const onDelete = async (data) => {
    Modal.confirm({
      title: "Delete",
      content: `Are you sure to delete this ${data.name} product?`,
      onOk: async () => {
        const res = await request('product/' + data.id, 'delete');

        if (res && !res.undifined) {
          message.success(res.message);
          getLists();
        }
      }
    });
  }

  const onEdit = (data) => {
    openModal();

    if (data.image) {
      const imageUrl = data.image.startsWith('http') ? data.image : Config.imgPath + data.image;
      
      setFileList([{
        uid: data.id,
        name: 'Product Image',
        status: 'done',
        url: imageUrl,
      }]);
    } else {
      setFileList([]);
    }

    formRef.setFieldsValue({
      ...data,
      id: data.id,
    });
  }

  const onFilter = () => {
    getLists();
  }

  const onClear = () => {
    setFilter({
      text_search: null,
      status: null,
      category_id: null,
      brand_id: null,
    });
  }

  return (
    <Spin spinning={state.loading}>
      <Space style={{ display: "flex", justifyContent: "space-between" }}>
        <Space>
          <div>Total Stock Inventory: {state.list.length}</div>
          <Input.Search
            placeholder="search"
            value={filter.text_search}
            onChange={(e) => setFilter(p => ({ ...p, text_search: e.target.value }))}
          />
          <Select
            placeholder="Status"
            style={{ width: 100 }}
            value={filter.status}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            onChange={(value) => setFilter(p => ({ ...p, status: value }))}
          />
          <Select
            placeholder="Categories"
            style={{ width: 120 }}
            value={filter.category_id}
            onChange={(e) => setFilter(p => ({ ...p, category_id: e }))}
            // បន្ថែម ?. ដើម្បីការពារ Error map លើ undefined
            options={state?.category?.map(item => ({
              label: item.name,
              value: item.id
            })) || []}
          />

          <Select
            placeholder="Brands"
            style={{ width: 100 }}
            value={filter.brand_id}
            // បន្ថែម ?. ដើម្បីការពារ Error map លើ undefined
            options={state?.brand?.map(item => ({
              label: item.name,
              value: item.id
            })) || []}
            onChange={(value) => setFilter(p => ({ ...p, brand_id: value }))}
          />
          <Button onClick={onClear}>Clear</Button>
          <Button type='primary' onClick={onFilter}>Filter</Button>
        </Space>

        {/* ផ្នែកប៊ូតុងសកម្មភាព (Actions) */}
        <Space>
          {/* ១. ហៅ StockInAction មកប្រើ និងបញ្ជូន function getLists ទៅ refresh data */}
          <StockInAction onRefresh={getLists} />

          {/* ២. ប៊ូតុង Add Product ដើមរបស់អ្នក */}
          <Button type='primary' onClick={openModal}>
            Add Product
          </Button>
        </Space>
      </Space>

      <Modal
        open={state.open}
        onCancel={closeModal}
        footer={null}
        title={formRef.getFieldValue('id') ? "Edit Product" : "Add Product"}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          form={formRef}
          initialValues={{ status: 1, quantity: 0 }} // កំណត់តម្លៃដើមឱ្យស្អាត
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input product name!' }]}
                {...validate.name}
              >
                <Input placeholder='Product Name' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please input product code!' }]}
                {...validate.code}
              >
                <Input placeholder='Product Code' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Quantity (Initial)"
                name="quantity"
                {...validate.quantity}
                extra="Optional: Set 0 if you will Stock In later"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='0'
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Unit Price ($)"
                name="price"
                rules={[{ required: true, message: 'Please input price!' }]}
                {...validate.price}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder='0.00'
                  min={0}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            {/* ... ផ្នែក Category, Brand, Status រក្សាទុកដដែល ... */}
            <Col span={8}>
              <Form.Item label="Category" name="category_id" {...validate.category_id}>
                <Select
                    placeholder="Select Category"
                    // បន្ថែម ?. និង default array []
                    options={state?.category?.map(item => ({ label: item.name, value: item.id })) || []}
                />
            </Form.Item>
            </Col>

            <Col span={8}>

              <Form.Item label="Brand" name="brand_id" {...validate.brand_id}>
                <Select
                    placeholder="Select Brand"
                    // បន្ថែម ?. និង default array []
                    options={state?.brand?.map(item => ({ label: item.name, value: item.id })) || []}
                />
            </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Status" name="status" {...validate.status}>
                <Select
                  placeholder="Select Status"
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" name="description" {...validate.description}>
                <Input.TextArea placeholder='Product Description' rows={3} />
              </Form.Item>
            </Col>

            <Col span={24} >
              <Form.Item name='image' label="Product Image">
                <Upload
                  listType="picture-card"
                  customRequest={(e) => e.onSuccess()}
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Space style={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              {formRef.getFieldValue('id') ? "Update Product" : "Save Product"}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        style={{ marginTop: 20 }}
        dataSource={state.list}
        rowKey="id"
        pagination={{
          current: state.pagination.current_page, // លេខទំព័របច្ចុប្បន្ន
          pageSize: 10,                           // ចំនួនជួរក្នុង ១ ទំព័រ
          total: state.pagination.total,         // ចំនួនសរុបដែល AntD ប្រើដើម្បីបង្កើតលេខទំព័រ
          onChange: (page) => {
            getLists(page); // ពេលចុចលេខទំព័រ ឱ្យវាទៅទាញទិន្នន័យទំព័រនោះមក
          },
          showSizeChanger: false,
        }}
        columns={[
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "image",
            title: "Image",
            dataIndex: "image",
            render: (value) => (
              // បង្ហាញរូបភាពដោយប្រើ URL ពី Cloudinary ផ្ទាល់តែម្តង
              value ? <Image width={50} src={value} fallback="https://via.placeholder.com/50?text=No+Image" /> : 'No Image'
            )
          },
          {
            key: "category",
            title: "Category",
            dataIndex: "category",
            render: (value) => value.name
          },
          {
            key: "brand",
            title: "Brand",
            dataIndex: "brand",
            render: (value) => value.name
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (value) => value ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
          }
          ,
          {
            key: "quantity",
            title: "Quantity",
            dataIndex: "quantity",
          }
          ,
          {
            key: "price",
            title: "Price",
            dataIndex: "price",
          }
          ,
          {
            key: "created_at",
            title: "Created At",
            dataIndex: "created_at",
            render: (value) => dayjs(value).format('DD-MM-YYYY A')
          }
          ,
          {
            key: "action",
            title: "Action",
            align: "right",
            render: (data) => (
              <Space>
                <Button type='primary' onClick={() => onEdit(data)}>Edit</Button>
                <Button type='primary' danger onClick={() => onDelete(data)}>Delete</Button>
              </Space>
            )
          }
        ]}
      />

    </Spin>
  )
}

export default Products;