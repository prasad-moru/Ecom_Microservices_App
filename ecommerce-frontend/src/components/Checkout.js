import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, user, isLoggedIn, placeOrder }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipcode: '',
    paymentMethod: 'CREDIT_CARD'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const orderData = {
        customerId: user.id,
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        amount: parseFloat(cartTotal),
        paymentMethod: formData.paymentMethod,
        reference: `ORD-${Date.now()}`,
        // Add address information
        address: {
          street: formData.address,
          city: formData.city,
          zipcode: formData.zipcode
        }
      };
      
      const newOrder = await placeOrder(orderData);
      navigate(`/order-success/${newOrder.id}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">Your cart is empty. Add some products before checkout.</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Browse Products
        </button>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">Please login to continue with checkout.</p>
        <button 
          onClick={() => navigate('/login')}
          className="btn btn-primary"
        >
          Login
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping & Payment Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group mb-4">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group mb-6">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="VISA">Visa</option>
                  <option value="MASTER_CARD">MasterCard</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="btn btn-secondary"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-200">
                <div>
                  <span>{item.name}</span>
                  <span className="text-gray-500 ml-1">×{item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${cartTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;