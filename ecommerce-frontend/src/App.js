import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';
import Orders from './components/Orders';
import OrderDetail from './components/OrderDetail';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import api from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Check for login status and load cart on startup
  useEffect(() => {
    // Check for saved login state
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    
    // Check for saved cart items
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Load products
    loadProducts();
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Load products from API
  const loadProducts = async () => {
    try {
      // In a real application, this would use api.getProducts()
      // For now, we'll use mock data
      const mockProducts = [
        { id: 1, name: "Mechanical Keyboard", description: "Mechanical keyboard with RGB lighting", price: 99.99, availableQuantity: 10, categoryName: "Keyboards" },
        { id: 2, name: "Wireless Mouse", description: "Wireless gaming mouse with customizable RGB lighting", price: 59.99, availableQuantity: 15, categoryName: "Mice" },
        { id: 3, name: "4K Monitor", description: "27-inch IPS monitor with 4K resolution", price: 399.99, availableQuantity: 5, categoryName: "Monitors" },
        { id: 4, name: "Gaming Headset", description: "Surround sound gaming headset with noise cancellation", price: 129.99, availableQuantity: 8, categoryName: "Accessories" },
        { id: 5, name: "Laptop Stand", description: "Adjustable laptop stand with cooling fan", price: 34.99, availableQuantity: 20, categoryName: "Accessories" },
        { id: 6, name: "Vertical Mouse", description: "Ergonomic vertical mouse for reduced strain", price: 39.99, availableQuantity: 12, categoryName: "Mice" }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };
  
  // Load user orders from API
  const loadOrders = async () => {
    if (!isLoggedIn) return;
    
    try {
      // In a real application, this would use api.getOrders()
      // For now, we'll use mock data
      const mockOrders = [
        {
          id: 1,
          reference: "ORD-1001",
          date: "2025-04-25T14:30:00",
          totalAmount: 299.97,
          status: "Completed",
          items: [
            { productId: 1, name: "Mechanical Keyboard", price: 99.99, quantity: 1 },
            { productId: 2, name: "Wireless Mouse", price: 59.99, quantity: 2 },
            { productId: 5, name: "Laptop Stand", price: 79.99, quantity: 1 }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };
  
  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      
      if (existingProduct) {
        // Update quantity of existing product
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    // Load orders after login
    loadOrders();
  };
  
  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setOrders([]);
  };
  
  // Place order
  const placeOrder = async (orderData) => {
    try {
      // In a real application, this would use api.createOrder(orderData)
      // For now, we'll simulate order creation
      const orderId = Math.floor(Math.random() * 10000);
      const newOrder = {
        id: orderId,
        reference: `ORD-${orderId}`,
        date: new Date().toISOString(),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: "Completed",
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      clearCart();
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };
  
  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <nav className="nav">
              <Link to="/" className="logo">ShopMicro</Link>
              
              <div className="nav-links">
                <Link to="/" className="nav-link">Products</Link>
                {isLoggedIn && (
                  <Link to="/orders" className="nav-link">My Orders</Link>
                )}
              </div>
              
              <div className="nav-links">
                <Link to="/cart" className="nav-link cart-icon">
                  <ShoppingCart size={20} />
                  {totalItems > 0 && (
                    <span className="cart-count">{totalItems}</span>
                  )}
                </Link>
                
                {isLoggedIn ? (
                  <div className="nav-link">
                    <Link to="/profile" className="nav-link">
                      <User size={20} />
                      <span className="ml-2">{user?.firstname}</span>
                    </Link>
                    <button onClick={handleLogout} className="btn btn-secondary ml-2">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="nav-link">
                    <User size={20} />
                    <span className="ml-2">Login</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </header>
        
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList products={products} addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail products={products} addToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateCartItemQuantity={updateCartItemQuantity} />} />
            <Route path="/checkout" element={<Checkout cart={cart} user={user} isLoggedIn={isLoggedIn} placeOrder={placeOrder} />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess orders={orders} />} />
            <Route path="/orders" element={<Orders orders={orders} isLoggedIn={isLoggedIn} />} />
            <Route path="/order/:id" element={<OrderDetail orders={orders} />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
            <Route path="/register" element={<Register handleLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile user={user} isLoggedIn={isLoggedIn} />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 ShopMicro. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;