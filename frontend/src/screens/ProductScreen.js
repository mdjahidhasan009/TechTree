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
  const [ rating, setRating ] = useState(0);
  const [ comment, setComment ] = useState('');

  //##
  const [ mainImg, setMainImg ] = useState({});
  const [ quantity, setQuantity ] = useState(1);
  //##

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector(state => state.productReviewCreate);
  const { error: errorProductReview, success: successProductReview } = productReviewCreate;

  useEffect(() => {
    setMainImg({url: product.image, colorCode: null, colorName: null});
    console.log(product);
  }, [product]);

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
    history.push(`/cart/${match.params.id}?qty=${quantity}`);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(rating, comment)
    dispatch(createProductReview(match.params.id, { rating, comment }));
  }

  const changeQuantity = (e) => {
    if(e.target.value === "" || parseInt(e.target.value) < 1) setQuantity(1);
    else setQuantity(parseInt(e.target.value));
    console.log(quantity);
  }

  const increaseOrDecreaseQuantity = (value) => {
    if(value < 1) setQuantity(1);
    else setQuantity(value);
  }

  //##

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
          <section className="section section--productDetails">
            <div className="container product-detail__container">
              <div className="product-details__left">
                <div className="details__container--left">
                  {/*Product Image Thumbnails*/}
                  {product?.productStock?.length > 0 && (
                    <>
                      <div className="product_images--thumbnails">
                        {product?.productStock.map((item, index) => (
                          <div className="images-container__thumbnails">
                            <img className={(mainImg.url === item.imageURL ? 'selected' : "")} id="img1"
                              src={item.imageURL} onClick={(e) => setMainImg({url: item.imageURL, colorCode: item.colorCode, colorName: item.colorName})} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/*Product Image*/}
                  <div className="product__image">
                    <img src={mainImg.url} alt="" className="image" id="imgMain"/>
                  </div>
                </div>

                  <div className="button-container">
                    <button className="addCart" onClick={addToCartHandler}>Add To Cart</button>
                    <button className="buyNow">Buy Now</button>
                  </div>

              </div>

              {/* Product Details */}
              <div className="product-details__right">
                <div className="details__container--right">
                  <h1>{product.name}</h1>
                  <div className="price">${product.price}</div>
                  <Rating value={product.rating} text={`  ${product.numReviews} reviews`} />
                  <div className="quantity">
                    <span>
                      <button className="quantity__minus"
                              onClick={() => increaseOrDecreaseQuantity(quantity - 1)}>-</button>
                    </span>

                    <input type="text" className="quantity__input" value={quantity}
                           onChange={(e) => changeQuantity(e)}/>
                    <span>
                      <button className="quantity__plus"
                              onClick={() => increaseOrDecreaseQuantity(quantity + 1)}>+</button>
                    </span>

                  </div>

                  {/*<h3>Product Detail</h3>*/}
                  {/*<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A, iusto officia pariatur quidem velit voluptate.</p>*/}
                  <div className="total-price">
                    <p>Total Price: ${product.price*quantity}</p>
                  </div>
                  <h4>Brand: {product.brand}</h4>
                  <div className="color-available">
                    {product?.productStock?.length > 0
                      ? (
                        <>
                          <div className="color-available__container">
                            <h4>Color: {mainImg.colorCode === null ? "Select One" : mainImg.colorName}</h4>
                            {product?.productStock?.map((item) => (
                                <div
                                    className={"color-available--colors " + (mainImg.colorCode === item.colorCode ? 'selected' : "")}>
                                  <span style={{ background: item.colorCode }}></span>
                                </div>
                            ))}
                          </div>

                        </>
                      )
                      :
                      ""
                    }
                  </div>
                </div>
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
