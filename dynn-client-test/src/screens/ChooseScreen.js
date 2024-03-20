import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBucket } from '@fortawesome/free-solid-svg-icons';
import Logo from '../components/Logo';
import { Store } from './Store';
import { setOrderType } from '../actions';
import '../components/choose.css';

export default function ChooseScreen() {
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tableno = urlParams.get('tableno') || 1; // Extract the tableno value from the URL query parameters or set a default value of 1
    const chooseHandler = (orderType) => {
      setOrderType(dispatch, orderType);
      navigate(`/order?tableno=${tableno}`);
    };

    chooseHandler('Eat in');
  }, [location.search, dispatch, navigate]);

  return (
    <div>
      <div className="navbar">
        <div className="navbar_left">
          <span className="logo_text">DYNNITE</span>
        </div>
        <div className="navbar_right">
          <FontAwesomeIcon icon={faBucket} />
        </div>
      </div>
      <div className="choose_screen">
        <div className="main">
          <div className="center">
            <Logo className="logo" />
          </div>
          <h3 className="center">Where will you be eating today?</h3>
          {/* No need to render the cards */}
        </div>
      </div>
    </div>
  );
}
