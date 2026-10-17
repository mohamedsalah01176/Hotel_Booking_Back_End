import { Router } from "express";
import PayPalController from "../controler/paypal";
import { authentication } from "../meddileware/user";


const router = Router();
const controller = new PayPalController();

router.post("/paypal/create-order", authentication, (req, res) =>
  controller.createOrder(req, res)
);

router.post("/paypal/capture-order", authentication, (req, res) =>
  controller.captureOrder(req, res)
);

export default router;