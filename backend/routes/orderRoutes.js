import express from "express";

import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToPaid,
  updateOrderToDelivered
} from "../controllers/orderController.js";
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
// /api/orders
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, isAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

export default router;
