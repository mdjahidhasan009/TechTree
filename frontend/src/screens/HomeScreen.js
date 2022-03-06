import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { listProducts, listTopProducts } from "../actions/productAction";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import Carousel from "../components/Carousel";

import "./stylesheets/HomeScreen.css";

const HomeScreen = ({ match, history }) => {
  const [ brandsNeed, setBrandsNeed ] = useState([]);
  const [ categoriesNeed, setCategoriesNeed ] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();

  const [ keyword, setKeyword ] = useState("");
  const [ pageNumber, setPageNumber ] = useState(0);

  const productList = useSelector(state => state.productList);
  const { loading, error, products, totalPages, brands, categories } = productList;

  const topProductList = useSelector(state => state.productTopRated);
  const { phones, earphones, tablets, laptops, smartWatches } = topProductList.products;

  //If keyword/pageNumber/brandsNeed(brand filter) exits(means searching for products)
  useEffect(() => {
    if(keyword !== "" || brandsNeed.length > 0 || categoriesNeed.length > 0 || pageNumber !== 0) {
      dispatch(listProducts(keyword, pageNumber, brandsNeed, categoriesNeed));
    }
    if(location?.state?.brandsNeed) {
      setBrandsNeed(location?.state?.brandsNeed);
      location.state.brandsNeed = null;
    }

    if(location?.state?.categoriesNeed) {
      setCategoriesNeed(location?.state?.categoriesNeed);
      location.state.categoriesNeed = null;
    }

  }, [dispatch, keyword, pageNumber, brandsNeed, categoriesNeed]);

  useEffect(() => {
    if(keyword === "" && pageNumber === 0) {
      dispatch(listTopProducts());
    }

  }, []);

  useEffect(() => {
    if(match.params.keyword) setKeyword(match.params.keyword);
    if(match.params.pageNumber) setPageNumber(match.params.pageNumber);
  }, [match.params])

  const changeCheck = async (e, type, index) => {
    e.preventDefault();

    let updatedBrandsOrCategories, tempBrandsOrCategoriesNeed;
    if(type === "brand") {
      updatedBrandsOrCategories = [...brands];
      tempBrandsOrCategoriesNeed = [...brandsNeed];
    } else {
      updatedBrandsOrCategories = [...categories];
      tempBrandsOrCategoriesNeed = [...categoriesNeed];
    }

    //updating brandsNeed state which will be used in filtering
    if(!updatedBrandsOrCategories[index].isChecked) {
      tempBrandsOrCategoriesNeed.push(updatedBrandsOrCategories[index].value);
      if(type === "brand") setBrandsNeed(tempBrandsOrCategoriesNeed);
      else setCategoriesNeed(tempBrandsOrCategoriesNeed);
    }
    else {
      const updatedBrandsOrCategoriesNeed =
          tempBrandsOrCategoriesNeed.filter(item=> item !== updatedBrandsOrCategories[index].value);
      if(type === "brand") setBrandsNeed(updatedBrandsOrCategoriesNeed);
      else setCategoriesNeed(updatedBrandsOrCategoriesNeed);
    }
  }

  return (
    <>
      <Meta />
      {(keyword === "" && pageNumber === 0)
        ? <Carousel />
        : (
            <Link style={{ marginBottom: 15, display: "inline-block" }} to='/' className='btn btn-light'>Go Back</Link>
        )
      }
      {/*Products */}
      <section className="section products">
        {keyword === "" && pageNumber === 0 && (
          <div className="title text-center">
            <div className="services-container">
              <div className="service">
                <div className="service-img">
                  <img src="/images/icons/service-1.png" alt=""/>
                </div>
                <div className="service-desc">
                  <h5>Get Free Delivery</h5>
                  <p>Order more than 1K BDT</p>
                </div>
              </div>

              <div className="service">
                <div className="service-img">
                  <img src="/images/icons/service-2.png" alt=""/>
                </div>
                <div className="service-desc">
                  <h5>Delivery in 24 hours</h5>
                  <p>In Dhaka City only.</p>
                </div>
              </div>

              <div className="service">
                <div className="service-img">
                  <img src="/images/icons/service-3.png" alt=""/>
                </div>
                <div className="service-desc">
                  <h5>Money Back Guarantee</h5>
                  <p>1 month money back guarantee</p>
                </div>
              </div>

              <div className="service">
                <div className="service-img">
                  <img src="/images/icons/service-4.png" alt=""/>
                </div>
                <div className="service-desc">
                  <h5>Lowest Price</h5>
                  <p>Get lowest price from us.</p>
                </div>
              </div>
            </div>

            {/*<h2>Top Products</h2>*/}
            <h5 style={{ margin: '4rem' }}>Top products of different categories are given below.</h5>
          </div>
        )}

        <div className={`product-layout ${(keyword === "" && pageNumber === 0) ? "flex-col" : ""}`}>
          {(keyword !== "" || pageNumber !== 0) && (
            <div className="filter-container">
              {/* All filter options */}
              <div className="filter">
                <h4>Brands</h4>
                {brands && (
                  <ul>
                    {brands.map(( item, index) => {
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
                                <label onClick={(e) => changeCheck(e, "brand",index)}
                                       htmlFor={`custom-checkbox-${index}`}>{item.name}</label>
                              </div>
                            </div>
                          </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="filter">
                <h4>Category</h4>
                {categories && (
                  <ul>
                    {categories.map(( item, index) => {
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
                              <label onClick={(e) => changeCheck(e, "category", index)}
                                htmlFor={`custom-checkbox-${index}`}>{item.name}</label>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          )}

          {(keyword !== "" || pageNumber !== 0) && (
            <div className={`products-container width-95"}`}>
              {products.map(product => (
                <Product product={product} key={product._id}/>
              ))}
            </div>
          )}


          {(keyword === "" && pageNumber === 0) && (
            <>
              {phones && phones.length > 0 && (
                <>
                  <div className="sub-title text-center">
                    <h2>Top Phones</h2>
                  </div>
                  <div className={`products-container`}>
                    {phones.map(product => (
                        <Product product={product} key={product._id}/>
                    ))}
                  </div>
                </>
              )}

              {earphones && earphones.length > 0 && (
                <>
                  <div className="sub-title text-center">
                    <h2>Top Earphones</h2>
                  </div>
                  <div className={`products-container`}>
                    {earphones.map(product => (
                        <Product product={product} key={product._id}/>
                    ))}
                  </div>
                </>
              )}

              {tablets && tablets.length > 0 && (
                <>
                  <div className="sub-title text-center">
                    <h2>Top Tablets</h2>
                  </div>
                  <div className={`products-container`}>
                    {tablets.map(product => (
                        <Product product={product} key={product._id}/>
                    ))}
                  </div>
                </>
              )}

              {laptops && laptops.length > 0 && (
                <>
                  <div className="sub-title text-center">
                    <h2>Top Laptops</h2>
                  </div>
                  <div className={`products-container`}>
                    {laptops.map(product => (
                        <Product product={product} key={product._id}/>
                    ))}
                  </div>
                </>
              )}

              {smartWatches && smartWatches.length > 0 && (
                <>
                  <div className="sub-title text-center">
                    <h2>Top Smart Watches</h2>
                  </div>
                  <div className={`products-container`}>
                    {smartWatches.map(product => (
                        <Product product={product} key={product._id}/>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

      </section>
      <Paginate history={history} totalPages={totalPages} pageNumber={pageNumber} keyword={keyword ? keyword : ''}
        brandsNeed={brandsNeed} categoriesNeed={categoriesNeed}/>
    </>
  )
}

export default HomeScreen;
