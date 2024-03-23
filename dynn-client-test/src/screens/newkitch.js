// Frontend - KitchenScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import '../components/kitchen.css';

const socket = io.connect('/'); // Connect to the WebSocket server

export default function KitchenScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();

    // Listen for 'orderUpdate' event from the server
    socket.on('orderUpdate', (updatedOrder) => {
      // Find the updated order in the local state and update it
      const updatedOrders = orders.map((o) => {
        if (o._id === updatedOrder._id) {
          return updatedOrder;
        }
        return o;
      });
      setOrders(updatedOrders);
    });

    return () => {
      // Clean up the WebSocket connection when the component unmounts
      socket.disconnect();
    };
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/orders`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error fetching orders');
      setLoading(false);
    }
  };

  const setOrderStateHandler = async (orderId, action) => {
    try {
      let updatedField = '';
      if (action === 'serve') {
        updatedField = 'isServed';
      }

      await axios.put(`${process.env.REACT_APP_BASEURL}/api/orders/${orderId}`, {
        [updatedField]: true,
      });
    } catch (err) {
      console.error('Error updating order state:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='kitchen_contents'>
      <h2 className='kitchen_heading'>Kitchen Screen</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Table Number</TableCell>
            {/* <TableCell>Order Type</TableCell> */}
            <TableCell>Item Name</TableCell>
            <TableCell>Item Quantity</TableCell>
            <TableCell>Served</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.number}</TableCell>
              <TableCell>{order.tableno}</TableCell>
              {/* <TableCell>{order.orderType}</TableCell> */}
              <TableCell>
                {order.orderItems.map((item) => (
                  <div key={item._id}>{item.name}</div>
                ))}
              </TableCell>
              <TableCell>
                {order.orderItems.map((item) => (
                  <div key={item._id}>{item.quantity}</div>
                ))}
              </TableCell>
              <TableCell>{order.isServed ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOrderStateHandler(order._id, 'serve')}
                  disabled={order.isServed}
                >
                  Serve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
