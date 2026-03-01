import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Minus, Plus, Trash2, CreditCard } from 'lucide-react';

const ShopInterface = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data from Laravel API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Adjust URL to your Laravel backend address
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data.proList);
                setCategories(response.data.category);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Cart Logic
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(item => 
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const deliveryFee = subtotal > 40 ? 0 : 1.5;

    if (loading) return <div className="text-center p-10">Loading Pich Pisey Shop...</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-serif font-bold italic">Pich Pisey Shop</h1>
                <div className="relative">
                    <ShoppingBag className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                    </span>
                </div>
            </header>

            {/* Promo Bar */}
            <div className="bg-gray-600 text-white text-center py-2 text-sm">
                Free deliveries on orders over $40
            </div>

            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Product Grid (Left 2 Columns) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
                            <div className="h-64 bg-gray-100 flex items-center justify-center p-4">
                                <img 
                                    src={`http://localhost:8000/storage/${product.image}`} 
                                    alt={product.name}
                                    className="max-h-full object-contain"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <span className="font-bold text-gray-600">${product.price}</span>
                                </div>
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-gray-700 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-900 transition"
                                >
                                    <ShoppingBag size={18} /> Add to Bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shopping Bag & Checkout (Right Column) */}
                <div className="bg-white p-6 rounded-lg shadow-sm border h-fit sticky top-24">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag size={20} /> Shopping Bag
                    </h2>

                    {cart.map(item => (
                        <div key={item.id} className="flex gap-4 mb-4 border-b pb-4">
                            <img src={`http://localhost:8000/storage/${item.image}`} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-medium">{item.name}</p>
                                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))}>
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <button onClick={() => updateQty(item.id, -1)} className="border p-1 rounded"><Minus size={12}/></button>
                                    <span>{item.qty}</span>
                                    <button onClick={() => updateQty(item.id, 1)} className="border p-1 rounded"><Plus size={12}/></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Delivery fee</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>${(subtotal + deliveryFee).toFixed(2)}</span>
                        </div>
                    </div>

                    <button className="w-full bg-black text-white mt-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                        <CreditCard size={18} /> Purchase
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ShopInterface;