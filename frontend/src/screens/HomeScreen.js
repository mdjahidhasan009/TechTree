import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';

import { listProducts } from "../actions/productAction";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import Carousel from "../components/Carousel";

const HomeScreen = ({ match }) => {
  const dispatch = useDispatch();

  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, totalPages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
      <>
        <Meta />
        {!keyword && !(pageNumber)
            ? <Carousel />
            : (
                <Link to='/' className='btn btn-light'>Go Back</Link>
            )
        }
        {/*Products */}
        {/*<Carousel />*/}
        <section className="section products">
          <div className="title">
            <h2>New Products</h2>
            <span><small>Select from the premium product and save plenty money.</small></span>
          </div>

          <div className="product-layout">
            {products.map(product => (
                <Product product={product} key={product._id}/>
            ))}
          </div>
        </section>
        <Paginate totalPages={totalPages} page={page} keyword={keyword ? keyword : ''} />
      </>
  )
}

export default HomeScreen;
