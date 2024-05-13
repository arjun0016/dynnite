import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listProducts } from '../actions';
import { Store } from './Store';
import "../components/detailspage.css";
import { CircularProgress } from '@mui/material';

function DetailsPage() {
  const { productName } = useParams();
  const { state, dispatch } = useContext(Store);
  const { products, loading: loadingProducts } = state.productList;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    listProducts(dispatch); // Fetch products if not already fetched
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Find the product whose name matches the productName from URL params
      const foundProduct = products.find((p) => p.name === productName);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [productName, products]);

  if (loadingProducts) {
    return <div className='loading-detailspage'> <CircularProgress />
    </div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>

         <div className="navbar">
        <div className="navbar-left">
          <img src='/images/dynnite_text.png' alt='err' className='review_nav_txt'/>
        </div>
        <div className="navbar-right">
          <img className='cart_icon' src='/images/cart_icon.png' alt='err'/>
        </div>
      </div>
      <div className='product-detailed-view'>

      <div className='product-detail-img'>
      <img src={`data:image/jpeg;base64,${product.image}`} />
      </div>
      

      <div className='product-detail-content'>
      <h2>{product.name}</h2>
      category : {product.category}
      <p>Description: {product.desc}</p>
      <p>Price: ₹{product.price}</p>
      <p>Price: {product.time} Mins</p>

      <div className='img-gal'>

      <div className='img-gal1'>
      <img src={`data:image/jpeg;base64,${product.image}`} />
      </div>
      <div className='img-gal2'>
      <img src={`data:image/jpeg;base64,${product.image}`} />
      </div>
      <div className='img-gal3'>
      <img src={`data:image/jpeg;base64,${product.image}`} />
      </div>

      </div>
      </div>
   
      </div>

      
    </div>
  );
}

export default DetailsPage;
