import React, { useEffect, useState } from "react";
import { Row, Col, Button, Image, Typography, Space, Badge, Tag, Divider, Spin } from "antd";
import { ShoppingOutlined, MinusOutlined, PlusOutlined, ArrowRightOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { request } from "../../util/request";
import Config from "../../util/Config";
import { cartStore } from "../../Store/productCardStore";

const { Text, Title } = Typography;

const ProductCard = () => {
  // Updated state to hold the full object from your backend
  const [data, setData] = useState({ proList: [], category: [], brand: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cart, addToCart, decreaseQty } = cartStore();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    const res = await request("product?page=1", "get");
    if (res) {
      // Store the entire response containing proList and category
      setData(res);
    }
    setLoading(false);
  };

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading Shop..." />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f4f4f4", minHeight: "100vh", paddingBottom: 120 }}>
      {/* 1. Promo Bar */}
      <div style={{ background: "#000", color: "#fff", textAlign: "center", padding: "10px 0", fontSize: "11px", letterSpacing: "1px" }}>
        FREE DELIVERY ON ALL ORDERS OVER $40
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 20px" }}>
        
        {/* Loop through categories from backend */}
        {data.category.map((cat) => {
          // Filter products that belong to this category ID
          const categoryProducts = data.proList.filter(p => p.category_id === cat.id);

          // Hide the category section if it has no products
          if (categoryProducts.length === 0) return null;

          return (
            <div key={cat.id}>
              {/* Category Header */}
              <div style={{ marginBottom: "20px", borderLeft: "4px solid #000", paddingLeft: "15px" }}>
                <Title level={2} style={{ margin: 0, textTransform: 'uppercase', fontWeight: '800' }}>
                  {cat.name}
                </Title>
                {/* <Text type="secondary">{categoryProducts.length} Products Found</Text> */}
              </div>

              <Row gutter={[16, 24]}>
                {categoryProducts.map((pro) => {
                  const cartItem = cart.find((i) => i.id === pro.id);
                  const isOutOfStock = pro.quantity <= 0;

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={pro.id}>
                      <div style={{ 
                        background: "#fff", 
                        borderRadius: "12px", 
                        border: "1px solid #e8e8e8",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        height: "100%",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
                      }}
                      onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                      }}
                      >
                        {/* --- IMAGE SECTION --- */}
                        <div style={{ 
                          background: "#fff", 
                          height: "240px", 
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "20px",
                          position: "relative",
                          borderBottom: "1px solid #f0f0f0"
                        }}>
                          <Image
                            src={Config.imgPath + pro.image}
                            preview={false}
                            style={{ maxHeight: "180px", width: "100%", objectFit: "contain" }}
                          />
                          
                          <div style={{ position: "absolute", top: 12, left: 12 }}>
                            {isOutOfStock ? (
                              <Tag color="default" style={{ borderRadius: "4px", margin: 0 }}>Out of Stock</Tag>
                            ) : (
                              <Tag color="success" icon={<CheckCircleFilled />} style={{ borderRadius: "4px", margin: 0 }}>
                                In Stock
                              </Tag>
                            )}
                          </div>
                        </div>

                        {/* --- CONTENT SECTION --- */}
                        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                          <div style={{ marginBottom: "12px" }}>
                            <Title level={5} style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "16px", lineHeight: "1.4" }}>
                              {pro.name}
                            </Title>
                            <Text style={{ fontSize: "18px", fontWeight: "800", color: "#000" }}>
                              ${pro.price}
                            </Text>
                          </div>

                          <div style={{ marginTop: "auto" }}>
                            {cartItem ? (
                              <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between", 
                                background: "#f5f5f5", 
                                borderRadius: "8px", 
                                padding: "6px"
                              }}>
                                <Button type="text" shape="circle" icon={<MinusOutlined />} onClick={() => decreaseQty(pro.id)} />
                                <Text strong>{cartItem.qty}</Text>
                                <Button type="text" shape="circle" icon={<PlusOutlined />} onClick={() => addToCart(pro)} />
                              </div>
                            ) : (
                              <Button
                                block
                                size="large"
                                disabled={isOutOfStock}
                                style={{ 
                                  borderRadius: "8px", 
                                  fontWeight: "600", 
                                  background: isOutOfStock ? "#d9d9d9" : "#000", 
                                  color: "#fff",
                                  border: "none",
                                  height: "44px"
                                }}
                                onClick={() => addToCart(pro)}
                              >
                                {isOutOfStock ? "Unavailable" : "Add to Bag"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              <Divider />
            </div>
          );
        })}
      </div>

      {/* --- FLOATING CART ISLAND --- */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "420px", zIndex: 1000 }}>
          <div 
            onClick={() => navigate("/checkout")}
            style={{
              background: "#1a1a1a", padding: "14px 24px", borderRadius: "100px", 
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
              boxShadow: "0 15px 30px rgba(0,0,0,0.3)"
            }}
          >
            <Space size="middle">
              <Badge count={totalQty} color="#fff" style={{ color: '#000' }}>
                <ShoppingOutlined style={{ fontSize: "22px", color: "#fff" }} />
              </Badge>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Checkout</Text>
            </Space>
            <Space>
              <Text style={{ color: "#fff", fontSize: "18px", fontWeight: "700" }}>${totalPrice.toFixed(2)}</Text>
              <ArrowRightOutlined style={{ color: "#fff" }} />
            </Space>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;



// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Row,
//   Col,
//   Button,
//   Modal,
//   Space,
//   Badge,
//   Image,
//   Spin,
//   message,
//   Divider,
// } from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
// import { request } from "../../util/request";
// import Config from "../../util/Config";

// const ProductCard = () => {
//   const [loading, setLoading] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [cartVisible, setCartVisible] = useState(false);

//   // Fetch product list
//   useEffect(() => {
//     getProducts();
//   }, []);

//   const getProducts = async () => {
//     setLoading(true);
//     const res = await request("product?page=1", "get");
//     if (res && !res.errors) {
//       setProducts(res.proList)
//     }
//     setLoading(false);
//   };

//   // Add to cart
//   const addToCart = (product) => {
//     const exists = cart.find((item) => item.id === product.id);
//     if (exists) {
//       const updated = cart.map((item) =>
//         item.id === product.id
//           ? { ...item, qty: item.qty + 1 }
//           : item
//       );
//       setCart(updated);
//     } else {
//       setCart([...cart, { ...product, qty: 1 }]);
//     }
//     message.success(`${product.name} added to cart`);
//   };

//   // Remove item from cart
//   const removeFromCart = (id) => {
//     setCart(cart.filter((item) => item.id !== id));
//   };

//   // Calculate totals
//   const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
//   const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

//   return (
//     <Spin spinning={loading}>
//       <div style={{ padding: "20px" }}>
//         <Space
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 20,
//           }}
//         >
//           <h2>🛍️ Product Store</h2>
//           <Badge count={totalQty} offset={[10, 0]}>
//             <Button
//               type="primary"
//               icon={<ShoppingCartOutlined />}
//               onClick={() => setCartVisible(true)}
//             >
//               Cart
//             </Button>
//           </Badge>
//         </Space>

//         {/* Product Grid */}
//         <Row gutter={[16, 16]}>
//           {products.map((item) => (
//             <Col
//               key={item.id}
//               xs={24}
//               sm={12}
//               md={8}
//               lg={6}
//               xl={6}
//             >
//               <Card
//                 hoverable
//                 cover={
//                   <Image
//                     height={180}
//                     src={
//                       item.image
//                         ? Config.imgPath + item.image
//                         : "https://via.placeholder.com/200x150?text=No+Image"
//                     }
//                     preview={false}
//                   />
//                 }
//               >
//                 <h3>{item.name}</h3>
//                 <p style={{ color: "#888" }}>{item.category?.name}</p>
//                 <h4 style={{ color: "#1890ff" }}>${item.price}</h4>
//                 <Button
//                   type="primary"
//                   block
//                   onClick={() => addToCart(item)}
//                 >
//                   Add to Cart
//                 </Button>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         {/* Cart Modal */}
//         <Modal
//           title="🛒 Shopping Cart"
//           open={cartVisible}
//           onCancel={() => setCartVisible(false)}
//           footer={[
//             <Button key="close" onClick={() => setCartVisible(false)}>
//               Close
//             </Button>,
//             <Button key="checkout" type="primary">
//               Checkout (${totalPrice.toFixed(2)})
//             </Button>,
//           ]}
//         >
//           {cart.length === 0 ? (<p>Your cart is empty.</p>) : (<>
//               {cart.map((item) => (
//                 <div
//                   key={item.id}
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 10,
//                     borderBottom: "1px solid #eee",
//                     paddingBottom: 10,
//                   }}
//                 >
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <Image
//                       src={
//                         item.image
//                           ? Config.imgPath + item.image
//                           : "https://via.placeholder.com/50"
//                       }
//                       width={50}
//                       height={50}
//                       style={{ marginRight: 10 }}
//                       preview={false}
//                     />
//                     <div>
//                       <strong>{item.name}</strong>
//                       <div style={{ fontSize: 12, color: "#888" }}>
//                         ${item.price} × {item.qty}
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <Button
//                       size="small"
//                       onClick={() =>
//                         setCart(
//                           cart.map((c) =>
//                             c.id === item.id && c.qty > 1
//                               ? { ...c, qty: c.qty - 1 }
//                               : c
//                           )
//                         )
//                       }
//                     >
//                       -
//                     </Button>
//                     <span style={{ margin: "0 10px" }}>{item.qty}</span>
//                     <Button
//                       size="small"
//                       onClick={() =>
//                         setCart(
//                           cart.map((c) =>
//                             c.id === item.id
//                               ? { ...c, qty: c.qty + 1 }
//                               : c
//                           )
//                         )
//                       }
//                     >
//                       +
//                     </Button>
//                     <Button
//                       type="text"
//                       danger
//                       size="small"
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               ))}

//               <Divider />
//               <div style={{ textAlign: "right", fontWeight: "bold" }}>
//                 Total: ${totalPrice.toFixed(2)}
//               </div>
//             </>
//           )}
//         </Modal>
//       </div>
//     </Spin>
//   );
// };

// export default ProductCard;