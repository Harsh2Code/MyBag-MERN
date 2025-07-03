import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CommonForm from '../../Components/common/Form';
import { addNewProduct, editProduct, fetchProduct, deleteProduct } from '../../store/admin/product-slice/productSlice';
import { addProductFormElements } from '../../config/index.js';
import { toast, ToastContainer } from 'react-toastify';
import AdminProductTile from '../../Components/admin-view/product-tile.jsx';

import banner1 from '../../assets/banner-1.webp';
import banner2 from '../../assets/banner-2.webp';

export default function Products({ enableToast = true }) {
  const { productList, isLoading } = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();

  const initialState = {
    image: '',
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [imageUrl, setImageUrl] = useState('');
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Open modal when currentEditedId is set (edit mode)
  React.useEffect(() => {
    if (currentEditedId !== null) {
      setShowModal(true);
    }
  }, [currentEditedId]);

  // Fix background partitioning issue by setting body and html styles
  useEffect(() => {
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = 'white';
    document.documentElement.style.minHeight = '100vh';
    document.documentElement.style.backgroundColor = 'white';

    return () => {
      document.body.style.minHeight = null;
      document.body.style.backgroundColor = null;
      document.documentElement.style.minHeight = null;
      document.documentElement.style.backgroundColor = null;
    };
  }, []);

  function setImageUrlAndFormData(url) {
    setImageUrl(url);
    setFormData(prev => ({ ...prev, image: url }));
  }

  function isFormValid() {
    return Object.values(formData).every(value => value !== '');
  }

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      dispatch(editProduct({ id: currentEditedId, formData })).then(data => {
        if (data?.payload?.success) {
          dispatch(fetchProduct());
          setFormData(initialState);
          setCurrentEditedId(null);
          setImageUrl('');
          toast.success('Product updated successfully');
          setShowModal(false);
        }
      });
    } else {
      dispatch(addNewProduct({ ...formData, image: imageUrl })).then(data => {
        if (data?.payload?.success) {
          dispatch(fetchProduct());
          setFormData(initialState);
          setImageUrl('');
          toast.success('Product added successfully');
          setShowModal(false);
        }
      });
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct({ id: productId })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchProduct());
      }
    });
  }

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const openAddNewProductModal = () => {
    setFormData(initialState);
    setImageUrl('');
    setCurrentEditedId(null);
    setShowModal(true);
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-dark" onClick={openAddNewProductModal}>
          Add New Product
        </button>
      </div>

      {/* Render form only as modal */}
      {showModal && (
        <CommonForm
          onSubmit={onSubmit}
          formData={formData}
          setFormData={setFormData}
          formControls={addProductFormElements}
          buttonText={currentEditedId !== null ? "Update Product" : "Add New Product"}
          imageUrl={imageUrl}
          setImageUrl={setImageUrlAndFormData}
          currentEditedId={currentEditedId}
          setCurrentEditedId={setCurrentEditedId}
          isBtnDisabled={!isFormValid()}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      <div className="d-flex flex-wrap gap-3 justify-content-center mt-3 overflow-x-hidden w-100">
        {isLoading ? (
          <p>Loading products...</p>
        ) : productList && productList.length > 0 ? (
          productList.map(productItem => (
            <div key={productItem._id || productItem.id} className="mb-3">
              <AdminProductTile
                setFormData={setFormData}
                currentEditedId={currentEditedId}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
                setShowModal={setShowModal}
              />
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
      <ToastContainer position="top-right" className="p-3" />
    </>
  );
}
