import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import './App.css';
import ChooseScreen from './screens/ChooseScreen';
import HomeScreen from './screens/HomeScreen'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OrderScreen from './screens/OrderScreen';
import ReviewScreen from './screens/ReviewScreen';
import SelectPaymentScreen from './screens/SelectPaymentScreen';
import CompleteOrderScreen from './screens/CompleteOrderScreen';
import KitchenScreen from './screens/KitchenScreen';
import AdminScreen from './screens/AdminScreen';
import OrderDetailsPage from './screens/newkitch';

import PaymentScreen from './screens/PaymentScreen';
import Failed from './screens/failed'

const theme = createTheme({
  typography: {
    h1: { fontWeight: 'bold' },
    h2: {
      fontSize: '2rem',
      color: 'black',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
    },
  },
  palette: {
    Primary: { main: '#ff1744' },
    Secondary: {
      main: '#118e16',
      contrastText: '#ffffff',
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <>
          <Routes>
            {/* Define the HomeScreen route with a dynamic tableno value */}
            <Route path='/' element={<HomeScreen />} />
            <Route path='/admin' element={<AdminScreen />} />
            {/* Pass the tableno as a prop to the ChooseScreen */}
            <Route path='/choose' element={<ChooseScreen />} />
            {/* Pass the tableno as a prop to the OrderScreen */}
            <Route path='/order' element={<OrderScreen />} />
            <Route path='/review' element={<ReviewScreen />} />
            <Route path='/select-payment' element={<SelectPaymentScreen />} />
            <Route path='/complete' element={<CompleteOrderScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/kitchen' element={<OrderDetailsPage />} />
            <Route path='/failed' element={<Failed />} />
          </Routes>
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
