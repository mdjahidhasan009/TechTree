import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { addToCart, removeFromCart } from "../actions/cartActions";
import Message from "../components/Message";

import './stylesheets/CartScreen.css';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if(productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  }

  return (
    <div className="container cart">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Message>Your cart is empty! <Link to='/'>Go Back</Link></Message>
      ) : (
        <>
          <table>
            <tr>
              <th>Product</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>

            {cartItems.map(item => (
              <tr key={item._id}>
                <td>
                    <img src={`${process.env.REACT_APP_BACKEND_BASE_URL}${item.image}`} alt="" />
                </td>
                <td><p>{item.name}</p></td>
                <td><span>Price: ${item.price.toFixed(2)}</span></td>
                <td>
                  <input type="number" min="1" value={item.qty}
                         onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))} />
                </td>
                <td>${(item.price * item.qty).toFixed(2)}</td>
                <td>
                  <button className="btn" onClick={() => removeFromCartHandler(item.product)}>
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </table>

          <div className="total-price">
            <table>
              <tr>
                <td>Total</td>
                <td>${cartItems.reduce((total, item) => total + item.qty * item.price, 0).toFixed(2)}</td>
              </tr>
            </table>
            <button className="checkout btn" onClick={checkoutHandler} >Proceed To Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartScreen;
