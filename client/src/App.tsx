import React, { useState } from 'react';
import './App.css'; // Ensure this is included to apply styles

function App() {
  const [product, setProduct] = useState({
    product_code: '',
    name: '',
    description: '',
    price: '',
    qty: '',
    date_added: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Here you would typically add the API call to save the product
    alert('Product saved successfully!');
  };

  const handleClear = () => {
    setProduct({
      product_code: '',
      name: '',
      description: '',
      price: '',
      qty: '',
      date_added: '',
    });
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form>
        <div>
          <label>Product Code:</label>
          <input
            type="text"
            name="product_code"
            value={product.product_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            step="0.01" // Allows decimal input
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="qty"
            value={product.qty}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date Added:</label>
          <input
            type="date"
            name="date_added"
            value={product.date_added}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </form>
    </div>
  );
}

export default App;
