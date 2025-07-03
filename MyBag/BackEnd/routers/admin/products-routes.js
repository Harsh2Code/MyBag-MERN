const express = require('express');
const 
{
        handleImageUpload,
        addProduct,
        fetchProduct,
        deleteProduct,
        editProduct,
} = require('../../Controllers/admin/product-controllers');
const {upload} = require('../../helpers/Cloudinary');

const router = express.Router();

router.post('/upload-image', upload.single('my_file'),handleImageUpload);
router.post('/add-product', addProduct);
router.put('/edit-product/:id', editProduct);
router.delete('/delete-product/:id',deleteProduct);
router.get('/get-product', fetchProduct);


module.exports = router;
