import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find product in the products array
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id, products]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!product) {
    return (
      <div>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="product-detail">
      <button onClick={() => navigate('/')} className="btn btn-secondary mb-4">
        ← Back to Products
      </button>
      
      <div className="product-detail-content">
        <div className="product-detail-image">
          <div className="product-image large">
            <span>Product Image</span>
          </div>
        </div>
        
        <div className="product-detail-info">
          <div className="product-category">{product.categoryName}</div>
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <p className="product-description">{product.description}</p>
          
          <div className="product-availability">
            <h3>Availability:</h3>
            <p className={product.availableQuantity > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.availableQuantity > 0 
                ? `In Stock (${product.availableQuantity} available)` 
                : 'Out of Stock'}
            </p>
          </div>
          
          {product.availableQuantity > 0 && (
            <div className="quantity-control">
              <h3>Quantity:</h3>
              <div className="quantity-buttons">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.availableQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="quantity-input"
                />
                <button 
                  onClick={() => setQuantity(prev => Math.min(product.availableQuantity, prev + 1))}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              addToCart(product, quantity);
              setQuantity(1);
              navigate('/cart');
            }}
            disabled={product.availableQuantity < 1}
            className="btn btn-primary add-to-cart-btn"
          >
            {product.availableQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;