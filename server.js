const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); 
require('dotenv').config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());
app.use(cors()); 

app.post("/create-checkout-session", async (req, res) => {
    try {
      const { products } = req.body;
  
      const line_items = products.map((product) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: product.price, // Price is already converted to paise
        },
        quantity: 1, // Each product in cart is purchased once
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      });
  
      res.json({ url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.listen(4242, () => console.log("Server running on port 4242"));







// const express = require("express");
// const Stripe = require("stripe");
// const cors = require("cors");
// require('dotenv').config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const app = express();

// app.use(express.json());
// app.use(cors());

// // Route to create checkout session
// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const { products } = req.body; 

//     const line_items = products.map((product) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: product.name,
//           images: product.image ? [product.image] : [],
//         },
//         unit_amount: product.price, 
//       },
//       quantity: product.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     });

//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(4242, () => console.log("Server running on port 4242"));

