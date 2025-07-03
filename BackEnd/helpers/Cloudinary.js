const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config(
    {
        cloud_name: 'dthoxdcrz',
        api_key:  '862922842795722',
        api_secret: '9KXirOFPPrgIetoemxDtJHNNERY'
    }
)

const storage = multer.memoryStorage();

async function UploadImageUtil(file)
{
    const result = await cloudinary.uploader.upload(file,{
        resource_type : 'auto',
})

return result;
}


const upload = multer({storage});

module.exports = {
    upload, 
    UploadImageUtil,
}   