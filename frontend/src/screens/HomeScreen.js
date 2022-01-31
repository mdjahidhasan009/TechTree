import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

import { listProducts } from "../actions/productAction";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import Carousel from "../components/Carousel";

import "./stylesheets/HomeScreen.css";

const HomeScreen = ({ match, history }) => {
  const [ allBrands, setAllBrands ] = useState([]);
  const [ brandsNeed, setBrandsNeed ] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();

  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const productList = useSelector(state => state.productList);
  const { loading, error, products, totalPages, brands } = productList;

  useEffect(() => {
    if(brands) {
      const tempAllBrands = [...brands];
      if(brandsNeed.length > 0) {
        tempAllBrands.map(item => {
          if(brandsNeed.indexOf(item.name) > -1) {
            item.isChecked = true;
          }
        })
      }
      setAllBrands(tempAllBrands);
    }

  }, [brands, brandsNeed])

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber, brandsNeed));
    if(location?.state?.brandsNeed) {
      setBrandsNeed(location?.state?.brandsNeed);
      location.state.brandsNeed = null;
    }
  }, [dispatch, keyword, pageNumber, brandsNeed]);

  const changeCheck = async (e, index) => {
    e.preventDefault();
    const updatedBrands = [...allBrands];
    let tempBrandsNeed = [ ...brandsNeed];

    //updating ui
    updatedBrands.map((item, i) => {
      if(i === index) item.isChecked = !updatedBrands[i].isChecked;
    });
    // updatedBrands[index].isChecked = !updatedBrands[index].isChecked;
    setAllBrands(updatedBrands);

    //updating brandsNeed state which will be used in filtering
    if(updatedBrands[index].isChecked) {
      tempBrandsNeed.push(updatedBrands[index].name);
      setBrandsNeed(tempBrandsNeed);
    }
    else {
      const updatedBrandsNeed = tempBrandsNeed.filter(item=> item !== updatedBrands[index].name);
      setBrandsNeed(updatedBrandsNeed);
    }

  }

  return (
    <>
      <Meta />
      {!keyword && !(pageNumber)
        ? <Carousel />
        : (
            <Link style={{ marginBottom: 15, display: "inline-block" }} to='/' className='btn btn-light'>Go Back</Link>
        )
      }
      {/*Products */}
      <section className="section products">
        {!keyword && !pageNumber && (
          <div className="title">
            <h2>All Products</h2>
            <span><small>Select from the premium product and save plenty money.</small></span>
          </div>
        )}

        <div className="product-layout">
          {(keyword !== undefined || pageNumber !== undefined) && (
            <div className="filter-container">
              {/* All filter options */}
              <h4>Brands</h4>
              {allBrands && (
                <ul>
                  {allBrands.map(( item, index) => {
                    return (
                        <li key={index}>
                          <div className="toppings-list-item">
                            <div className="left-section">
                              <input
                                  type="checkbox"
                                  id={`custom-checkbox-${index}`}
                                  name={item.name}
                                  value={item.value}
                                  checked={item.isChecked}
                              />
                              <label onClick={(e) => changeCheck(e, index)}
                                     htmlFor={`custom-checkbox-${index}`}>{item.name}</label>
                            </div>
                          </div>
                        </li>
                    );
                  })}
                </ul>
              )}

            </div>
          )}

          <div className={`products-container${(keyword !== undefined || pageNumber !== undefined) ? " width-95" : ""}`}>
            {products.map(product => (
                <Product product={product} key={product._id}/>
            ))}
          </div>
        </div>

      </section>
      <Paginate history={history} totalPages={totalPages} pageNumber={pageNumber} keyword={keyword ? keyword : ''}
        brandsNeed={brandsNeed}/>
    </>
  )
}

export default HomeScreen;
