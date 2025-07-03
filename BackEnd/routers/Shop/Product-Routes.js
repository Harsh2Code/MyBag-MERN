const express = require('express');
const 
{
    getFilteredProducts,
    getProductDetails,
    addReview,
    getReviews
} = require('../../Controllers/Shop/Product-Controller');


const router = express.Router();

router.get('/get', getFilteredProducts);
router.get('/get/:id', getProductDetails);

// Add review routes
router.post('/review/:productId', addReview);
router.get('/review/:productId', getReviews);

module.exports = router;
