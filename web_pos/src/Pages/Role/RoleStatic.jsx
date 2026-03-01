// import {Button, Space, Input, message, Modal} from "antd";
// import { useState } from "react";

// const RoleStatic = () =>{

//     //object state
//     const [state, setState] = useState({
//         list:[],
//         // total:[],
//         loading:false
//     })

//     const [objRole, setObjRole] = useState({
//         id: "",
//         name: "",
//         dpt: ""
//     });

//     const [idEdit, setIdEdit] = useState(null);

//     const onSave = () => {
//         setState(p=> ({
//             ...p,
//             list:[...p.list, objRole]
//         }))

//         setObjRole(p=>({
//             ...p,
//             id: "",
//             name: "",
//             dpt: ""
//         }))
//     }

//     // const onSave = () => {
//     //     if(objRole.id == ""){
//     //         message.warning("Please Field in ID");
//     //         return;
//     //     }
//     //     else if(objRole.name == ""){
//     //         message.warning("Please Field in Name");
//     //         return;
//     //     }
//     //     else if(objRole.dpt == ""){
//     //         message.warning("Please Field in Department");
//     //         return;
//     //     }

//     //     if(idEdit == null){
//     //         const FoundID = state.list.findIndex((item)=>item.id == objRole.id) //return 0,1,2,3,-1

//     //         if(FoundID != -1){
//     //             message.warning("Id Already Exits");
//     //             return;
//     //         }

//     //         setState(p=>({
//     //             list:[...p.list, objRole]
//     //         }))

//     //         setObjRole(p=>({
//     //             ...p,
//     //             id: "",
//     //             name: "",
//     //             dpt: ""
//     //         }))
//     //         message.success("Insert Successfully");
//     //     }
//     //     else{
//     //         //edit

//     //         const updateById = state.list.findIndex((item)=>item.id == idEdit)

//     //         if(updateById != -1){
//     //             const newData = [...state.list];
//     //             newData[updateById].name = objRole.name;
//     //             newData[updateById].dpt = objRole.dpt;

//     //             setState(p=>({
//     //                 ...p,
//     //                 list: newData
//     //             }))
//     //             setObjRole(p=>({
//     //                 ...p,
//     //                 id: "",
//     //                 name: "",
//     //                 dpt: ""
//     //             }))
//     //             message.success("Update Successfully");

//     //             setIdEdit(null)
//     //         }
//     //     }
//     // }

//     const onUpdate = (item) => {
//         setIdEdit(item.id)
//         setObjRole(p=>({
//             ...p,
//             ...item
//         }))
//     }

//     // const onDelete = (item) => {

//     //     Modal.confirm({
//     //         title: "Delete",
//     //         content: "Are you sure want to delete this Record ?",

//     //         onOk:()=>{
//     //             const deleteById = state.list.filter((data)=>data.id != item.id)

//     //             setState(p=>({
//     //                 ...p,
//     //                 list: deleteById
//     //             }))
//     //             message.success("Delete Successfully");
//     //             }
//     //         })
//     // }

//     const onDelete = (item) => {
//         const deletebyId = state.list.filter(((data) => data.id != item.id));

//         setState(p=>({
//             ...p,
//             list:deletebyId
//         }))
//     }

//     const onCancel = () => {
//         setObjRole(p=>({
//             ...p,
//             id: "",
//             name: "",
//             dpt: ""
//         }))
//     }


//     return(
//         <div>
//             <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
//                 <div>Role Total: {state.list.length}</div>
//                 <div>
//                     <Button type="primary">New</Button>
//                 </div>
//             </div>

//             <div>
//                 <Space>
//                     <Input disabled={idEdit?true:false} placeholder="ID" allowClear value={objRole.id} onChange={(e) => setObjRole(p=>({...p ,id: e.target.value}))}/>
//                     <Input placeholder="Name" allowClear value={objRole.name} onChange={(e) => setObjRole(p=>({...p, name: e.target.value}))} />
//                     <Input placeholder="Department" allowClear value={objRole.dpt} onChange={(e)=> setObjRole((p=>({...p, dpt: e.target.value})))}/>

