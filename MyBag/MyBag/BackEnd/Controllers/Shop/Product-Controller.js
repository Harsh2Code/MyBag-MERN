
const Product = require("../../models/Product");
const Review = require("../../models/Review");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, rating, reviewText } = req.body;

    if (!userId || !rating) {
      return res.status(400).json({
        success: false,
        message: "User ID and rating are required",
      });
    }

    const newReview = new Review({
      productId,
      userId,
      rating,
      reviewText,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

const mongoose = require('mongoose');

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({ productId }).populate('userId', 'username');

    let averageRating = 0;
    try {
      const averageRatingAgg = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: "$productId", averageRating: { $avg: "$rating" } } }
      ]);
      averageRating = averageRatingAgg.length > 0 ? averageRatingAgg[0].averageRating : 0;
    } catch (aggError) {
      console.error("Aggregation error:", aggError);
    }

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails, addReview, getReviews };
