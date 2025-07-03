import React, { useState, useEffect } from 'react';

import banner1 from '../../assets/banner-1.webp';
import banner2 from '../../assets/banner-2.webp';

export default function Dashboard() {
  const [CImagees] = useState([banner1, banner2]);
  
  // Carousel images state
  const [carouselImages, setCImagees] = useState([banner1, banner2]);

  // Handler to add new image to carousel
  const handleAddCarouselImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setCImagees(prev => [...prev, newImageUrl]);
    }
  };



  useEffect(() => {
    // Set body and html height and background color to fix layout issue
    document.body.style.minHeight = '100vh';
    document.body.style.backgroundColor = 'white';
    document.documentElement.style.minHeight = '100vh';
    document.documentElement.style.backgroundColor = 'white';

    return () => {
      // Cleanup styles on unmount
      document.body.style.minHeight = null;
      document.body.style.backgroundColor = null;
      document.documentElement.style.minHeight = null;
      document.documentElement.style.backgroundColor = null;
    };
  }, []);

  return (
    <>
      <div className="container-fluid admin-dash" style={{ minHeight: '100vh' }}>
        <h1>Admin Dashboard</h1>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Statistics</h5>
                <p className="card-text">Overview of system metrics</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <p className="card-text">Latest system events</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <p className="card-text">Common admin tasks</p>
              </div>
            </div>
          </div>
        </div>
          <h4>Carousel Images</h4>

        {/* Carousel Images Display */}
        <div className="mt-4 d-flex justify-content-center align-items-center">
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {CImagees.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Carousel ${index}`}
                style={{ width: '1000px', height: '300px', objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>
        </div>

            <div className='container mt-4 mb-4 bg-black rounded-1' style={{height : '5px'}}></div>

        <h4>Carousel Images</h4>
        {/* Carousel Images List */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          {CImagees.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Carousel ${index}`} style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
          ))}
          <label htmlFor="add-carousel-image" className="btn btn-dark mb-0" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            + Add Image
          </label>
          <input
            type="file"
            id="add-carousel-image"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAddCarouselImage}
          />
        </div>
      </div>
      </div>
    </>
  );
}
