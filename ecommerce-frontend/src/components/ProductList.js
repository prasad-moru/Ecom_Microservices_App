import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProductList({ products, addToCart }) {
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('all');
  
  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.categoryName))];
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesFilter = product.name.toLowerCase().includes(filter.toLowerCase()) || 
                         product.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = category === 'all' || product.categoryName === category;
    
    return matchesFilter && matchesCategory;
  });
  
  return (
    <div className="products-page">
      <h1>Products</h1>
      
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search products..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-input"
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-input"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span>Product Image</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">${product.price.toFixed(2)}</div>
              </div>
              <div className="product-actions">
                <Link to={`/product/${product.id}`} className="product-action-btn product-detail-btn">
                  Details
                </Link>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="product-action-btn add-to-cart-btn"
                  disabled={product.availableQuantity < 1}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;