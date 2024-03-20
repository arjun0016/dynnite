import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../components/cartpopup.css'
import 'animate.css';

function CartPopup({ itemsCount, totalPrice, tableno }) {
    return (
        <Box className="animate__animated animate__bounceInUp cartPopup">
            <div className="cartDetails_popup">
                {itemsCount > 0 && (
                    <div className="">
                        <span className="itemCount_popup">{itemsCount} item | </span>
                    </div>
                )}
                <span variant="body2" color="textSecondary" className="itemCount_popup">
                    &nbsp; {totalPrice ? `₹ ${totalPrice.toFixed(2)}` : '₹ 0'}
                </span>
            </div>
            {itemsCount > 0 && (
                <Link to={`/review?tableno=${tableno}`} className="goToCartButton">
                    Go to Cart
                </Link>
            )}
        </Box>
    );
}

export default CartPopup;