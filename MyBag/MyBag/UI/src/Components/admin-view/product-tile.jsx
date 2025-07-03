import React from 'react'
import { Card, CardBody, CardFooter, CardImg, Button } from 'react-bootstrap'

export default function AdminProductTile({ product, setCurrentEditedId, setFormData, handleDelete }) {
    function handleAddtoCart(e) {
        e.preventDefault();
        console.log('Add to cart clicked for product:', product?.title);
    }

    function onEdit() {
        setCurrentEditedId(product._id);
        setFormData({
            image: product.image || '',
            title: product.title || '',
            description: product.description || '',
            category: product.category || '',
            brand: product.brand || '',
            price: product.price || '',
            salePrice: product.salePrice || '',
            totalStock: product.totalStock || '',
            _id: product._id,
        });
    }

    function onDelete() {
        if (window.confirm(`Are you sure you want to delete product "${product.title}"?`)) {
            handleDelete(product._id);
        }
    }

    return (
        <Card style={{ width: '250px', height: '480px', display: 'flex', flexDirection: 'column' }}>
            <CardImg 
                variant="top" 
                src={product?.image} 
                alt={product?.title} 
                style={{ width: '100%', height: '331px', objectFit: 'cover', backgroundColor: '#f8f9fa'}} 
            />
            <CardBody 
                style={{ flex: '1 1 auto', overflow: 'hidden', padding: '0.5rem 1rem' }} 
                className="d-flex flex-column"
            >
                <h5 className="card-title mb-1">{product?.title}</h5>
                <h6 className="card-text text-muted mb-1">{product?.category}</h6>
                <p className="card-text flex-grow-1 mb-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {product?.description}
                </p>
                <div className='d-flex justify-content-between mb-1'>
                    <span className={`${product?.salePrice > 0 && product?.price > product?.salePrice ? 'text-decoration-line-through' : ''} fw-semibold font-primary`}>
                        {product?.price > product?.salePrice ? product?.price : ''}
                    </span>
                    <span className='fw-semibold font-primary'>{product?.salePrice}</span>
                </div>
                <a href="#" onClick={handleAddtoCart} className=" btn btn-dark-sm">Buy {product?.salePrice}</a>
            </CardBody>
            <CardFooter 
                className='d-flex justify-content-between align-items-center' 
                style={{ padding: '0.5rem 1rem' }}
            >
                <Button size="sm" className='btn btn-dark' onClick={onEdit}>Edit</Button>
                <Button size="sm" className='btn btn-dark' onClick={onDelete}>Delete</Button>
            </CardFooter>
        </Card>
    )
}
