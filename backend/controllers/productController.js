import expressAsyncHandler from 'express-async-handler';

import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET api/products
// @access  Public
const getProducts = expressAsyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  //may or may not send query keyword to search
  const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i' //for case insensitivity
          }
        }
      : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  res.json({ products, page, totalPages: Math.ceil(count / pageSize)});
})

// @desc    Fetch a product
// @route   GET api/products/:id
// @access  Public
const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if(product) {
    res.json(product);
  } else {
    // res.status(404).json({ message: 'Product Not Found.' });
    res.status(404);
    throw new Error('Product not found.');
  }
})

// @desc    Delete a product
// @route   DELETE api/products/:id
// @access  Private/Admin
const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    await product.remove();
    res.json({ message: 'Product Removed!'});
  } else {
    // res.status(404).json({ message: 'Product Not Found.' });
    res.status(404);
    throw new Error('Product not found.');
  }
})

// @desc    Create a product
// @route   POST api/products
// @access  Private/Admin
const createProduct = expressAsyncHandler(async (req, res) => {
  const product = await new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/carouselImages/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})

// @desc    Update a product
// @route   PUT api/products/:id
// @access  Private/Admin
const updateProduct = expressAsyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock, productStock } = req.body;
  const product = await Product.findById(req.params.id);

  if(product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.productStock = productStock;

    const updateProduct = await product.save();
    res.json(updateProduct);
  } else {
    res.status(404);
    throw new Error('Product Not Found!');
  }
})

// @desc    Create New Review
// @route   POST api/products/:id/reviews
// @access  Private
const createProductReview = expressAsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if(product) {
    const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString());
    if(alreadyReviewed) {
      res.status(400);
      throw new Error('Product Already Review');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    }

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Product Review Added' });
  } else {
    res.status(404);
    throw new Error('Product Not Found!');
  }
})

// @desc    Get Top Rated Product
// @route   POST /api/products/top
// @access  Public
const getTopProducts = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: - 1 }).limit(3);
  res.json(products);
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts
};
