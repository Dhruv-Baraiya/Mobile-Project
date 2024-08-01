require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware
// const { request } = require('http');

// extra
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/Mobile_Project');
mongoose.connect('mongodb+srv://'+process.env.USER+ ':' +process.env.PASS+'@dhruv.u1jjlqo.mongodb.net/Mobile_Project');
// Define Schema and Models for MongoDB
const ProductSchema = new mongoose.Schema({
    id: Number,
    brand: String,
    model: String,
    display_type: String,
    display_size: String,
    processor: String,
    camera: String,
    battery: String,
    features: Array,
    colors: [Array],
    price: String,
    description: String,
    image: String,
    dis_img1: String,
    dis_img2: String,
    dis_img3: String,
    dis_img4: String,
    dis_img5: String,
    dis_img6: String,
    dis_img8: String
});
const Product = mongoose.model('Product', ProductSchema);

app.use(bodyParser.json());

// Define routes
// Get all Products
app.get('/product/data', async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific product
app.get('/product/data/:id', async (req, res) => {
    try {
        const data = await Product.findById(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Add product
app.post('/product/data', async (req, res) => {

    const newdatabody = {
        id: req.body.id,
        brand: req.body.brand,
        model: req.body.model,
        description: req.body.description,
        price: req.body.price,
        colors: req.body.colors,
        image: req.body.image,
        display_type: req.body.display_type,
        display_size: req.body.display_size,
        processor: req.body.processor,
        camera: req.body.camera,
        battery: req.body.battery,
        features: req.body.features
    };
    const newData = new Product(newdatabody);
    try {
        const savedData = await newData.save();
        res.status(201).json(savedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//update product
app.put('/product/data/:id', async (req, res) => {
    try {
        const updatedData = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedData);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete product
app.delete('/product/data/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// extra

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, 'logo' + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('logo');

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Upload endpoint
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ error: 'No file selected!' });
            } else {
                res.json({ message: 'File uploaded successfully!', file: `/uploads/${req.file.filename}` });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
