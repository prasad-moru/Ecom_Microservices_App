const API_URL = 'http://localhost:8222'; // Your API gateway URL

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const purchaseProducts = async (productPurchaseRequests) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/products/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productPurchaseRequests),
    });
    if (!response.ok) {
      throw new Error('Failed to purchase products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error purchasing products:', error);
    throw error;
  }
};