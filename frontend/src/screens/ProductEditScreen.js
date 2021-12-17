import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';

import { listProductDetails, updateProduct } from '../actions/productAction';
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { PRODUCT_UPDATE_FAIL } from "../constants/productConstants";
import './ProductEditScreen.css';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [ productStock, setProductStock ] = useState([
    // {
    //    _id: "61b9bff23b027548ed2f737e",
    //    color: "red",
    //   imageURL: "/uploads/image-1639561204805.png",
    //   inStock: 4
    // },
    // {
    //   _id: "61b9bff23b027548ed2f737e",
    //   color: "kk",
    //   imageURL: "/uploads/image-1639561204805.png",
    //   inStock: 40
    // },
  ]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector(state => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  useEffect(() => {
    productStock.map((item) => {
      console.log(item.color);
      console.log(item._id);
    })
    console.log(productStock)
  }, [productStock])

  useEffect(() => {
    if(successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_FAIL });
      history.push('/admin/productlist');
    } else {
      if(!product.name || product._id !== productId) dispatch(listProductDetails(productId));
      else {
        if(product && productStock) {
          // console.log(product);
          console.log(productStock);
        }
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
  }, [dispatch, history, product, productId, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(image)
    dispatch(updateProduct({
      _id: productId,
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
      productStock
      })
    )
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
      const { data } = await axios.post('/api/upload', formData, config);
      console.log(typeof data)
      if(index === null) setImage(data);
      else changeProductStock(e, index, data);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  }

  //##
  const changeProductStock = async (e, index, imgURL = null) => {
    //worked
    const tempProductStock = [...productStock];
    if(imgURL !== null) {
      tempProductStock.map((item, i) => {
        index === i ? item.imageURL = imgURL : item;
      });
    }
    else if(e.target.name === "color") {
      tempProductStock.map((item, i) => {
        index === i ? item.color = e.target.value : item;
      });
    }
    else if(e.target.name === "inStock") {
      tempProductStock.map((item, i) => {
        index === i ? item.inStock = e.target.value : item;
      });
    }
    setProductStock(tempProductStock);
    console.log(productStock)
  }

  const addNewAdditionalProduct = (e) => {
    e.preventDefault();
    const tempProductStock = [...productStock];
    tempProductStock.push({
      inStock: 0,
      imageURL: "",
      color: ""
    });
    console.log(tempProductStock);
    setProductStock(tempProductStock);
  }

  const removeAdditionalProduct = (e, index) => {
    e.preventDefault();
    let tempProductStock = [...productStock];
    let out = tempProductStock.filter((obj, i) => i !== index);
    console.log(out);
    setProductStock(out);
  }
  //##

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-primary'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {/* Product updating(after click update button) */}
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {/* Initial page loading page */}
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
                type='text'
                className="form-control"
                placeholder='Enter image url'
                value={image}
                // onChange={(e) => setImage(e.target.value)}
              />

              <input
                  type="file"
                  id='image-file'
                  // label='Choose File'
                  // custom
                  onChange={uploadFileHandler}
              />
              <button>Delete</button>
              {uploading && <Loader />}
            </div>

            {productStock.map((item, index) => (
              <>
                <p>Additional Image No {index + 1}</p>
                <div className="additionalImage" key={item._id}>
                  <div className="additionalImage__thumbnail">
                    <img src={item.imageURL} alt=""/>
                  </div>

                  <div className="additionalImage__description">
                    <div className="form-group">
                      <label className="form-label" htmlFor={"color"+index}>Color</label>
                      <input
                          id={"color"+index}
                          name="color"
                          type="text"
                          className="form-control"
                          placeholder="Enter Color"
                          required="true"
                          value={item.color}
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
                          // onChange={(e) => changeProductStock(e, index)}
                      />

                      <input
                          type="file"
                          id={"image-file" + (index + 1)}
                          name="imageURL"
                          onChange={(e) => uploadFileHandler(e, index)}
                      />
                      <button onClick={(e) => removeAdditionalProduct(e,index)}>Delete</button>
                    </div>
                  </div>


                </div>

              </>



            ))}

            {productStock.length < 5 ? (
                <button onClick={(e) => addNewAdditionalProduct(e)}>Add New Additional Image</button>
            )
              :
              ""
            }

            <div className="form-group">
              <label className="form-label" htmlFor="brand">Brand</label>
              <input
                id="brand"
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
                type='text'
                className="form-control"
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <input
                id="description"
                type='text'
                className="form-control"
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button className="btn btn-default">Update</button>
          </form>
          )
        }
      </FormContainer>
    </>
  )
}

export default ProductEditScreen;
