import React from "react";
import { Link } from "react-router-dom";

import './Product.css';

const Product = ({ product }) => {
  return (

      <div className="product">

        <div className="img-container">
          <Link to={`/product/${product._id}`}><img src={product.image} alt="" /></Link>
          <div className="addCart">
            <i className="fas fa-shopping-cart" />
          </div>

          <ul className="side-icons">
            <span><i className="far fa-heart" /></span>
          </ul>
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
