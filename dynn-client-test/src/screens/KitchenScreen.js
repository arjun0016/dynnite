import { Box } from '@mui/system';
import React, { useContext, useEffect } from 'react';
import { useStyles } from '../styles'
import { Alert, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Store } from './Store';
import { listOrders } from '../actions';
import ReviewScreen from './ReviewScreen';
import axios from 'axios';


export default function KitchenScreen() {

    const styles = useStyles();

    const total = ReviewScreen.total;

    const { state, dispatch } = useContext(Store);

    const { orders, loading, error } = state.orderList;
    useEffect(() => {
        listOrders(dispatch);
    }, [dispatch]);

    const setOrderStateHandler = async (order, action) => {
        try{
           await axios.put(`${process.env.REACT_APP_BASEURL}/api/orders/` + order._id, {
            action: action,
           });
           listOrders(dispatch);   
        } catch (err) {
            alert(err.message);
        }
    }
  return (
    <Box sx={[styles.root]}>
        <Box sx={[styles.main]}>
            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity='error'>{error}</Alert>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label='Orders'>
                <TableHead>
                    <TableRow>
                        <TableCell>Order Number</TableCell>
                        {/* <TableCell align='right'>Price&nbsp;</TableCell> */}
                            <TableCell align='right'>Count</TableCell>
                            <TableCell align='right'>Items</TableCell>
                            <TableCell align='right'>Type</TableCell>
                            <TableCell align='right'>Payment</TableCell>
                            <TableCell align='right'>State</TableCell>
                            <TableCell align='right'>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.name}>
                            <TableCell component='th' scope='row'>
                                {order.number}
                            </TableCell>
                            {/* <TableCell align='right'>{order.totalPrice}</TableCell> */}
                            {/* <TableCell align='right'>{order.totalPrice}</TableCell> */}
                            <TableCell align='right'>
                                {order.orderItems.length}
                            </TableCell>
                            <TableCell align='right'>
                                {order.orderItems.map((item) => (
                                    <Box>
                                        {item.name} x {item.quantity}
                                    </Box>
                                ))}
                            </TableCell>
                            <TableCell align='right'>{order.orderType}</TableCell>
                            <TableCell align='right'>{order.paymentType}</TableCell>
                            <TableCell align='right'> 
                                {order.inProgress
                                  ? 'In Progress'
                                  :  order.isReady
                                  ?  'Ready'
                                  :  order.isDelivered
                                  ?  'Delivered'
                                  :  'Unknown'}
                            </TableCell>
                            <TableCell align='right'>
                              <Button
                                variant='contained'
                                onClick={() => setOrderStateHandler(order, 'ready')}
                                color='secondary'
                              >
                                Ready
                              </Button>
                              <Button
                                color='primary'
                                variant='contained'
                                onClick={() => setOrderStateHandler(order, 'cancel')}
                              >
                                Cancel
                              </Button>
                              <Button
                                color='primary'
                                variant='contained'
                                onClick={() => setOrderStateHandler(order, 'deliver')}
                              >
                                Deliver
                              </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
              </TableContainer>  
            ) }
        </Box>
    </Box>
  )
}
