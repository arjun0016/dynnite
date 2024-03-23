import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setPaymentType } from '../actions';
import { Store } from './Store';
import '../components/select.css';

export default function SelectPaymentScreen() {
  const location = useLocation();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const priceToBePaid = location.state?.price || 0;
  const tableno = location.state?.tableno || null;

  const handlePayNow = async () => {
    const amount = parseInt(priceToBePaid, 10);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASEURL}/api/initiate-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }), 
    });
  
      const data = await response.json();
      const options = {
        key: 'rzp_test_l7BK8gNVAXOMxw',
        amount: amount, 
        currency: 'INR',
        name: 'Payment Gateway Test',
        description: 'Test payment',
        order_id: data.orderId, 
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          capturePayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);
        },
        prefill: {
          name: 'Dynnite',
          email: 'dynnite@example.com',
        },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };
  

  const capturePayment = async (paymentId, orderId, signature) => {
    try {
      const response = await fetch('${process.env.REACT_APP_BASEURL}/api/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });
  
      const responseData = await response.json();
      console.log('Capture Payment Response:', responseData);
  
      if (responseData.success) {
      
        navigate('/complete', { state: { tableno: tableno } }); // Redirect
      } else {
       
        alert('Payment verification failed!');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
    }
  };
  

  const selectHandler = (paymentType) => {
    setPaymentType(dispatch, paymentType);
    if (paymentType === 'At counter') {
      navigate('/complete', { state: { tableno: tableno } });
    } else {
      handlePayNow();
    }
  };

  const navigateToReview = () => {
    const url = tableno ? `/review?tableno=${tableno}` : `/order`;
    navigate(url);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('status');

    if (paymentStatus === 'success') {
      console.log('Payment was successful.');
      navigate('/complete', { state: { tableno: tableno } });
    }

    if (paymentStatus === 'failed') {
      console.log('Payment failed.');
      navigate('/failed');
    }
  },[navigate]);
  return (
    <div className="main_pay">
      <img className='back-btn' onClick={() => { navigateToReview();}} src='/images/back_icon.png' alt='err'></img>
      <div className="payment_parent">
        <h4 className="select-txt">PAYMENT</h4>
        <div className="card_pay counter_pay" onClick={() => selectHandler('At counter')}>
          <p>Counter Pay</p>
        </div>
      </div>

      <div className="cards_pay">
        <div className="card_pay">
          <p className="pay_online">Pay Online</p>
          <p className="pay-price">{priceToBePaid}</p>
        </div>
        <button className="pay-now" onClick={() => selectHandler('Online Pay')}>
          Pay Now
        </button>
      </div>
    </div>
  );
}
