import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Message from "../components/Message";
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  cart.itemsPrice = addDecimals(cart.cartItems.reduce((total, item) => total + item.price * item.qty, 0));
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice)).toFixed(2));
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if(success) history.push(`/order/${order._id}`);
  }, [history, success]);

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }))
  }

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <div className="list-group list-group-flush">
            <div className="list-item">
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},
                {cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country}
              </p>
            </div>

            <div className="list-item">
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </div>

            <div className="list-item">
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="list-group list-group-flush">
                  {cart.cartItems.map((item, index) => (
                    <div className="list-item" key={index}>
                      <div className="row">
                        <div className="col-md-1">
                          <img className="img-fluid rounded"
                             src={`${process.env.REACT_APP_BACKEND_BASE_URL}${item.image}`} alt={item.name} />
                        </div>
                        <div className="col">
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </div>
                        <div className="col-md-4">
                          {item.qty} x ${item.price} = ${Number(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="list-group list-group-flush">
              <div className="list-item"><h2>Order Summary</h2></div>
              <div className="list-item">
                <div className="row">
                  <div className="col">Items</div>
                  <div className="col">${cart.itemsPrice}</div>
                </div>
              </div>
              <div className="list-item">
                <div className="row">
                  <div className="col">Shpping</div>
                  <div className="col">${cart.shippingPrice}</div>
                </div>
              </div>
              <div className="list-item">
                <div className="row">
                  <div className="col">Tax</div>
                  <div className="col">${cart.taxPrice}</div>
                </div>
              </div>
              <div className="list-item">
                <div className="row">
                  <div className="col">Total</div>
                  <div className="col">${cart.totalPrice}</div>
                </div>
              </div>
              <div className="list-item">
                {error && <Message variant='danger'>{error}</Message>}
                <button className='btn btn-block' disabled={cart.cartItems === 0}
                        onClick={placeOrderHandler}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaceOrderScreen;
