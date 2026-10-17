
import { Router } from "express";
import StripeController from "../controler/stripe";
import { authentication } from "../meddileware/user";

const router = Router();
const stripeController = new StripeController();

router.post(
  "/stripe/create-checkout-session",
  authentication,
  (req, res) => stripeController.createCheckoutSession(req, res)
);

export default router;
