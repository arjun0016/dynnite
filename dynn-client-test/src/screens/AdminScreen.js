import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/admin.css";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Modal,
  TextField,
} from "@mui/material";

export default function AdminScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  console.log("baseurl",process.env.REACT_APP_BASEURL)

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/api/admin/login`,
        {
          username,
          password,
        }
      );
      console.log(response);
      if (response.data.isAdminLoggedIn) {
        setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');

      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
  };

  useEffect(() => {
    // Check if the user is logged in on page load
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setSelectedSection(null);
    localStorage.removeItem('isLoggedIn');

  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    if (section === "dashboard") {
      setSelectedSection(null);
    } else {
      setSelectedSection(section);
    }
  };

  const [activeSection, setActiveSection] = useState("");

  if (isLoggedIn) {
    return (
      <div>
        <nav className="navbar-admin">
          <div className="navbar-admin-left">
            <img
              src="/images/dynnite_text.png"
              alt="err"
              className="admin-head"
            />
          </div>
          <div className="navbar-admin-right">
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className="dashboard-container">
          <div className="sidebar">
            <div className="dash-options">
              <p
                className={activeSection === "dashboard" ? "active" : ""}
                onClick={() => handleSectionClick("dashboard")}
              >
                <i class="fa-solid fa-chart-line"></i>Dashboard
              </p>
              <p
                className={activeSection === "orders" ? "active" : ""}
                onClick={() => handleSectionClick("orders")}
              >
                <i class="fa-solid fa-check-double"></i>Current Orders
              </p>
              <p
                className={activeSection === "previousOrders" ? "active" : ""}
                onClick={() => handleSectionClick("previousOrders")}
              >
                <i class="fa-solid fa-calendar-check"></i>Previous Orders
              </p>
              <p
                className={activeSection === "foods" ? "active" : ""}
                onClick={() => handleSectionClick("foods")}
              >
                <i class="fa-solid fa-champagne-glasses"></i>Food Section
              </p>
            </div>
          </div>
          <div className="main-content">
            {selectedSection === "orders" && <OrdersSection />}
            {selectedSection === "previousOrders" && <PreviousOrdersSection />}
            {selectedSection === "foods" && <FoodsSection />}
            {selectedSection === null && <WelcomeMessage />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form className="form-container" onSubmit={handleLogin}>
        <p className="welcome_back">Login to Access</p>
        <p className="enter_details">Welcome back! Please enter your details</p>
        <label>
          Username <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className="btn-login" type="submit">
          Login
        </button>
      </form>
      <div className="login-img-container">
        <img className="login-img" src="/images/login_img.svg" alt="" />
      </div>
    </div>
  );
}

function WelcomeMessage() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [todaysOrders, setTodaysOrders] = useState(0);
  const [orderChartData, setOrderChartData] = useState([]);

  useEffect(() => {
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/all-orders`);
      const orderData = response.data;

      // Calculate the total number of orders
      const totalOrdersCount = orderData.length;
      setTotalOrders(totalOrdersCount);

      // Calculate the number of today's orders
      const today = new Date().toLocaleDateString();
      const todayOrdersCount = orderData.filter(
        (order) => new Date(order.createdAt).toLocaleDateString() === today
      ).length;
      setTodaysOrders(todayOrdersCount);

      // Prepare the chart data
      const ordersByDate = orderData.reduce((accumulator, order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        accumulator[orderDate] = (accumulator[orderDate] || 0) + 1;
        return accumulator;
      }, {});
      const chartData = Object.entries(ordersByDate).map(([date, count]) => ({
        date,
        count,
      }));
      setOrderChartData(chartData);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to Admin Screen!</h2>
      <div className="admin-box">
        <p className="total-order-box">Total Orders: {totalOrders}</p>
        <p className="today-order-box">Today's Orders: {todaysOrders}</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={orderChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  

  useEffect(() => {
    fetchOrders();

    // Fetch orders every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchOrders, 2000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const calculateSubtotal = (order) => {
    return order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    const updateOrderStatus = (updatedOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          if (order._id === updatedOrder._id) {
            return updatedOrder;
          }
          return order;
        });
        return updatedOrders;
      });
    };

    const subscribeToOrderStatusUpdates = () => {
      // Establish a WebSocket connection for real-time updates
      const socket = new WebSocket("ws://localhost:8000/api/orders");

      console.log(process.env.SOCKET_URL)

      socket.onmessage = (event) => {
        const updatedOrder = JSON.parse(event.data);
        updateOrderStatus(updatedOrder);
      };

      socket.onclose = () => {
        // Reconnect if the WebSocket connection is closed
        setTimeout(subscribeToOrderStatusUpdates, 2000);
      };
    };

    subscribeToOrderStatusUpdates();
  }, []);

  const setOrderStateHandler = async (orderId, action) => {
    try {
      if (action === "deliver") {
        await axios.put(`${process.env.REACT_APP_BASEURL}/api/orders/${orderId}`, {
          isDelivered: true,
        });

        // Update the order locally
        const updatedOrders = orders.map((o) => {
          if (o._id === orderId) {
            return { ...o, isDelivered: true };
          }
          return o;
        });
        setOrders(updatedOrders);
      } else if (action === "cancel") {
        // Implement cancel functionality if needed
      }
    } catch (err) {
      console.error("Error updating order state:", err);
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Orders Section</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order Number</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Payment Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Served</TableCell>
            <TableCell>Delivered</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.number}</TableCell>
              <TableCell>
                {order.orderItems.map((item) => (
                  <span key={item._id}>
                    {item.name}
                    <br />
                  </span>
                ))}
              </TableCell>
              <TableCell>{order.paymentType}</TableCell>
              <TableCell>
                {order.orderItems.map((item) => (
                  <span key={item._id}>
                    {item.quantity}
                    <br />
                  </span>
                ))}
              </TableCell>
              <TableCell>
                {order.orderItems.map((item) => (
                  <span key={item._id}>
                    {item.price * item.quantity}
                    <br />
                  </span>
                ))}
              </TableCell>
              <TableCell>{calculateSubtotal(order)}</TableCell>
              <TableCell>{order.totalPrice}</TableCell>
              <TableCell>{order.isServed ? "Yes" : "No"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOrderStateHandler(order._id, "deliver")}
                  disabled={!order.isServed}
                >
                  Deliver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PreviousOrdersSection() {
  const [previousOrders, setPreviousOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchPreviousOrders();

    // Fetch previous orders every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchPreviousOrders, 2000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = previousOrders.filter(
        (order) =>
          new Date(order.createdAt).toDateString() ===
          selectedDate.toDateString()
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(previousOrders);
    }
  }, [selectedDate, previousOrders]);

  const fetchPreviousOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/all-orders`);
      setPreviousOrders(response.data);
    } catch (error) {
      console.error("Error fetching previous orders:", error);
    }
  };

  const calculateSubtotal = (order) => {
    return order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShowAllOrders = () => {
    setSelectedDate(null);
  };

  const handleShowTodayOrders = () => {
    const today = new Date().toDateString();
    setSelectedDate(new Date());
    const filtered = previousOrders.filter(
      (order) => new Date(order.createdAt).toDateString() === today
    );
    setFilteredOrders(filtered);
  };

  return (
    <div>
      <h2>Previous Orders Section</h2>
      <div className="date-picker-container">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="date-picker-input"
          placeholderText="Select Date"
        />
      </div>
      <div className="order-buttons">
        <Button onClick={handleShowAllOrders}>All Orders</Button>
        <Button onClick={handleShowTodayOrders}>Today's Orders</Button>
      </div>
      <div className="tableContainer">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Order Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.number}</TableCell>
                <TableCell>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>
                      {item.name}
                      <br />
                    </span>
                  ))}
                </TableCell>
                <TableCell>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>
                      {item.price * item.quantity}
                      <br />
                    </span>
                  ))}
                </TableCell>
                <TableCell>{calculateSubtotal(order)}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FoodsSection() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASEURL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
    resetFormFields();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setName(product.name);
    setDesc(product.desc);
    setPrice(product.price);
    setTime(product.time);
    setCategory(product.category);
    // Set image if required
  };

  const handleSaveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("price", price);
      formData.append("time", time);
      formData.append("category", category);
      formData.append("image", image);

      await axios.post(`${process.env.REACT_APP_BASEURL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      closeModal();
      resetFormFields();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      // Handle the error
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("price", price);
      formData.append("time", time);
      formData.append("category", category);
      formData.append("image", image);

      await axios.put(
        `${process.env.REACT_APP_BASEURL}/api/products/${selectedProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type":"multipart/form-data",
          },
        }
      );

      closeModal();
      resetFormFields();
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      // Handle the error
    }
  };

  const handleCancel = () => {
    closeModal();
    resetFormFields();
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const product = await axios.delete(
        `${process.env.REACT_APP_BASEURL}/api/products/${productId}`
      );
      alert("delete")
      window.location.reload();
      console.log(product);
    } catch (error) {
      console.log("error on deleting");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const resetFormFields = () => {
    setName("");
    setDesc("");
    setPrice("");
    setTime("");
    setCategory("");
    setImage(null);
  };

  return (
    <div>
      <h2>Foods Section</h2>
      <Button onClick={handleAddProduct}>Add Product</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.desc}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.time}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEditProduct(product)}>
                    Edit
                  </Button>
                  <Button className="del-button" onClick={() => handleDeleteProduct(product._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal className="modal" open={isModalOpen} onClose={handleCancel}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedProduct ? "Edit Product" : "Add Product"}</h3>
          </div>
          <div className="modal-input">
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="modal-input">
            <TextField
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="modal-input">
            <TextField
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="modal-input">
            <TextField
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="modal-input">
            <TextField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="modal-input">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="modal-footer">
            {selectedProduct ? (
              <Button onClick={handleUpdateProduct}>Update</Button>
            ) : (
              <Button onClick={handleSaveProduct}>Save</Button>
            )}
            <Button  onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
