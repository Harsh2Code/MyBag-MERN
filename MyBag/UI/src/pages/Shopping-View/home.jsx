import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "../../store/Shop/Product-Slice/ProductSlice";
import ShoppingProductTile from "../../Components/shopping/Product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "../../store/cart-slice/cart-Slice";
import ProductDetailsDialog from "../../Components/shopping/product-details";
import Footer from "../Footer.jsx";

import banner1 from "../../assets/banner-1.webp";
import banner2 from "../../assets/banner-2.webp";

import { SlUserFemale } from "react-icons/sl";
import { GrUserManager } from "react-icons/gr";
import { LuBaby } from "react-icons/lu";
import { SiGameandwatch, SiNike, SiPuma, SiRepublicofgamers, SiZara, SiThealgorithms } from "react-icons/si";
import { GiRunningShoe } from "react-icons/gi";
import { CgAdidas } from "react-icons/cg";

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Carousel } from 'bootstrap';






const categoriesWithIcon = [
  { id: "men", label: "Men", icon: GrUserManager },
  { id: "women", label: "Women", icon: SlUserFemale },
  { id: "kids", label: "Kids", icon: LuBaby },
  { id: "accessories", label: "Accessories", icon: SiGameandwatch },
  { id: "footwear", label: "Footwear", icon: GiRunningShoe },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: SiNike },
  { id: "adidas", label: "Adidas", icon: CgAdidas },
  { id: "puma", label: "Puma", icon: SiPuma },
  { id: "levi", label: "Levi's", icon: SiRepublicofgamers },
  { id: "zara", label: "Zara", icon: SiZara },
  { id: "h&m", label: "H&M", icon: SiThealgorithms },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.userId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.userId));
        alert("Product is added to cart");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % productList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [productList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: {} }));
  }, [dispatch]);

  useEffect(() => {
    const carouselElement = document.getElementById('bannerCarousel');
    if (carouselElement) {
      const carouselInstance = new Carousel(carouselElement, {
        interval: 3500,
        ride: 'carousel',
        pause: false,
        wrap: true,
      });
      return () => {
        carouselInstance.dispose();
      };
    }
  }, []);



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
    <style>{`
      .carousel-fade .carousel-item {
        transition-duration: 1.5s !important;
        transition-timing-function: ease-in-out !important;
      }
    `}</style>
    <div className="d-flex flex-column min-vh-100">
      <div id="bannerCarousel" className="carousel carousel-fade my-5" data-bs-ride="carousel" data-bs-interval="4000" style={{ maxHeight: "500px", overflow: "hidden" }}>
        <div className="carousel-inner" style={{ height: "500px", overflow: "hidden" }}>
          <div className="carousel-item active" style={{ height: "500px" }}>
            <img src={banner1} className="d-block w-100" alt="Banner 1" style={{ objectFit: "cover", height: "500px", willChange: "transform" }} />
          </div>
          <div className="carousel-item" style={{ height: "500px" }}>
            <img src={banner2} className="d-block w-100" alt="Banner 2" style={{ objectFit: "cover", height: "500px", willChange: "transform" }} />
          </div>
        </div>
      </div>

      {/* Image Slider */}
      {/* Removed manual image slider to avoid conflict with Bootstrap carousel */}

  {/* Shop by Category */ }
  <section className="py-5 bg-light">
    <div className="container text-center">
      <h2 className="fw-bold mb-4">Shop by Category</h2>
      <div className="row d-flex justify-content-between">
        {categoriesWithIcon.map((categoryItem) => {
          const IconComponent = categoryItem.icon;
          return (
            <div
              key={categoryItem.id}
              className="col-md-2 col-sm-6 mb-4"
              onClick={() =>
                handleNavigateToListingPage(categoryItem, "category")
              }
            >
              <div className="card shadow-sm p-3 d-flex flex-column align-items-center justify-content-center">
                <IconComponent className="fs-1 mb-3" style={{ color: 'black' }} />
                <div className="fw-bold">{categoryItem.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>

  {/* Shop by Brand */ }
  <section className="py-5 bg-light">
    <div className="container text-center">
      <h2 className="fw-bold mb-4">Shop by Brand</h2>
      <div className="row">
        {brandsWithIcon.map((brandItem) => {
          const IconComponent = brandItem.icon;
          return (
            <div
              key={brandItem.id}
              className="col-md-2 col-sm-4 mb-4"
              onClick={() => handleNavigateToListingPage(brandItem, "brand")}
            >
              <div className="card shadow-sm p-3 d-flex flex-column align-items-center justify-content-center">
                <IconComponent className="fs-1 mb-3" style={{ color: 'black' }} />
                <div className="fw-bold">{brandItem.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>

  {/* Featured Products */ }
      <section className="py-5">
        <div className="container text-center Canvas">
          <h2 className="fw-bold mt-4 mb-4 " style={{height: "100px", lineHeight: "100px"}}> COLLECTIONS
            <pre className="d-flex  align-items-center mb-3" style={{height: "2px", width: "100%", border: "4px solid black", borderRadius: "10px"}}></pre>
          </h2>
          <div className="d-flex flex-wrap justify-content-between">
            {productList && productList.length > 0
              ? productList.map((productItem, index) => (
                  <ShoppingProductTile
                    key={productItem._id || index}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <Footer />
    </div >
    </>
  );
}

export default ShoppingHome;
