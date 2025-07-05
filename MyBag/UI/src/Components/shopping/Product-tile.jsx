import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
  return (
    <div>
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="card d-flex flex-column"
        style={{ width: "14rem", height: "100%",marginBottom: "10px"}}
      >
        <div className="position-relative">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.title || "Product image"}
            style={{ objectFit: "cover", height: "300px" }}
          />
          {product.price > 0 && product.price < product.salePrice && (
            <span className="badge rounded-pill bg-info position-absolute top-0 start-0 m-2" style={{ zIndex: 10 }}>
              Sale
            </span>
          )}
        </div>
        <div className="card-body d-flex flex-column justify-content-between p-2 flex-grow-1">
          <div>
            <h5 className="card-title text-muted text-capitalize text-opacity-50 mb-1">{product.brand}</h5>
            <div className="p-2">
              <h2 className="text-5 font-bold mb-1">{product.title}</h2>
              <div className="d-flex justify-content-between align-items-center mb-1">
                {/* Remove or define categoryOptionsMap and brandOptionsMap if needed */}
                {/* <span className="text-sm text-muted">{categoryOptionsMap[product?.category]}</span> */}
                {/* <span className="text-sm text-muted">{brandOptionsMap[product?.brand]}</span> */}
              </div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span
                  className={`${
                    product.salePrice > 0 && product.salePrice > product.price ? "text-decoration-line-through" : "d-none"
                  } text-lg-start text-muted`}
                >
                  ${product.salePrice}
                </span>
                {product.salePrice > 0 ? (
                  <span className="text-lg-end text-muted">${product.price}</span>
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
