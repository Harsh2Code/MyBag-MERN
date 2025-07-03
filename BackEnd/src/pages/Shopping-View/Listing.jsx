import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductFilter from '../../Components/shopping/filter';
import { ArrowUpDownIcon } from 'lucide-react';
import ShoppingProductTile from '../../Components/shopping/Product-tile';
import { Dropdown } from 'react-bootstrap';
import { addToCart, fetchCartItems } from '../../store/cart-slice/cart-Slice';
import { fetchAllFilteredProducts, fetchProductDetails } from '../../store/Shop/Product-Slice/ProductSlice';

import { categoryOptionsMap, brandOptionsMap } from '../../config';

export default function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shopProducts);
  const { cartItems } = useSelector(state => state.shopCart);
  const { user } = useSelector(state => state.auth);

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOptions = [
    { id: 'price-lowtohigh', label: 'Price: Low to High' },
    { id: 'price-hightolow', label: 'Price: High to Low' },
    { id: 'newest', label: 'Newest' },
  ];

  useEffect(() => {
    if (sort !== null) {
      // Map filters keys from "Category" and "Brand" to lowercase keys expected by backend
      const mappedFilters = {};
      Object.keys(filters).forEach((key) => {
        if (key === 'Category') {
          mappedFilters['category'] = filters[key];
        } else if (key === 'Brand') {
          mappedFilters['brand'] = filters[key];
        } else {
          mappedFilters[key] = filters[key];
        }
      });

      dispatch(fetchAllFilteredProducts({ filterParams: mappedFilters, sortParams: sort }));
    }
  }, [dispatch, filters, sort]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOptions) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOptions],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);
      if (indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOptions);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          alert(`Only ${getQuantity} quantity can be added for this item`);
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        alert('Product is added to cart');
      }
    });
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(',');

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join('&');
  }

  useEffect(() => {
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {});
  }, []);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  return (
    <div className="container-fluid p-3">
      <div className="row">
        <div className="col-12 col-md-3">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>
        <div className="col-12 col-md-9">
          <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
            <h2 className="fs-3 fw-bold">All Products</h2>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">{productList?.length} Products</span>
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  className="d-flex align-items-center gap-1"
                >
                  <ArrowUpDownIcon size={30} />
                  <span>Sort By</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{ width: '200px' }}>
                  {sortOptions.map((sortItem) => (
                    <Dropdown.Item
                      key={sortItem.id}
                      active={sort === sortItem.id}
                      onClick={() => handleSort(sortItem.id)}
                    >
                      {sortItem.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="row row-cols-3 g-4 p-3">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={() => dispatch(fetchProductDetails(productItem._id))}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
