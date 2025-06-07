const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Test endpoint to verify all categories
router.get('/test', async (req, res) => {
    try {
        const mainCategories = await Category.find({ parentCategory: null });
        const allCategories = await Category.find({});
        res.json({
            mainCategories,
            allCategories,
            count: allCategories.length
        });
    } catch (err) {
        console.error('Error in test endpoint:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get all categories or filter by parent
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.parentCategory) {
            query.parentCategory = req.query.parentCategory;
        } else if (req.query.parentCategorySlug) {
            // If parentCategorySlug is provided, find the parent category by slug first
            const parentCategory = await Category.findOne({ slug: req.query.parentCategorySlug });
            if (parentCategory) {
                query.parentCategory = parentCategory._id;
            } else {
                // If parent category not found by slug, return empty array
                return res.json([]);
            }
        }

        const categories = await Category.find(query).populate('parentCategory');
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get category by slug
router.get('/slug/:slug', async (req, res) => {
    try {
        console.log('Fetching category by slug:', req.params.slug); // Debug log
        const category = await Category.findOne({ slug: req.params.slug })
            .populate('parentCategory');
        
        if (!category) {
            console.log('Category not found for slug:', req.params.slug); // Debug log
            return res.status(404).json({ message: 'Category not found' });
        }
        
        console.log('Found category:', category); // Debug log
        res.json(category);
    } catch (err) {
        console.error('Error fetching category by slug:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parentCategory');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        console.error('Error fetching category by ID:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            slug: req.body.slug,
            description: req.body.description,
            image: req.body.image,
            parentCategory: req.body.parentCategory
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        Object.keys(req.body).forEach(key => {
            category[key] = req.body[key];
        });

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if category has subcategories
        const hasSubcategories = await Category.exists({ parentCategory: category._id });
        if (hasSubcategories) {
            return res.status(400).json({ message: 'Cannot delete category with subcategories' });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 