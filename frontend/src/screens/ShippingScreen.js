import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

import FormContainer from "../components/FormContainer";
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = ({ history }) => {
  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  const [ address, setAddress ] = useState(shippingAddress.address);
  const [ city, setCity ] = useState(shippingAddress.city);
  const [ postalCode, setPostalCode ] = useState(shippingAddress.postalCode);
  const [ country, setCountry ] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push('/payment');
  }

  return <FormContainer>
    <h1>Shipping</h1>
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label className="form-label" htmlFor="address">Name</label>
        <input
          id="address"
          type="text"
          className="form-control"
          placeholder="Enter Address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          className="form-control"
          placeholder="Enter City Name"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          type="text"
          className="form-control"
          placeholder="Enter Postal Code"
          value={postalCode}
          required
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="country">country</label>
        <input
          id="country"
          type="text"
          className="form-control"
          placeholder="Enter Country"
          value={country}
          required
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <button className="btn btn-primary">Continue</button>
    </form>
  </FormContainer>
}

export default ShippingScreen;
