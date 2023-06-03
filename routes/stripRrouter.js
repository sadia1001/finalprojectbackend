import express from "express";
import Stripe from "stripe";
//const Stripe=require("stripe");
import dotenv from "dotenv";
dotenv.config();
// const app = express();
const stripe = Stripe(process.env.STRIPE_KEY);
// const router = express.Router();
const stripeRouter = express.Router();
stripeRouter.post("/create-checkout-session", async (req, res) => {
  console.log(req.body, "hello");

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          // images: item.image,
          description: item.description,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };

    console.log(item.name, "yyyr");
    console.log(item.image, "yyyr");
    console.log(item.description, "yyyr");
  });

  const session = await stripe.checkout.sessions.create({
    line_items,

    // line_items: [
    //   {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: req.body.cartItems[0].name,
    //       },
    //       unit_amount: 2000,
    //     },
    //     quantity: 1,
    //   },
    // ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({ url: session.url });
});
export default stripeRouter;
