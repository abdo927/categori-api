// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/categoryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

// Define Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name is required
  description: { type: String, required: true }, // Description is required
});

// Create Category Model
const Category = mongoose.model('Category', categorySchema);

// Initialize Express App
const app = express();
app.use(bodyParser.json());

// 1. Create_Category Endpoint
app.post('/create-category', async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body for debugging

    // Validate input
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const { name, description } = req.body;
    const newCategory = new Category({ name, description });

    console.log('Saving category:', newCategory); // Log the category being saved

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// 2. GetAllCategories Endpoint
app.get('/get-all-categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 3. Update_Category Endpoint
app.put('/update-category/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!req.body.name && !req.body.description) {
      return res.status(400).json({ error: 'At least one field (name or description) is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: req.body }, // Update only the provided fields
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// 4. GetCategoryByBId Endpoint
app.get('/get-category-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by ID:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// 5. DeleteCategoryByBId Endpoint
app.delete('/delete-category-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error.message); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});