import { Box } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import CartPopup  from '../components/CartPopup'
import { useStyles } from '../styles';
import {
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { addToOrder, listProducts, removeFromOrder } from '../actions';
import { Store } from './Store';
import '../components/order.css';
import { useNavigate, useLocation, Link  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglass1, faSearch } from '@fortawesome/free-solid-svg-icons';


function OrderScreen() {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [tableno, setTableno] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isWithinArea, setIsWithinArea] = useState(false);
  const closeHandler = () => {
    setIsOpen(false);
  };

  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };

  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };


  const addToCartHandler = (product) => {
    // Check if the user's geolocation allows adding to cart
    if (isWithinArea) {
      addToOrder(dispatch, { ...product, quantity: 1 });
      setIsOpen(false);
    } else {
      // Display an alert or take other actions if user is not within the specified area
      alert('You can only add to cart within the specified area.');
    }
  };
  const addToDetailsPage = (productId) => {
    navigate(`/detailspage?tableno=${tableno}&productId=${productId}`);
      // addToOrder(dispatch, { ...product});

  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };

  const { state, dispatch } = useContext(Store); 
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;

  const filteredProducts = products
    ? products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

    useEffect(() => {

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // Check if user is within the specified area (e.g., a certain radius from a predefined latitude and longitude)
            const areaLatitude = 11.258124299332914; // New York City latitude
            const areaLongitude = 75.79474778081867; // New York City longitude
            const maxDistance =1; // Maximum distance in kilometers (adjust as needed)
            const distance = calculateDistance(latitude, longitude, areaLatitude, areaLongitude);
            setIsWithinArea(distance <= maxDistance);
          },
          (error) => {
            console.error("Error getting geolocation:", error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      listProducts(dispatch);
      // Check if the tableno parameter is present in the URL
      const searchParams = new URLSearchParams(location.search);
      const tableno = searchParams.get('tableno');
      if (tableno) {
        // Store the tableno in the state
        setTableno(tableno);
      }

      
    }, [dispatch, location.search]);

     // Function to calculate the distance between two coordinates using the Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

    

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const { orderItems, itemsCount, totalPrice } = state.order;

  return (
    <div className={styles.root}>
      <Dialog className="dialog" maxWidth="sm" fullWidth={true} open={isOpen} onClose={closeHandler}>
        <DialogTitle className="dialogTitle">Add {product.name}</DialogTitle>
        <p className='food-desc'>{product.desc}</p>
        <Box className="row">
          <Button
            disabled={quantity === 1}
            onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
          >
            <RemoveIcon />
          </Button>
          <TextField
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Button onClick={(e) => setQuantity(quantity + 1)}>
            <AddIcon />
          </Button>
        </Box>
        <Box className="row around">
          <Button
            onClick={cancelOrRemoveFromOrder}
            className="largeButton dialogButton"
          >
            {orderItems.find((item) => item.name === product.name) ? 'Remove from Order' : 'Cancel'}
          </Button>
          <Button
            onClick={addToOrderHandler}
            className="largeButton dialogButton"
          >
            Add to Order
          </Button>
        </Box>
      </Dialog>

      <Box className="navbar">
        <img src='/images/dynnite_icon.png' alt='err' className ="navbarTitle_order"></img>
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search, Order, Enjoy"
            value={searchQuery}
            onChange={handleSearch}
          />
          <FontAwesomeIcon icon={faSearch} className="searchIcon" />
        </div>
      </Box>
      <Box className=''>
        <Box className="order_list" >
          {loadingProducts ? (
            <CircularProgress />
          ) : errorProducts ? (
            <Alert severity="error">{errorProducts}</Alert>
          ) : (
            filteredProducts.map((product) => (
              <div className='card-container' item key={product._id} >
                <div className="order_card" >

                <Link key={product.name} to={`/detailspage/${product.name}?tableno=${tableno}`}>
                  <div className='card-clickable' onClick={() => productClickHandler(product)}>
                    {product.image && (
                      <img
                        className="menu-img"
                        src={`data:image/jpeg;base64,${product.image}`}
                        alt={product.name}
                      />
                    )}
                  </div>
                  </Link>

                  <div className='product-parent'>
                    <div>
                      <div className='product-details'>
                        <span className="order_card_name">{product.name}</span>
                        <span className='order_card_category'>{product.category}</span>
                        <div className='order-card-footer'>
                          <span className='order-time'>{product.time} MINS</span>
                          <span className='order-price' variant="body2" color="textPrimary" component="p">
                            ₹ {product.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Box className="addButtonWrapper">
                      <Button
                        className="addButton"
                        onClick={() => addToCartHandler(product)}
                      >
                        <span>Add to Cart</span><i class="fa-solid fa-utensils"></i>
                      </Button>
                    </Box>
                  </div>
                </div>
              </div>
            ))
          )}
        </Box>
      </Box>
      {itemsCount > 0 && <CartPopup itemsCount={itemsCount} totalPrice={totalPrice} tableno={tableno}/>}
    </div>
  );
}

export default OrderScreen;
