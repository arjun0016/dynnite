import React, { useContext, useEffect } from 'react';
import { Store } from './Store';
import { createOrder } from '../actions';
import { useNavigate, useLocation } from 'react-router-dom';
import '../components/complete.css';

export default function CompleteOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { order } = state;

  const { loading, error, newOrder } = state.orderCreate;

  useEffect(() => {
    if (order.orderItems.length > 0) {
      createOrder(dispatch, {
        ...order,
        tableno: location.state?.tableno || null,
      });
    }
  }, [order, dispatch]);

  const navigate = useNavigate();
  const location = useLocation();
  const tableno = location.state?.tableno || null;

  return (
    <div className="root navy complete_parent">
      <div className="">
        <div>
          {loading ? (
            <div className="circular-progress">

            </div>
          ) : error ? (
            <div className="alert error">{error}</div>
          ) : (
            <div className='title_container'>
              <img className='complete_img animate__animated animate__jello' src='/images/complete_burger.png' />
              <h3 className="order_placed animate__animated ">Your order has been placed</h3>
              <h1 className="order_no">Order Number: {newOrder.number}</h1>
            </div>
          )}
        </div>
      </div>
      <div className="">
        <button
          onClick={() => navigate('/')}
          className="complete_button"
        >
          Order Again
        </button>
      </div>
    </div>
  );
}
