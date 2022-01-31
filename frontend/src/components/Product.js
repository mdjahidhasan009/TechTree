import React from "react";
import { Link } from "react-router-dom";

import "./stylesheets/Product.css";

const Product = ({ product }) => {
  return (

      <div className="product">

        <div className="img-container">
          <Link to={`/product/${product._id}`}>
            <img src={`${process.env.REACT_APP_BACKEND_BASE_URL}${product.image}`} alt="" />
          </Link>
          <div className="addCart">
            <Link to={`/cart/${product._id}?qty=1`}><i className="fas fa-shopping-cart" /></Link>
          </div>
        </div>

        <div className="bottom">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
          <div className="price">
            <span>${product.price}</span>
          </div>
        </div>
      </div>
  )
}

export default Product;
