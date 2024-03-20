import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './screens/Store'; // Update the import path
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
