// HomeScreen.js
import React from 'react';
import '../components/home.css';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const urlParams = new URLSearchParams(window.location.search);
  const tableno = urlParams.get('tableno') || 1;
  return (
    <div className='home_screen'>
      <img src='/images/hotel_logo.png' alt='err' className='hotel_logo' />
      <div className='content'>
        <h2 className='title'>Welcome to<br /><span className='highlight'>Mugal Grill </span>Cafe</h2>
        <p className='description'>We serve food, harmony, and laughter. Making delicious food and providing a wonderful<br /> eating experience since 1988.</p>
        <div className='button_container'>
          <Link to={`/choose?tableno=${tableno}`} className='menu_link'>View Menu</Link>
        </div>
      </div>
      <div className='menu_button_topright'>
        <Link to={`/choose?tableno=${tableno}`}>
          <button>View Menu</button>
        </Link>
      </div>
    </div>
  );
}
