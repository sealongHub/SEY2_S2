import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './Pages/Home/HomePage';
import Products from './Pages/Products/Products';
import Brand from './Pages/Brands/Brand';
import Category from './Pages/Category/Category';
import MasterPage from './Pages/Layouts/MasterPage';
import RolePage from './Pages/Role/RolePage';
import RouteNotFound from './Pages/Errors/RouteNotFound';
import ProductCard from './Pages/Products/ProductCard';
import RoleStatic from './Pages/Role/RoleStatic';
import UserLayout from './Pages/Layouts/UserLayout';
import CheckoutPage from './Pages/UsersInterface/CheckoutPage';
import FounderImage from './Pages/manage/FounderImage';
import Provinces from './Pages/provinces/Provinces';
import StockInAction from './Pages/Stockin/StockInAction';
import StockHistory from './Pages/StockLog/StockHistory';
import SupplierPage from './Pages/Supplier/SupplierPage';
import OrderPage from './Pages/Orders/OrderPage';

function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        {/* Admin/Dashboard Section */}
        <Route element={<MasterPage />}>
          <Route path='/dashboard' element={<HomePage />} />
          <Route path='/role' element={<RolePage />} />
          <Route path='/products' element={<Products />} />
          <Route path='/brand' element={<Brand />} />
          <Route path='/category' element={<Category />} />
          <Route path='/rolestatic' element={<RoleStatic />} />
          <Route path='/founder' element={<FounderImage />} />
          <Route path='/provinces' element={<Provinces />} />
          <Route path='/stockin' element={<StockInAction />} />
          <Route path='/stock-transaction' element={<StockHistory />} />
          <Route path='/supplier' element={<SupplierPage />} />
          <Route path='/orders' element={<OrderPage />} /> 
        </Route>

        {/* Shopping/User Section - MOVED INSIDE <Routes> */}
        <Route element={<UserLayout />}>
          <Route index element={<ProductCard />} />
          <Route path='/checkout' element={<CheckoutPage />} /> Add this for your checkout screen
        </Route>

        {/* Catch-all for 404 */}
        <Route path='*' element={<RouteNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
