import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Rating from "../components/Rating";
import { listProductDetails, createProductReview } from "../actions/productAction";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

import './ProductScreen.css';

const ProductScreen = ({ history, match }) => {
  const [ qty, setQty ] = useState(1);
  const [ rating, setRating ] = useState(0);
  const [ comment, setComment ] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector(state => state.productReviewCreate);
  const { error: errorProductReview, success: successProductReview } = productReviewCreate;

  useEffect(() => {
    if(successProductReview) {
      alert('Review Submitted');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(rating, comment)
    dispatch(createProductReview(match.params.id, { rating, comment }));
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          {/*Product Details */}
          <section className="section product-details">
            <div className="details container">
              <div className="left">
                <div className="main">
                  <img src={product.image} alt="" />
                </div>
              </div>

              <div className="right">
                <h1>{product.name}</h1>
                <div className="price">${product.price}</div>
                <Rating value={product.rating} text={`  ${product.numReviews} reviews`} />
                <form action="">
                  <div>
                    <select onChange={(event => setQty(event.target.value))}>
                      <option value="Select Quantity" selected disabled>Select Quantity</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <span><i className="fas fa-chevron-down" /></span>
                  </div>
                </form>
                <button className="addCart" onClick={addToCartHandler}>Add To Cart</button>


                <h3>Product Detail</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur fuga id maiores nesciunt nisi odit, quis quisquam ratione recusandae voluptatem?</p>
              </div>
            </div>

            {/*Review of product */}
            <div className="container product-review">
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              {product.reviews.map((review) => (
                <div className="preview-list" key={product._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating}  text=''/>
                  <p>{review.createdAt.substring(0,10)}</p>
                  <p>{review.comment}</p>
                  <hr/>
                </div>
              ))}
              <div className="preview-create">
                {userInfo ? (
                    <>
                      <h2>Write a Customer Review</h2>
                      {errorProductReview && (
                          <Message variant='danger'>{errorProductReview}</Message>
                      )}
                      <form action="">
                        <div className="form-group">
                          <label className="form-label" htmlFor="rating">Rating</label>
                          <select id="rating" className="form-control" type="select" value={rating}
                                  onChange={(e) => setRating(e.target.value)}
                          >
                            <option value=''>Select...</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="comment">Comment</label>
                          <textarea className="form-control" id="comment" value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <button onClick={submitHandler} type="submit" className="btn btn-default">Submit</button>
                      </form>
                    </>
                ): (
                  <Message>Please <Link to="/login">sign in</Link> to write a review</Message>
                  )}
              </div>
            </div>
          </section>
        </>
      )
      }
    </>
  )
}

export default ProductScreen;
