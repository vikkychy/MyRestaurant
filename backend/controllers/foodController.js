import Food from '../models/foodModel.js';
import Category from '../models/categoryModel.js';

// Get all food items
export const getFoods = async (req, res) => {
    try {
        const foods = await Food.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: foods.length,
            foods
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get single food item
export const getSingleFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id)
            .populate('category', 'name');

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.status(200).json({
            success: true,
            food
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Create food item
export const createFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || price === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide food name, price and category'
            });
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists || !categoryExists.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Valid active category not found'
            });
        }

        const food = await Food.create({
            name,
            description,
            price,
            category
        });

        res.status(201).json({
            success: true,
            message: 'Food item created successfully',
            food
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update food item
export const updateFood = async (req, res) => {
    try {
        const { name, description, price, category, isAvailable } = req.body;

        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        if (category) {
            const categoryExists = await Category.findById(category);

            if (!categoryExists || !categoryExists.isActive) {
                return res.status(404).json({
                    success: false,
                    message: 'Valid active category not found'
                });
            }
        }

        if (name !== undefined) food.name = name;
        if (description !== undefined) food.description = description;
        if (price !== undefined) food.price = price;
        if (category !== undefined) food.category = category;
        if (isAvailable !== undefined) food.isAvailable = isAvailable;

        await food.save();

        res.status(200).json({
            success: true,
            message: 'Food item updated successfully',
            food
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete food item
export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Food item deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};