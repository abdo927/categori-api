

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/categoryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); 
  });


const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  description: { type: String, required: true }, 
});


const Category = mongoose.model('Category', categorySchema);


const app = express();
app.use(bodyParser.json());


app.post('/create-category', async (req, res) => {
  try {
    console.log('Request Body:', req.body); 

    
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const { name, description } = req.body;
    const newCategory = new Category({ name, description });

    console.log('Saving category:', newCategory); 

    await newCategory.save();
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error.message); g
    res.status(500).json({ error: 'Failed to create category' });
  }
});


app.get('/get-all-categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});


app.put('/update-category/:id', async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!req.body.name && !req.body.description) {
      return res.status(400).json({ error: 'At least one field (name or description) is required' });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error.message); 
    res.status(500).json({ error: 'Failed to update category' });
  }
});


app.get('/get-category-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching category by ID:', error.message); 
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});


app.delete('/delete-category-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error.message); 
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
