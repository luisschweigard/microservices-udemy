import {
  NotAuthorized,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@llticketing/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorized();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  }
);

export { router as deleteOrderRouter };
