import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

function Cart({ cart, removeFromCart, updateCartItemQuantity }) {
  const navigate = useNavigate();
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  
  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p className="mb-4">Your cart is empty. Add some products to get started!</p>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="bg-white rounded shadow-md p-6 mb-6">
        {cart.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row items-center py-4 border-b border-gray-200">
            <div className="md:w-2/12 mb-4 md:mb-0">
              <div className="product-image w-24 h-24">
                <span>Product Image</span>
              </div>
            </div>
            
            <div className="md:w-5/12 mb-4 md:mb-0">
              <h3 className="product-name">{item.name}</h3>
              <p className="product-description">{item.description}</p>
            </div>
            
            <div className="md:w-2/12 mb-4 md:mb-0">
              <div className="flex items-center">
                <button 
                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="quantity-input mx-2 w-12 text-center"
                />
                <button 
                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="md:w-2/12 mb-4 md:mb-0 text-right">
              <div className="product-price">${(item.price * item.quantity).toFixed(2)}</div>
              <div className="text-sm text-gray-500">${item.price.toFixed(2)} each</div>
            </div>
            
            <div className="md:w-1/12 text-right">
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
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
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          Continue Shopping
        </button>
        <button 
          onClick={() => navigate('/checkout')}
          className="btn btn-primary"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;