//                     <Button onClick={onCancel}>Cancel</Button>
//                     <Button type="primary" onClick={onSave}>
//                         {idEdit?"Update":"Save"}
//                     </Button>
//                 </Space>
//             </div>

//             <div>
//                 {state.list.length == 0 && <div style={{marginTop:30, fontSize:16, textAlign:"center"}}>
//                     No Record
//                 </div>}
//                 {state.list.map((item, index)=> (
//                     <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", backgroundColor:"#eeeeee", padding:20, marginTop:10, borderRadius:10}}>
//                         <Space>
//                         <div style={{backgroundColor:"gray", width:50, height:50, borderRadius:30}}></div>
//                         <div key={index}>
//                             <Space>
//                                 <div>{item.id}</div>
//                                 <div>{item.name}</div>
//                             </Space>

//                             <div>{item.dpt}</div>
//                         </div>
//                         </Space>

//                         <div>
//                             <Space>
//                                 <Button type="primary" onClick={()=> onUpdate(item)}>Edit</Button>
//                                 <Button danger type="primary" onClick={()=>onDelete(item,index)}>Delete</Button>
//                             </Space>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }
// export default RoleStatic;

import React, { useState } from 'react';
import { Space, Button, Modal, Input, Form } from 'antd';
import FormItem from 'antd/es/form/FormItem';

const RoleStatic = () => {

    const [formRef] = Form.useForm()

    const [state, setState] = useState({
        list: [],
        modal: false
    })

    const onVisible = () => {
        setState(p => ({ ...p, modal: true }))
    }

    const closeModal = () => {
        setState(p => ({ ...p, modal: false }))
        formRef.resetFields();
    }

    const [objstu, setObjStu] = useState({
        id: "1",
        name: "Lee ",
        major:"SE"
    })

    const onSave = () => {
        setState(p=>({
            ...p,
            list: [...p.list, objstu]
        }))

        closeModal();
    }

    return (
        <div>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Students Total: 10</div>
                <div>
                    <Button type="primary" onClick={onVisible}>New</Button>
                </div>
            </Space>

            <Modal
                title="Add Student"
                open={state.modal}
                onCancel={closeModal}
                footer={null}
            >
                <Form layout='vertical' form={formRef}>
                    <FormItem name="id" label="Student Id">
                        <Input placeholder='Student Id' onChange={(e) => setObjStu(p=>({...p, id:e.target.value}))}/>
                    </FormItem>

                    <FormItem name="name" label="Student Name">
                        <Input placeholder='Student Name' onChange={(e) => setObjStu(p=>({...p, name:e.target.value}))} />
                    </FormItem>

                    <FormItem name="major" label="Student Major">
                        <Input placeholder='Student Major' onChange={(e) => setObjStu(p=>({...p, major:e.target.value}))}/>
                    </FormItem>

                    <div style={{ textAlign: "right" }}>
                        <Space >
                            <Button onClick={closeModal}>Cancel</Button>
                            <Button type='primary' onClick={onSave}>Save</Button>
                        </Space>
                    </div>
                </Form>
            </Modal>

            {/* content of data */}

            {state.list.length === 0 && <div style={{textAlign:"center"}}><h2>No Records</h2></div>}
            {state.list.map((item, index) => (
                <div key={index} style={{ backgroundColor: "#ccc", padding: 20, marginTop: 20, borderRadius: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Space>
                            <div style={{ backgroundColor: "gray", borderRadius: 50, width: "50px", height: "50px" }}></div>
                            <div>{item.id}</div>
                            <div>{item.name}</div>
                            <div>{item.major}</div>
                        </Space>
                        <Space>
                            <Button type='primary'>Edit</Button>
                            <Button type='primary' danger>Delete</Button>
                        </Space>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default RoleStatic