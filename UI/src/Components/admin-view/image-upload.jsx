import React, { useEffect, useRef } from 'react'
import axios from 'axios';
import { ImageUp, FileImage, X } from 'lucide-react';

export default function ProductImageUpload(props) {

  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    console.log(event.target.files);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      props.setImageFile(selectedFile);
    }
  }
  
  async function uploadImageToCloudinary()
  {
    console.log("Uploading file:", props.imageFile);
    const data = new FormData();
    data.append('my_file', props.imageFile );
    const response = await axios.post("http://localhost:5000/api/admin/products/upload-image", data, { withCredentials: true });
    
    console.log("Upload response:", response);

    if(response?.data?.success) {
      console.log("Setting image URL:", response.data.url);
      props.setImageUrl(response.data.url);
    } else {
      console.error("Image upload failed:", response.data);
    }
  }

  useEffect(() => { // uploading image to cloudinary here ✔️
    if(props.imageFile  !== null ) uploadImageToCloudinary();
  },[props.imageFile])

  return (
    <div className='form-control'>
      <label className='d-block fw-semibold mb-2' htmlFor="image-upload"> upload Image</label>
      <input id='image-upload' className='form-control' type='file' ref={inputRef} onChange={handleImageFileChange} style={{ display: 'none' }} disabled={props.isEditMode} />
      {
        !props.imageFile ?
          <label htmlFor="image-upload" className={`${props.isEditMode ? "cursor-not-allowed" : ""} d-flex flex-column align-items-center justify-content-center`} style={{ cursor: 'pointer', height: '32px' }}>
            <ImageUp style={{ color: 'blue', width: '32px', height: '32px' }} />
            <span className={`${props.isEditMode ? "opacity-75" : ""} text-primary fw-semibold`}>Drag and drop or click to upload image</span>
          </label> : (
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex w-100 justify-content-between align-items-center'>
                <FileImage className='text-primary mr-3' style={{ width: 24, height: 24 }} />
                <p className='text-sm-start ml-2 mt-3'>
                  {props.imageFile.name}
                </p>
                <button className='text-muted' variant="ghost" onClick={() => props.setImageFile(null)} style={{ backgroundColor: 'transparent' }}>
                  <X />
                </button>
              </div>
            </div>
          )
      }
    </div>
  )
}
