const { UploadImageUtil } = require("../../helpers/Cloudinary");
const Product = require("../../models/Product");


const handleImageUpload =  async (req, res) => 
{
    try{
        console.log("Received file:", req.file);
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded or file buffer is empty"
            });
        }
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        console.log("Base64 string length:", b64.length);
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await UploadImageUtil(url);
        console.log("Upload result:", result);
        res.json({
            success: true,
            message: "Image uploaded successfully",
            url: result.secure_url
        });
    }catch (error) 
    {
        console.error("Upload error:", error);
        res.json({
            success: false,
            message: "Error occured while Uploading image",
            error: error.message
        });
    }
}


//------------------------todo: Add a product(done)---------------------

const addProduct = async (req, res) => {
    try
    {

        const {
            image,
            title,
            description,
            category, 
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;
        const newProduct = new Product(
            {
                image,
                title,
                description,
                category, 
                brand,
                price,
                salePrice,
                totalStock,

            }
        );

        await newProduct.save();
        res.status(201).json(
            {
                success: true,
                data: newProduct,
            }
        );

    }
    catch(error)
    {
        console.log({"error" : error});
        res.status(500).json({
            success: false,
            message: "Error occured while adding product",
            error: error.message
        })
    }
}

//------------------------todo: fetch all product(done)-----------------

const fetchProduct = async (req, res) => {
    try
    {
        const listOfProducts = await Product.find({});
        res.json({
            success: true,
            data: listOfProducts,
        })
    }
    catch(error)
    {
        console.log({"error" : error});
        res.status(500).json({
            success: false,
            message: "Error occured whilst fetching product",
        })
    }
}

//------------------------todo: edit a product(done)--------------------

const editProduct = async (req, res) => {
    try
    {
        const {id} =  req.params

        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        const findProduct = await Product.findById(id);

        if(!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found or does not exist anymore!",
            });
        };

        findProduct.title  = title || findProduct.title;
        findProduct.description  = description || findProduct.description;
        findProduct.category  = category || findProduct.category;
        findProduct.brand  = brand || findProduct.brand;
        findProduct.price  = price || findProduct.price;
        findProduct.salePrice  = salePrice || findProduct.salePrice;
        findProduct.totalStock  = totalStock || findProduct.totalStock;
        findProduct.image  = image || findProduct.image;

        await findProduct.save();

        res.status(200).json({
            success: true,
            data: findProduct,
        });

    }
    catch(error)
    {
        console.log({"error" : error});
        res.status(500).json({
            success: false,
            message: "Error occured while editing product",
        })
    }
}

//------------------------todo: delete a product(done)------------------

const deleteProduct = async (req, res) => {
    try
    {
        const {id} = req.params;

        const findProduct = await Product.findById(id);

        if(!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found or does not exist anymore!",
            });
        };

        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    }
    catch(error)
    {
        console.log({"error" : error});
        res.status(500).json({
            success: false,
            message: "Error occured while deleting product",
        })
    }
}
module.exports = {
    handleImageUpload,
    addProduct,
    fetchProduct,
    editProduct,
    deleteProduct,
}
