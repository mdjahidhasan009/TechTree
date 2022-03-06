import expressAsyncHandler from 'express-async-handler';

import Product from "../models/productModel.js";
import Filter from "../models/filterModel.js";

// @desc    Fetch all products,all product having certain string/letter in name with/without filtering(such as brand)
// @route   GET api/products
// @access  Public
const getProducts = expressAsyncHandler(async (req, res) => {
  const productPerPage = 6;
  const pageNumber = Number(req.query.pageNumber) || 1;
  const brandsNeed = req.query.brandsNeed; //an array of brands for filtering
  const categoriesNeed = req.query.categoriesNeed; //an array of categories for filtering
  const keywordFilter = req.query.keyword
    ? { //passed keyword(string or char)
        name: {
          $regex: req.query.keyword,
          $options: 'i' //for case insensitivity
        }
      }
    : {}; //no keyword
  const brandFilter = brandsNeed
    ? {
        brand: { $in: [...brandsNeed]}
      }
    : {};
  const categoryFilter = req.query.categoriesNeed
  ? {
      category: { $in: [...categoriesNeed]}
    }
  : {};

  const conditions = {
    $and: [
      keywordFilter ,
      brandFilter,
      categoryFilter
    ]
  };
  const count = await Product.countDocuments({ ...conditions });
  const products = await Product.find({ ...conditions })
      .limit(productPerPage)
      .skip(productPerPage * (pageNumber - 1));
  const filters = await Filter.find({});
  let brands = filters[0].brands;
  let categories = filters[0].categories;
  res.json({ products, totalPages: Math.ceil(count / productPerPage), brands, categories });
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
  const { name, price, description, image, brand, category, countInStock, productStock } = req.body;
  const product = await new Product({
    name,
    price,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock,
    productStock,
    numReviews: 0,
    description
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

// @desc    Edit existing review
// @route   PUT api/products/:id/reviews/:reviewId
// @access  Private
const editProductReview = expressAsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if(product) {
    const isCurrentUserMadeThisReview = product.reviews.find(review =>
        review._id.toString() === req.params.reviewId.toString() && //for selecting clicked review using review Id
        review.user.toString() === req.user._id.toString() //to check does current user create this review
    );
    if(!isCurrentUserMadeThisReview) {
      res.status(400);
      throw new Error("Server Error");
    } else {
      await Product.update(
          { _id: req.params.productId, 'reviews._id': req.params.reviewId },
          {
            '$set': {
              'reviews.$.rating': rating,
              'reviews.$.comment': comment
            }
          }
      )
      res.status(201).json({ message: 'Product Review Edited' });
    }
  } else {
    res.status(404);
    throw new Error('Product Not Found!');
  }
});

// @desc    Deleting existing review
// @route   DELETE api/products/:id/reviews/:reviewId
// @access  Private
const deleteProductReview = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if(product) {
    const isCurrentUserMadeThisReview = product.reviews.find(review =>
        review._id.toString() === req.params.reviewId.toString() && //for selecting clicked review using review Id
        review.user.toString() === req.user._id.toString() //to check does current user create this review
    );
    if(!isCurrentUserMadeThisReview) {
      res.status(400);
      throw new Error("Server Error");
    } else {
      await Product.update(
          { _id: req.params.productId },
          {
            '$pull': {
              'reviews': { '_id': req.params.reviewId }
            }
          }
      )
      res.status(201).json({ message: 'Product Review Deleted' });
    }
  } else {
    res.status(404);
    throw new Error('Product Not Found!');
  }
});

// @desc    Get Top Rated Product
// @route   POST /api/products/top
// @access  Public
const getTopProducts = expressAsyncHandler(async (req, res) => {
  const phones = await Product.find({ category: "phone" }).sort({ rating: -1 }).limit(3);
  const earphones = await Product.find({ category: "earphone" }).sort({ rating: -1 }).limit(3);
  const tablets = await Product.find({ category: "tablet" }).sort({ rating: -1 }).limit(3);
  const laptops = await Product.find({ category: "laptop" }).sort({ rating: -1 }).limit(3);
  const smartWatches = await Product.find({ category: "smartWatch" }).sort({ rating: -1 }).limit(3);
  res.json({ phones, earphones, tablets, laptops, smartWatches });
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  editProductReview,
  deleteProductReview,
  getTopProducts
};
