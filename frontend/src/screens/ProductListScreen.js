import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from '../components/Paginate';
import {listProducts, deleteProduct, createProduct} from "../actions/productAction";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, totalPages } = productList;

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if(!userInfo.isAdmin) history.push('/login');
    if(successCreate) history.push(`/admin/product/${createdProduct._id}/edit`);
    else dispatch(listProducts('', pageNumber));
  }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber]);

  const deleteHandler = async (id) => {
    if(window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id));
    }
  }

  const createProductHandler = (product) => {
    history.push(`/admin/product/add`)
    // dispatch(createProduct());
  }

  return (
    <>
      <div className="align-items-center row">
        <div className="col">
          <h1>Products</h1>
        </div>
        <div className="text-right col">
          <button className="btn btn-primary" onClick={createProductHandler}>
            <i className="fas fa-plus" /> Create Product
          </button>
        </div>
      </div>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
          <Loader />
      ) : error ? (
          <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table-bordered">
              <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {products.map(product => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className='btn btn-light'>
                          <i className="fas fa-edit" />
                        </button>
                      </Link>
                      <button className='btn btn-primary' onClick={() => deleteHandler(product._id)}>
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <Paginate totalPages={totalPages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen;
