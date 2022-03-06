import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import { createProduct, getProductDetails, updateProduct } from '../actions/productAction';
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET
} from "../constants/productConstants";
import './stylesheets/ProductEditOrAddScreen.css';

const ProductEditOrAddScreen = ({ match, history, mode }) => {
  const productId = match.params.id;
  const [ name, setName ] = useState('');
  const [ price, setPrice ] = useState(0);
  const [ image, setImage ] = useState('');
  const [ productStock, setProductStock ] = useState([]);
  const [ brand, setBrand ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ countInStock, setCountInStock ] = useState(0);
  const [ description, setDescription ] = useState([]);
  const [ uploading, setUploading ] = useState(false);
  const [ pageTitle, setPageTitle ] = useState("Add New Product");
  const [ submitBtnName, setSubmitBtnName ] = useState("Add Product");

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  useEffect(() => {
    if(mode === 'edit-product') {
      setPageTitle("Edit Product");
      setSubmitBtnName("Edit Product");
      if(successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });
        history.push('/admin/productlist');
      } else {
        if(!product.name || product._id !== productId) dispatch(getProductDetails(productId));
        else {
          setName(product.name);
          setPrice(product.price);
          setImage(product.image);
          setBrand(product.brand);
          setCategory(product.category);
          setCountInStock(product.countInStock);
          setDescription(product.description);
          setProductStock(product.productStock);
        }
      }
    } else {
      if(successCreate) {
        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: createdProduct });
        dispatch({ type: PRODUCT_CREATE_RESET });
        history.push(`/admin/productlist`);
      }
    }

  }, [dispatch, history, product, productId, successUpdate, successCreate])

  const submitHandler = (e) => {
    e.preventDefault();
    if(mode === "edit-product") {
      dispatch(updateProduct({
        _id: productId,
        name,           price,
        image,          brand,
        category,       description,
        countInStock,   productStock
        })
      )
    } else {
      dispatch(createProduct({
        name,           price,
        image,          brand,
        category,       description,
        countInStock,   productStock
      }))
    }
  }

  const uploadFileHandler = async (e, index = null) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try{
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/upload`, formData, config);
      if(index === null) setImage(data);
      else changeProductStock(e, index, data);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  }

  const changeProductStock = async (e, index, imgURL = null) => {
    const tempProductStock = [...productStock];
    if(imgURL !== null) {
      tempProductStock.map((item, i) => {
        index === i ? item.imageURL = imgURL : item;
      });
    }
    else if(e.target.name === "colorCode") {
      tempProductStock.map((item, i) => {
        index === i ? item.colorCode = e.target.value : item;
      });
    }
    else if(e.target.name === "colorName") {
      tempProductStock.map((item, i) => {
        index === i ? item.colorName = e.target.value : item;
      });
    }
    else if(e.target.name === "inStock") {
      tempProductStock.map((item, i) => {
        index === i ? item.inStock = e.target.value : item;
      });
    }
    setProductStock(tempProductStock);
  }

  const addNewAdditionalProduct = (e) => {
    e.preventDefault();
    const tempProductStock = [...productStock];
    tempProductStock.push({
      inStock: 0,
      imageURL: "",
      colorName: "",
      colorCode: ""
    });
    setProductStock(tempProductStock);
  }

  const removeAdditionalProduct = (e, index) => {
    e.preventDefault();
    let tempProductStock = [...productStock];
    let updatedProductStock = tempProductStock.filter((obj, i) => i !== index);
    setProductStock(updatedProductStock);
  }

  const addNewSpecificationGroup = (e) => {
    e.preventDefault();
    const tempDescription = [...description];
    console.log(tempDescription)
    tempDescription.push({
      groupName: "",
      specifications: [
        {
          specName: "",
          specValue: ""
        }
      ]
    });
    setDescription(tempDescription);
  }

  const addNewSpecification = (e, index) => {
    e.preventDefault();
    let tempDescription = [...description];
    tempDescription[index]
      .specifications.push({
        specName: "",
        specValue: ""
      });
    setDescription(tempDescription);
  }

  const changeSpec = (e, specGroupIndex, specIndex = 0) => {
    e.preventDefault();
    const tempDescription = [...description];
    if(e.target.name === "specification-group-name") {
      tempDescription[specGroupIndex].groupName = e.target.value;
    } else if(e.target.name === "specification-name"){
      tempDescription[specGroupIndex].specifications[specIndex].specName = e.target.value;
      console.log(tempDescription[specGroupIndex].specifications[specIndex].specName);
    } else if(e.target.name === "specification-value") {
      tempDescription[specGroupIndex].specifications[specIndex].specValue = e.target.value;
    }

    setDescription(tempDescription);
  }

  const removeSpec = (specGroupIndex, specIndex = -1) => {
    let tempDescription = [...description];
    let updatedDescription;
    if(specIndex !== -1) {
      updatedDescription = tempDescription[specGroupIndex]
          .specifications.filter((obj, index) => index !== specIndex);
      tempDescription[specGroupIndex].specifications = updatedDescription;
      setDescription(tempDescription);
    } else {
      updatedDescription = tempDescription.filter((obj, index) => index !== specGroupIndex);
      setDescription(updatedDescription);
    }
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-primary'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{pageTitle}</h1>
        {/* Product updating(after click update button) */}
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {/* Initial pageNumber loading pageNumber */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                required="true"
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Price</label>
              <input
                id="price"
                required="true"
                type="number"
                className="form-control"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">Image</label>
              <input
                id="image"
                required="true"
                type='text'
                className="form-control"
                placeholder='Enter image url'
                value={image}
              />

              <input
                  type="file"
                  id='image-file'
                  onChange={uploadFileHandler}
              />
              <button className="btn btn-default">Delete</button>
              {uploading && <Loader />}
            </div>

            {/* Additional Images */}
            {productStock.map((item, index) => (
              <>
                <p>Additional Image No {index + 1}</p>
                <div className="additionalImage" key={item._id}>
                  <div className="additionalImage__thumbnail">
                    <img src={`${process.env.REACT_APP_BACKEND_BASE_URL}${item.imageURL}`} alt=""/>
                  </div>

                  <div className="additionalImage__description">
                    <div className="form-group">
                      <label className="form-label" htmlFor={"colorName"+index}>Color Name</label>
                      <input
                        id={"colorName"+index}
                        name="colorName"
                        type="text"
                        className="form-control"
                        placeholder="Enter Color Name"
                        required="true"
                        value={item.colorName}
                        onChange={(e) => changeProductStock(e, index)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor={"colorCode"+index}>Color Code</label>
                      <input
                          id={"colorCode"+index}
                          name="colorCode"
                          type="text"
                          className="form-control"
                          placeholder="Enter Color Code"
                          required="true"
                          value={item.colorCode}
                          onChange={(e) => changeProductStock(e, index)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="inStock">Total Unit in Stock(of this color)</label>
                      <input
                        id="inStock"
                        name="inStock"
                        type="number"
                        className="form-control"
                        placeholder="Enter Total Unit in Stock(of this color)"
                        required="true"
                        value={item.inStock}
                        onChange={(e) => changeProductStock(e, index)}
                      />
                    </div>

                    <div className="form-group">
                      <div className="form-label" htmlFor={"image" + index}>Image</div>
                      <input
                        id={"image" + index}
                        type="text"
                        className="form-control"
                        placeholder={"Enter image URL of additional image no " + (index + 1)}
                        value={item.imageURL}
                        required="true"
                      />

                      <input
                        type="file"
                        id={"image-file" + (index + 1)}
                        name="imageURL"
                        onChange={(e) => uploadFileHandler(e, index)}
                      />
                      <button className="btn btn-default"
                        onClick={(e) => removeAdditionalProduct(e,index)}>Delete
                      </button>
                    </div>
                  </div>

                </div>
              </>
            ))}

            {productStock.length < 5 ?
              (
                <button className="btn btn-default" onClick={(e) =>
                    addNewAdditionalProduct(e)}>Add New Additional Image
                </button>
              )
              :
              ""
            }

            <div className="form-group">
              <label className="form-label" htmlFor="brand">Brand</label>
              <input
                id="brand"
                required="true"
                type='text'
                className="form-control"
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="countInStock">Count In Stock</label>
              <input
                id="countInStock"
                required="true"
                type='number'
                className="form-control"
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <input
                id="category"
                required="true"
                type='text'
                className="form-control"
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              {/*<input*/}
              {/*  id="description"*/}
              {/*  required="true"*/}
              {/*  type='text'*/}
              {/*  className="form-control"*/}
              {/*  placeholder='Enter description'*/}
              {/*  value={description}*/}
              {/*  onChange={(e) => setDescription(e.target.value)}*/}
              {/*/>*/}
            </div>

            <button className="btn btn-default" onClick={addNewSpecificationGroup}>Add New Specification Group</button>

            {description.map((specGroupItem, specGroupIndex) => (
              <>
                <div className="form-group specification-group">
                  <div className="specification-group-container">
                    <label className="form-label" htmlFor="specification-group-name">Specification Group Name</label>
                    <input
                        id="specification-group-name"
                        name="specification-group-name"
                        required="true"
                        type="text"
                        className="form-control"
                        placeholder="Specification Group Name"
                        value={specGroupItem.groupName}
                        onChange={(e) => changeSpec(e, specGroupIndex)}
                    />
                  </div>
                  <i onClick={() => removeSpec(specGroupIndex)} className="fas fa-times" />
                </div>

                <button className="btn btn-default" onClick={(e) =>
                    addNewSpecification(e, specGroupIndex)}>Add New Specification
                </button>
                {specGroupItem.specifications.map((specItem, specIndex) => (
                  <div className="specification">
                    <div className="form-group">
                      <label className="form-label" htmlFor="specification-name">Specification Name</label>
                      <input
                          id="specification-name"
                          name="specification-name"
                          required="true"
                          type="text"
                          className="form-control"
                          placeholder="Specification Name"
                          value={specItem.specName}
                          onChange={(e) => changeSpec(e, specGroupIndex, specIndex)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label"  htmlFor="specification-value">Specification Value</label>
                      <input
                          id="specification-value"
                          name="specification-value"
                          required="true"
                          type="text"
                          className="form-control"
                          placeholder="Specification Value"
                          value={specItem.specValue}
                          onChange={(e) => changeSpec(e, specGroupIndex, specIndex)}
                      />
                    </div>
                    <i onClick={() => removeSpec(specGroupIndex, specIndex)} className="fas fa-times" />
                  </div>
                ))}

              </>
            ))}
            <button className="btn btn-default d-block mt-3">{submitBtnName}</button>
          </form>
          )
        }
      </FormContainer>
    </>
  )
}

export default ProductEditOrAddScreen;
