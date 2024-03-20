import React, { useContext, useState, useEffect } from 'react';
import { useStyles } from '../styles';
import { Store } from './Store';
import '../components/review.css';
import { useNavigate, useLocation } from 'react-router-dom'; 

import { removeFromOrder } from '../actions';

export let totalValue = 0;

export default function ReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const tableno = new URLSearchParams(location.search).get('tableno');
  const [totalValue, setTotalValue] = useState(0);

  const { state, dispatch } = useContext(Store);
  const {
    orderItems,
    itemsCount,
    orderType,
  } = state.order;

  const [quantity, setQuantity] = useState(orderItems.map(() => 1));

  const handleAddClick = (orderItem, index) => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] += 1;
    setQuantity(updatedQuantity);

    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index].quantity += 1;
    dispatch({ type: 'SET_ORDER_ITEMS', payload: updatedOrderItems });
  };

  const cancelOrRemoveFromOrder = (product) => {
    removeFromOrder(dispatch, product);
  };
  

  const handleRemoveClick = (orderItem, index) => {
    if (orderItem.quantity === 1) {
      return;
    }

    const updatedQuantity = [...quantity];
    updatedQuantity[index] -= 1;
    setQuantity(updatedQuantity);

    const updatedOrderItems = [...orderItems];
    updatedOrderItems[index].quantity -= 1;
    dispatch({ type: 'SET_ORDER_ITEMS', payload: updatedOrderItems });
  };

  const proceedToCheckoutHandler = () => {
    const url = tableno ? `/select-payment?tableno=${tableno}` : '/select-payment';
    navigate(url, { state: { price: total, tableno: tableno } });
  };

  const navigateToOrder = () => {
    const url_back = tableno ? `/order?tableno=${tableno}` : `/order`;
    navigate(url_back);
  };
  
  const styles = useStyles();

  const subtotal = orderItems.reduce((sum, orderItem, index) => {
    const itemTotalPrice = orderItem.price * orderItem.quantity;
    return sum + itemTotalPrice;
  }, 0);

  const taxPrice = subtotal * 0.05;

  const total = subtotal + taxPrice;

  useState(() => {
    setTotalValue(total.toFixed(2));
  }, [total]);

  useEffect(() => {

    const searchParams = new URLSearchParams(location.search);
    const tableno = searchParams.get('tableno');
    if (tableno) {
      
      console.log('Table No:', tableno);
    }
  }, [location.search]);

  return (
    <div className='root'>
      <div className="navbar">
        <div className="navbar-left">
          <img src='/images/dynnite_text.png' alt='err' className='review_nav_txt'/>
        </div>
        <div className="navbar-right">
          <img className='cart_icon' src='/images/cart_icon.png' alt='err'/>
        </div>
      </div>
      <div className='check-parent'>
        <div className='checkout-box'>
          <div className='product-container'>
            {orderItems.map((orderItem, index) => (
            <div item md={12} key={orderItem.name}>
              <div className='card_left'>
                <div>
                  <div className='xyz'>
                    <div className='review-flex'>
                      {orderItem.image && (
                        <img
                          className="checkout-img"
                          src={`data:image/jpeg;base64,${orderItem.image}`}
                          alt={orderItem.name}
                        />
                      )}

                      <div className='item-name'>
                        <p>{orderItem.name}</p>
                        <button
                        className='remove-btn'
                        onClick={() => cancelOrRemoveFromOrder(orderItem)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className='input-parent'>
                      <div className='quantity-buttons'>
                        <button
                          className='add_dec_btn'
                          onClick={() => handleRemoveClick(orderItem, index)}
                          disabled={orderItem.quantity === 1}
                        >
                          -
                        </button>

                        <input
                          type="number"
                          className="largeNumber"
                          min={1}
                          value={orderItem.quantity}
                          onChange={(e) => {
                            const updatedQuantity = parseInt(e.target.value);
                            if (!isNaN(updatedQuantity)) {
                              const updatedQuantityArray = [...quantity];
                              updatedQuantityArray[index] = updatedQuantity;
                              setQuantity(updatedQuantityArray);

                              const updatedOrderItems = [...orderItems];
                              updatedOrderItems[index].quantity = updatedQuantity;
                              dispatch({ type: 'SET_ORDER_ITEMS', payload: updatedOrderItems });
                            }
                          }}
                        />
                        <button
                          className='add_dec_btn'
                          onClick={() => handleAddClick(orderItem, index)}
                        >
                          +
                        </button>
                      </div>
                      <p className='price'>₹{(orderItem.price * orderItem.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>

          <div className='summary_box'>
            <div>
              <div className='summary_inside'>
                <h3 className='item_count'>{itemsCount} ITEM</h3>
                <div className='summary_contents'>
                  <p>Order Type:</p>
                  <p>{orderType}</p>
                </div>
                <div className='summary_contents'>
                  <p>Subtotal:</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <div className='summary_contents'>
                  <p>GST:</p>
                  <p>₹{taxPrice.toFixed(2)}</p>
                </div>
                <hr></hr>
                <div className='summary_contents'>
                  <p>Total:</p>
                  <p>₹{total.toFixed(2)}</p>
                </div>
                <div className='review-btns'>
                  <button
                    onClick={() => {
                      navigateToOrder();
                    }}
                    className='proceed_back_btn'
                  >
                    Back
                  </button>
                  <button
                    onClick={proceedToCheckoutHandler}
                    disabled={orderItems.length === 0}
                    className='proceed_back_btn'
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
