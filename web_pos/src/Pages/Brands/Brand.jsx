import React, { useEffect, useState } from 'react'
import { Space, Input, Table, Tag, Button, Modal, Form, Select, message, Spin, Image} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {Upload } from 'antd';
import { request } from '../../util/request'
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/Config';

const Brand = () => {

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
    text_search : null,
    status : null
  })

  const [state, setState] = useState({
    list:[],
    open: false,
    loading: false
  })

  useEffect(() => {
    // getLists();
    const delay = setTimeout(() => {
      getLists();
    }, 100);

    return () => clearTimeout(delay);
  },[filter]);
  
  const getLists = async () => {
    setState(p => ({...p, loading: true}));

    let queryparams = "?page=1";

    if(filter.text_search !== null && filter.text_search !== ''){
      queryparams += "&text_search=" + filter.text_search;
    }

    if(filter.status !== null && filter.status !== ''){
      queryparams += "&status=" + filter.status;
    }

    const res = await request('brand'+queryparams, 'get'); //localhost:8000/api/role?page=1&text_search=admin

    if(res){
      setState(p => ({
        ...p,
        list : res.brandList,
        loading: false
      }));
    }
  }

  const openModal = () => {
    setState(p => ({...p, open: true}));
  }

  const closeModal = () => {
    setState(p => ({...p, open: false}));
    formRef.resetFields();
    setValidate({});
    setFileList([]);
  }
  //store data
  const onFinish = async (value) => {
    const formData = new FormData();
    formData.append('name', value.name);
    formData.append('code', value.code);
    formData.append('description', value.description);
    formData.append('status', value.status);
    
    if(value.image && value.image.file){
      if(value.image.file.originFileObj){
        formData.append('image', value.image.file.originFileObj);
      }
      else if(value.image.file.status == "removed"){
        let image_remove = value.image.file;
        formData.append('image_remove', image_remove);
      }
    }

    console.log(value);

    let url='brand';
    let method="post";

    if(formRef.getFieldValue('id')){
      url +='/' + formRef.getFieldValue('id');
      formData.append('_method', 'put');
    }

    const res = await request(url, method, formData);

    if(res && !res.errors){
      message.success(res.message);
      closeModal();
      getLists();
    }
    else{
      setValidate(res.errors);
    }
  }

  //delete data
  const onDelete = async (data) => {
    Modal.confirm({
      title : "Delete",
      content : `Are you sure to delete this ${data.name} Brand?`,
      onOk : async () => {
        const res = await request('brand/'+data.id, 'delete');

        if(res && !res.undifined){
          message.success(res.message);
          getLists();
        }
      }
    });
  }

  const onEdit = (data) => {
    openModal();

    if(data.image){
      setFileList([{
        uid: data.id,
        name: data.image,
        status: 'done',
        url: Config.imgPath + data.image,
      }]);
    }
    else{
      setFileList([]);
    }

    formRef.setFieldsValue({
      ...data,
      id : data.id,
    })
  }

  const onFilter = () => {
    getLists();
  }

  const onClear = () => {
    setFilter({
      text_search : null,
      status : null
    });
  }

  return (
    <Spin spinning={state.loading}>
      <Space style={{display:"flex", justifyContent:"space-between"}}>
        <Space>
          <div>Total Brands: {state.list.length}</div>
          <Input.Search placeholder="search" value={filter.text_search} onChange={(e) => setFilter(p=>({...p,text_search:e.target.value}))}/>
          <Select
            placeholder="Status"
            style={{width:100}}
            value={filter.status}
            options={[
              {
                label : 'Active',
                value : 'active'
              },
              {
                label : 'Inactive',
                value : 'inactive'
              }
            ]}
            onChange={(value) => setFilter(p=>({...p,status:value}))}
          />
          <Button onClick={onClear}>Clear</Button>
          <Button type='primary' onClick={onFilter}>Filter</Button>
        </Space>
        
        <Button type='primary' onClick={openModal}>Add Brand</Button>
      </Space>

      <Modal
        open={state.open}
        onCancel={closeModal}
        footer={null}
        title={formRef.getFieldValue('id')? "Edit Brand" : "Add Brand"}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Form.Item label="Name" name="name" {...validate.name}>
            <Input placeholder='Brand Name'/>
          </Form.Item>

          <Form.Item label="Code" name="code" {...validate.code}>
            <Input placeholder='Brand Code'/>
          </Form.Item>

          <Form.Item label="Description" name="description" {...validate.description}>
            <Input placeholder='Brand Description'/>
          </Form.Item>

          <Form.Item label="Status" name="status" {...validate.status}>
            <Select
              placeholder="Select Status"
              options={[
                {
                  label : 'Active',
                  value : 'active',
                },
                {
                  label : 'Inactive',
                  value : 'inactive',
                }
              ]}
            />
          </Form.Item>

          <Form.Item name='image'>
            <Upload
              listType="picture-card"
              customRequest={(e) => (
                e.onSuccess()
              )}
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length ==1 ? null : uploadButton}
            </Upload>
            
          </Form.Item>

          <Space style={{display:"flex", justifyContent:"end"}}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type='primary' htmlType='submit'>
              {formRef.getFieldValue('id') ? "Edit" : "Save"}
            </Button>
          </Space>
        </Form>
      </Modal>

      <Table
        style={{marginTop:20}}
        dataSource={state.list}
        columns={[
          {
            key : "name",
            title : "Name",
            dataIndex : "name",
          },
          {
            key : "code",
            title : "Code",
            dataIndex : "code",
          },
          {
            key : "image",
            title : "Logo",
            dataIndex : "image",
            render : (value) => (
              value ? <Image width={50} src={Config.imgPath+value} /> : 'No Image'
            )
          },
          {
            key : "description",
            title : "Description",
            dataIndex : "description",
          },
          {
            key : "status",
            title : "Status",
            dataIndex : "status",
            render : (value) => value === "active" ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
          }
          ,
          {
            key : "created_at",
            title : "Created At",
            dataIndex : "created_at",
            render : (value) => dayjs(value).format('DD-MM-YYYY A')
          }
          ,
          {
            key : "action",
            title : "Action",
            align : "right",
            render : (data) => (
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

export default Brand;

// http://localhost:8080/SEY2_S2/laravel-api/public/storage/brands/S7HFIPBloQjyz2abAExcQLRgKs0Bmp63umQXFrXA.png
// http://localhost:8080/Course/Laravel_React/laravel-api/public/storage/brands/S7HFIPBloQjyz2abAExcQLRgKs0Bmp63umQXFrXA.png