// Backend - app.js
const express = require("express");
const fetch = require("isomorphic-fetch");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const multer = require("multer");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const storage = multer.memoryStorage();
const upload = multer({ storage });

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = mongoose.model("Admin", adminSchema);

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    name: String,
    desc: String,
    category: String,
    image: Buffer,
    price: Number,
    time: Number,
  })
);



app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("username", username);

  try {
    const admin = await Admin.findOne({ username });
    console.log("admin");
    console.log(admin);

    if (!admin) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    if (password !== admin.password) {
      return res.status(401).send({ message: "Invalid username or password" });
    }

    res.send({ message: "Login successful", isAdminLoggedIn: true });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.get("/api/products/seed", async (req, res) => {
  try {
    const products = await Product.insertMany(data.products);
    res.send({ products });
  } catch (error) {
    console.error("Error seeding products:", error);
    res.status(500).send({ error: "Failed to seed products" });
  }
});

app.get("/api/products", async (req, res) => {
  const { category } = req.query;
  const products = await Product.find(category ? { category } : {});

  // Convert image buffer to base64-encoded string
  const productsWithBase64Image = products.map((product) => ({
    ...product._doc,
    image: product.image.toString("base64"),
  }));

  res.send(productsWithBase64Image);
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, desc, price, time, category } = req.body;
  const { buffer } = req.file;

  try {
    const newProduct = new Product({
      name,
      desc,
      image: buffer,
      price,
      time,
      category,
    });

    const savedProduct = await newProduct.save();
    res.send(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price, desc, time, category } = req.body;

  try {
    let updatedProductData = {
      name,
      desc,
      price,
      time,
      category,
    };

    if (req.file) {
      const { buffer } = req.file;
      updatedProductData.image = buffer;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedProductData,
      { new: true }
    );

    if (updatedProduct) {
      res.send(updatedProduct);
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({ error: "Failed to update product" });
  }
});

// delete an item

app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    const deleteAnItem = await Product.findByIdAndDelete(id);

    if (deleteAnItem) {
      return res.status(200).json({ message: "Deleted an item" });
    }

    if (!deleteAnItem) {
      return res.status(404).json({ message: "Couldnt delete product" });
    }
  } catch (error) {
    console.log("error delteing an item", error);
    res.status(500).send({ error: "Failed to delete product" });
  }
});

const Order = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      number: { type: Number, default: 0 },
      orderType: String,
      paymentType: String,
      tableno: String,
      isPaid: { type: Boolean, default: false },
      isReady: { type: Boolean, default: false },
      inProgress: { type: Boolean, default: false },
      isCanceled: { type: Boolean, default: false },
      isServed: { type: Boolean, default: false },
      isDelivered: { type: Boolean, default: false },
      itemsPrice: Number,
      taxPrice: Number,
      totalPrice: Number,
      orderItems: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

app.get("/api/orders", async (req, res) => {
  const orders = await Order.find({ isDelivered: false, isCanceled: false });
  res.send(orders);
});

app.get("/api/all-orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.send(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ error: "Failed to fetch orders" });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { isServed, isDelivered, isPaid } = req.body;

  try {
    const order = await Order.findById(id);
    if (order) {
      if (isServed !== undefined) {
        order.isServed = isServed;
      }
      if (isDelivered !== undefined) {
        order.isDelivered = isDelivered;
      }
      if (isPaid && (isServed !== undefined || isDelivered !== undefined)) {
        // Handle payment logic here if required
      }

      await order.save();

      // Broadcast the updated order to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(order));
        }
      });

      res.send({ message: "Order updated successfully" });
    } else {
      res.status(404).send({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send({ error: "Failed to update order" });
  }
});

app.post("/api/orders", async (req, res) => {
  const lastOrder = await Order.find().sort({ number: -1 }).limit(1);
  const lastNumber = lastOrder.length === 0 ? 0 : lastOrder[0].number;

  if (
    !req.body.orderType ||
    !req.body.paymentType ||
    !req.body.orderItems ||
    req.body.orderItems.length === 0
  ) {
    return res.send({ message: "Data is required" });
  }

  const { orderType, paymentType, tableno, orderItems } = req.body;

  const itemsPrice = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxPrice = 0.05 * itemsPrice;
  const totalPrice = itemsPrice + taxPrice;

  const order = await Order({
    number: lastNumber + 1,
    orderType,
    paymentType,
    tableno,
    isPaid: false,
    isReady: false,
    inProgress: false,
    isCanceled: false,
    isServed: false,
    isDelivered: false,
    itemsPrice,
    taxPrice,
    totalPrice,
    orderItems,
  }).save();

  // Broadcast the new order to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(order));
    }
  });

  res.send(order);
});

// Create an instance of Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_l7BK8gNVAXOMxw",
  key_secret: "dZTEB9B0Tp99SUMr39EVSmGm",
});

// Endpoint to initiate the payment using Razorpay
app.post("/api/initiate-payment", async (req, res) => {
  const amount = req.body.amount;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_1",
    payment_capture: 1,
  };

  try {
    // Create the Razorpay order
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.error("Error creating order:", err);
        return res.status(500).send({ error: "Payment initiation failed" });
      }

      // Send the order ID (order.id) to the frontend
      res.send({ orderId: order.id });
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});



app.post("/api/capture-payment", async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  // Razorpay secret key
  const key_secret = "dZTEB9B0Tp99SUMr39EVSmGm";

  try {
    // Create the expected signature using the secret key and other data
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    // Compare the expected signature with the received signature
    if (expectedSignature !== signature) {
      console.error("Payment signature mismatch");
      return res.status(500).send({ error: "Payment verification failed" });
    }

    // Payment verification successful
    res.send({ success: true });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.json({ success: false });
  }
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running at Port ${port}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("WebSocket connection established");
  socket.send("WebSocket connection established");

  // Send initial orders data to the connected client
  Order.find({ isDelivered: false, isCanceled: false }).then((orders) => {
    socket.send(JSON.stringify(orders));
  });

  // WebSocket message handling
  socket.on("message", (message) => {
    console.log("Received message:", message);
  });

  // WebSocket order update handling
  socket.on("orderUpdate", (orderUpdate) => {
    try {
      const parsedUpdate = JSON.parse(orderUpdate);
      const { orderId, isServed, isDelivered, isPaid } = parsedUpdate;

      Order.findById(orderId).then((order) => {
        if (order) {
          if (isServed !== undefined) {
            order.isServed = isServed;
          }
          if (isDelivered !== undefined) {
            order.isDelivered = isDelivered;
          }
          if (isPaid && (isServed !== undefined || isDelivered !== undefined)) {
            // Handle payment logic here if required
          }

          order.save().then((updatedOrder) => {
            // Broadcast the updated order to all connected clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(updatedOrder));
              }
            });
          });
        }
      });
    } catch (error) {
      console.error("Error processing order update:", error);
    }
  });
});
