import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./stylesheets/CheckoutSteps.css";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="justify-content-center nav row">
      <div className="col-md-6 col-12">
        <div className="nav-item">
          {step1 ? (
              <Link to='/login'>
                <Nav.Link>Sign In</Nav.Link>
              </Link>
          ) : (
              <Nav.Link disabled>Sign In</Nav.Link>
          )}
        </div>
        <Nav.Item>
          {step2 ? (
              <Link to='/shipping'>
                <Nav.Link>Shipping</Nav.Link>
              </Link>
          ) : (
              <Nav.Link disabled>Shipping</Nav.Link>
          )}
        </Nav.Item>
        <Nav.Item>
          {step3 ? (
              <Link to='/payment'>
                <Nav.Link>Payment</Nav.Link>
              </Link>
          ) : (
              <Nav.Link disabled>Payment</Nav.Link>
          )}
        </Nav.Item>
        <Nav.Item>
          {step4 ? (
              <Link to='/placeorder'>
                <Nav.Link>Place Order</Nav.Link>
              </Link>
          ) : (
              <Nav.Link disabled>Place Order</Nav.Link>
          )}
        </Nav.Item>
      </div>
    </div>
  )
}

export default CheckoutSteps;
