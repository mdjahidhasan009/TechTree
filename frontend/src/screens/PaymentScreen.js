import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import FormContainer from "../components/FormContainer";
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = ({ history }) => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  if(!shippingAddress) history.push('/shipping');

  const [ paymentMethod, setPaymentMethod ] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  }

  return <FormContainer>
    <h1>Payment Method</h1>
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <legend>
          Select Method
        </legend>
        <div className="col">
          <div className="form-check">
            <input name="paymentMethod" type="radio" id="PayPal" className="form-check-input" value="PayPal" checked />
            <label title="" htmlFor="PayPal" className="form-check-label">PayPal or Credit Card</label>
          </div>
        </div>
      </div>
      <button className="btn btn-default">Continue</button>
    </form>
  </FormContainer>
}

export default PaymentScreen;
