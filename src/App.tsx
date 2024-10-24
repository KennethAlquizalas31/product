import React, { useState, useEffect } from 'react';
import './App.css';

interface IProduct {
    _id?: string;
    product_code: string;
    name: string;
    description: string;
    price: string;
    qty: string;
    date_added: string;
    isDeleted?: boolean; // Optional field for deleted status
}

const App: React.FC = () => {
    const [currentProduct, setCurrentProduct] = useState<IProduct>({
        product_code: '',
        name: '',
        description: '',
        price: '',
        qty: '',
        date_added: '',
    });
    const [productList, setProductList] = useState<IProduct[]>([]);
    const [removedProducts, setRemovedProducts] = useState<IProduct[]>([]);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // Load products when the component mounts
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products');
            const products = await response.json();
            setProductList(products);
        } catch (error) {
            console.error('Unable to fetch products:', error);
        }
    };

    const loadRemovedProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products/deleted');
            const deletedProducts = await response.json();
            setRemovedProducts(deletedProducts);
        } catch (error) {
            console.error('Unable to fetch deleted products:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            console.log('Sending product data:', currentProduct);
            const method = isUpdating ? 'PUT' : 'POST';
            const url = isUpdating
                ? `http://localhost:5000/products/${selectedProductId}`
                : 'http://localhost:5000/products';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentProduct),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error('Network response was not ok');
            }

            alert(isUpdating ? 'Product updated successfully!' : 'Product added successfully!');
            loadProducts();
            clearForm();
        } catch (error) {
            console.error('Error while saving product:', error);
            alert('Failed to save product. Check the console for more information.');
        }
    };

    const handleEditProduct = (product: IProduct) => {
        setCurrentProduct(product);
        setIsUpdating(true);
        setSelectedProductId(product._id || null);
    };

    const handleRemoveProduct = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
            alert('Product successfully removed!');
            loadProducts();
        } catch (error) {
            console.error('Error while removing product:', error);
            alert('Failed to remove product.');
        }
    };

    const clearForm = () => {
        setCurrentProduct({
            product_code: '',
            name: '',
            description: '',
            price: '',
            qty: '',
            date_added: '',
        });
        setIsUpdating(false);
        setSelectedProductId(null);
    };

    const handleDisplayRemovedProducts = async () => {
        await loadRemovedProducts();
    };

    const handleRestoreProduct = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/products/restore/${id}`, { method: 'PUT' });
            alert('Product restored successfully!');
            loadProducts();
            handleDisplayRemovedProducts(); // Refresh removed products list
        } catch (error) {
            console.error('Error while restoring product:', error);
            alert('Failed to restore product.');
        }
    };

    const handlePermanentRemoval = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/products/permanently/${id}`, { method: 'DELETE' });
            alert('Product permanently removed successfully!');
            loadRemovedProducts(); // Refresh removed products list
        } catch (error) {
            console.error('Error while permanently removing product:', error);
            alert('Failed to permanently remove product.');
        }
    };

    return (
        <div>
            <h1>{isUpdating ? 'Update Product' : 'Add New Product'}</h1>
            <div className="form-container">
                <form>
                    <div>
                        <label>Product Code:</label>
                        <input
                            type="text"
                            name="product_code"
                            value={currentProduct.product_code}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={currentProduct.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={currentProduct.description}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={currentProduct.price}
                            onChange={handleInputChange}
                            required
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            name="qty"
                            value={currentProduct.qty}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Date Added:</label>
                        <input
                            type="date"
                            name="date_added"
                            value={currentProduct.date_added}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="button" onClick={handleSubmit}>
                        {isUpdating ? 'Update' : 'Add'}
                    </button>
                    <button type="button" onClick={clearForm}>Clear</button>
                </form>
            </div>

            <h2>Current Products</h2>
            <ul>
                {productList.map((prod) => (
                    <li key={prod._id}>
                        <div>
                            <strong>{prod.product_code}</strong> - {prod.name} - ${prod.price}
                            <button className="edit-button" onClick={() => handleEditProduct(prod)}>Edit</button>
                            <button className="delete-button" onClick={() => handleRemoveProduct(prod._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="show-removed-button" onClick={handleDisplayRemovedProducts}>View Removed Products</button>
            <ul>
                {removedProducts.map((prod) => (
                    <li key={prod._id}>
                        <div>
                            <strong>{prod.product_code}</strong> - {prod.name} - ${prod.price}
                            <button className="restore-button" onClick={() => handleRestoreProduct(prod._id)}>Restore</button>
                            <button className="permanent-delete-button" onClick={() => handlePermanentRemoval(prod._id)}>Permanently Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );  
};

export default App;
