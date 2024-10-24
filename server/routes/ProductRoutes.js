import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// POST /products
router.post('/', async (req, res) => {
    const { product_code, name, description, price, qty, date_added } = req.body;
    try {
        const newProduct = new Product({ product_code, name, description, price, qty, date_added });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: 'Failed to create product', error });
    }
});

// GET /products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false }); // Only fetch non-deleted products
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
});

// DELETE /products/:id (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product', error });
    }
});

// PUT /products/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product_code, name, description, price, qty, date_added } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { product_code, name, description, price, qty, date_added, isDeleted: false }, // Ensure it is not marked as deleted
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product', error });
    }
});

// GET /products/deleted
router.get('/deleted', async (req, res) => {
    try {
        const deletedProducts = await Product.find({ isDeleted: true }); // Fetch deleted products
        res.status(200).json(deletedProducts);
    } catch (error) {
        console.error('Error fetching deleted products:', error);
        res.status(500).json({ message: 'Failed to fetch deleted products', error });
    }
});

// PUT /products/restore/:id (restore deleted product)
router.put('/restore/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const restoredProduct = await Product.findByIdAndUpdate(
            id,
            { isDeleted: false }, // Restore the product
            { new: true }
        );
        
        if (!restoredProduct) {
            return res.status(404).json({ message: 'Product not found or already restored' });
        }

        res.status(200).json(restoredProduct);
    } catch (error) {
        console.error('Error restoring product:', error);
        res.status(500).json({ message: 'Failed to restore product', error });
    }
});

// DELETE /products/permanently/:id (permanently delete a product)
router.delete('/permanently/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id); // Permanently delete the product

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product permanently deleted successfully' });
    } catch (error) {
        console.error('Error permanently deleting product:', error);
        res.status(500).json({ message: 'Failed to permanently delete product', error });
    }
});

export default router;
