import React, { useEffect, useState } from 'react'
import { Space, Input, Table, Tag, Button, Modal, Form, Select, message, Spin} from 'antd';
import { request } from '../../util/request'
import '@ant-design/v5-patch-for-react-19';
import dayjs from 'dayjs';

const Category = () => {

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

    const res = await request('category'+queryparams, 'get'); //localhost:8000/api/role?page=1&text_search=admin

    if(res){
      setState(p => ({
        ...p,
        list : res.cat,
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
  }
  //store data
  const onFinish = async (value) => {
    const data = {
      name : value.name,
      description : value.description,
      status : value.status
    }

    let url='category';
    let method="post";

    if(formRef.getFieldValue('id')){
      url +='/' + formRef.getFieldValue('id');
      method = "put";
    }

    const res = await request(url, method, data);

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
      content : `Are you sure to delete this ${data.name} Category?`,
      onOk : async () => {
        const res = await request('category/'+data.id, 'delete');

        if(res && !res.undifined){
          message.success(res.message);
          getLists();
        }
      }
    });
  }

  const onEdit = (data) => {
    openModal();
    formRef.setFieldsValue({
      name : data.name,
      code : data.code,
      description : data.description,
      status : data.status,
      id : data.id
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
          <div>Total Category: {state.list.length}</div>
          <Input.Search placeholder="search" value={filter.text_search}  allowClear onChange={(e) => setFilter(p=>({...p,text_search:e.target.value}))}/>
          <Select
            placeholder="Status"
            style={{width:100}}
            allowClear
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
        
        <Button type='primary' onClick={openModal}>Add Category</Button>
      </Space>

      <Modal
        open={state.open}
        onCancel={closeModal}
        footer={null}
        title={formRef.getFieldValue('id')? "Edit Category" : "Add Category"}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Form.Item label="Name" name="name" {...validate.name}>
            <Input placeholder='Category Name'/>
          </Form.Item>

          <Form.Item label="Description" name="description" {...validate.description}>
            <Input placeholder='Category Description'/>
          </Form.Item>

          <Form.Item label="Status" name="status" {...validate.status}>
            <Select
              placeholder="Select Status"
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
            />
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
            key : "description",
            title : "Description",
            dataIndex : "description",
          },
          {
            key : "status",
            title : "Status",
            dataIndex : "status",
            render : (value) => value == 'active' ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
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

export default Category;