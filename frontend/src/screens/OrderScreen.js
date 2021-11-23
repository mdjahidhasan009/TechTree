import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { PayPalButton } from "react-paypal-button-v2";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

import './OrderScreen.css';

const OrderScreen = ({ match, history }) => {
  const [ sdkReady, setSdkReady ] = useState(false);
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if(!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    }
    order.itemsPrice = addDecimals(order.orderItems.reduce((total, item) => total + item.price * item.qty, 0));
  }

  useEffect(() => {
    if(!userInfo) history.push('/login');
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      }
      document.body.appendChild(script);
    }

    if(!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
    else if(!order.isPaid) {
      if(!window.paypal) addPayPalScript()
      else setSdkReady(true);
    }
  }, [dispatch, orderId, successPay, order, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  }

  return loading
    ? <Loader />
    : error
      ? <Message variant='danger'>{error}</Message>
      : <>
          <h1>Order {order._id}</h1>
            <div className="order">
              <div className="order__orderDetails">
                <div className="list-group list-group-flush">
                  <div className="list-group-item">
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name: </strong> {order.user.name}</p>
                    <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}> {order.user.email}</a></p>
                    <p>
                      <strong>Address: </strong>
                      {order.shippingAddress.address},
                      {order.shippingAddress.city},
                      {order.shippingAddress.postalCode},
                      {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                        <Message variant='success'>Delivered On {order.deliveredAt}</Message>
                    ) : (
                        <Message variant='danger'>Not Delivered</Message>
                    )}
                  </div>

                  <div className="list-group-item">
                      <h2>Payment Method</h2>
                      <p>
                      <strong>Method: </strong>
                      {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <Message variant='success'>Pain On {order.paidAt}</Message>
                    ) : (
                      <Message variant='danger'>Not Paid</Message>
                    )}
                  </div>

                  <div className="list-group-item">
                    <h2>Order Items</h2>
                    {order.orderItems.length === 0 ? (
                        <Message>Your order is empty</Message>
                    ) : (
                        <div className="list-group list-group-flush">
                          {order.orderItems.map((item, index) => (
                              <div className="list-group-item" key={index}>
                                <div className="row">
                                  <div className="col-md-1">
                                    <img className="img-fluid rounded" src={item.image} alt={item.name}  />
                                  </div>
                                  <div className="col">
                                    <a href={`/product/${item.product}`}>{item.name}</a>
                                  </div>
                                  <div className="col-md-4">
                                    {item.qty} x ${item.price} =
                                    ${Number(item.qty * item.price).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="order__orderSummary">
                <div className="card">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item"><h2>Order Summary</h2></div>
                    <div className="list-group-item">
                      <div className="row">
                        <div className="col">Items</div>
                        <div className="col">${order.itemsPrice}</div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row">
                        <div className="col">Shipping</div>
                        <div className="col">${order.shippingPrice}</div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row">
                        <div className="col">Tax</div>
                        <div className="col">${order.taxPrice}</div>
                      </div>
                    </div>
                    <div className="list-group-item">
                      <div className="row">
                        <div className="col">Total</div>
                        <div className="col">${order.totalPrice}</div>
                      </div>
                    </div>
                    {!order.isPaid && (
                      <div className="list-group-item">
                        {loadingPay && <Loader />}
                        {!sdkReady ? (
                          <Loader />
                        ) : (
                          <PayPalButton
                            amount={order.totalPrice}
                            onSuccess={successPaymentHandler}
                          />
                        )}
                      </div>
                    )}

                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                      <div className="list-group-item">
                        {/*  Mark as Delivered*/}
                        {/*</Button>*/}
                        <button className="btn btn-primary" onClick={deliverHandler}>
                          Mark as Delivered
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
      </>
}

export default OrderScreen;
