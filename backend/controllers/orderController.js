import expressAsyncHandler from "express-async-handler";

import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = expressAsyncHandler(async(req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if(orderItems && orderItems === 0) {
    res.status(400)
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
})

// @desc    Get order by Id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = expressAsyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if(order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
})

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = expressAsyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id);

  if(order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    }

    const updatedOrder = await order.save()
    res.json(updatedOrder)

  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
})

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = expressAsyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id);

  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save()
    res.json(updatedOrder)

  } else {
    res.status(404);
    throw new Error('Order Not Found!');
  }
})

// @desc    Get logged in user order
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = expressAsyncHandler(async(req, res) => {
  try {
    const orders = await Order.find({ user : req.user._id });
    res.json(orders);
  } catch (e) {
    console.log(e);
  }
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/admin
const getOrders = expressAsyncHandler(async(req, res) => {
  try {
    const orders = await Order.find({ }).populate('user', 'id name');
    res.json(orders);
  } catch (e) {
    console.log(e);
  }
})



export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered };
