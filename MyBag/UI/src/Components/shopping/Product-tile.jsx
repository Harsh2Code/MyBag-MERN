import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <div className="mb-2">
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="card d-flex flex-column"
        style={{ width: "14rem", height: "100%", marginBottom: "10px" }}
      >
        <div className="position-relative">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.title || "Product image"}
            style={{ objectFit: "cover", height: "300px" }}
          />
          {product.price > 0 && product.price < product.salePrice && (
            <span
              className="badge rounded-pill bg-info position-absolute top-0 start-0 m-2"
              style={{ zIndex: 10 }}
            >
              Sale
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column p-2 flex-grow-1">
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-5 font-bold mb-1 d-flex justify-items-start text-sm-start mt-0 p-0 m-0" style={{fontSize: "1.5rem"}}>{product.title}</span>
              <span
                className="card-title d-flex justify-content-end text-capitalize text-opacity-50 mb-1"
                style={{ color: "rgba(222, 155, 0, 0.8)", fontSize: "1.10rem", width: "50px", marginLeft: "auto", alignSelf: "flex-start" }}
              >
                {product.brand}
              </span>
            </div>
            <div className="p-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                {/* Remove or define categoryOptionsMap and brandOptionsMap if needed */}
                {/* <span className="text-sm text-muted">{categoryOptionsMap[product?.category]}</span> */}
                {/* <span className="text-sm text-muted">{brandOptionsMap[product?.brand]}</span> */}
              </div>
              <div className="d-flex justify-content-between align-items-sm-end mb-1" style={{ height: "2.2rem" }}>
                <span
                  className={`${
                    product.salePrice > 0 && product.salePrice > product.price
                      ? "text-decoration-line-through"
                      : "d-none"
                  } text-lg-start text-muted justify-content-flex-start`}
                >
                  ${product.salePrice}
                </span>
                {product.salePrice > 0 ? (
                  <span className="text-lg-end p-0 mr-0 text-muted d-flex justify-content-end" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)", width: "50px", marginLeft: "auto"}}>${product.price}</span>
                ) : null}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id);
            }}
            className="btn btn-dark btn-sm mt-auto"
          >
            <ShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingProductTile;
