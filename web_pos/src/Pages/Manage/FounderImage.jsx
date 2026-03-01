import React, { useEffect, useState } from 'react'
import { Space, Input, Table, Tag, Button, Modal, Form, Select, message, Spin, Image} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {Upload } from 'antd';
import { request } from '../../util/request'
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';
import Config from '../../util/Config';

const FounderImage = () => {

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

    const res = await request('founderimage', 'get'); //localhost:8000/api/role?page=1&text_search=admin

    if(res){
      setState(p => ({
        ...p,
        list : res.founderImageList,
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
  
      let url='founderimage';
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
      content : `Are you sure to delete this ${data.title} Founder Image?`,
      onOk : async () => {
        const res = await request('founderimage/'+data.id, 'delete');

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
        status: 'done', // ប្រាប់ Ant Design ថាជារូបភាពដែលមានស្រាប់
        url: Config.imgPath + data.image,
        originFileObj: null, // មិនមែនជា File ថ្មីដែលទើប Upload
      }]);
    }
    else{
      setFileList([]);
    }

    formRef.setFieldsValue({
      ...data,
      id : data.id,
      // កុំភ្លេចកំណត់តម្លៃរូបភាពទៅក្នុង Form ប្រសិនបើប្រើ Form.Item name="image"
      image: data.image ? { file: { status: 'done', url: data.image } } : null 
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
          <div>Total Founder Images: {state.list.length}</div>
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
        
        <Button type='primary' onClick={openModal}>Add Founder Image</Button>
      </Space>

      <Modal
        open={state.open}
        onCancel={closeModal}
        footer={null}
        title={formRef.getFieldValue('id')? "Edit Founder Image" : "Add Founder Image"}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Form.Item label="Title" name="title" {...validate.title}>
            <Input placeholder='Founder Image Title'/>
          </Form.Item>


          <Form.Item label="Description" name="description" {...validate.description}>
            <Input placeholder='Founder Image Description'/>
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
            key : "title",
            title : "Title",
            dataIndex : "title",
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

export default FounderImage;

// http://localhost:8080/SEY2_S2/laravel-api/public/storage/brands/S7HFIPBloQjyz2abAExcQLRgKs0Bmp63umQXFrXA.png
// http://localhost:8080/Course/Laravel_React/laravel-api/public/storage/brands/S7HFIPBloQjyz2abAExcQLRgKs0Bmp63umQXFrXA.png