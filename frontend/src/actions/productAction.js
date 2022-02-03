import axios from "axios";

import {
  PRODUCT_BRANDS_UPDATE_REQUEST,
  PRODUCT_BRANDS_UPDATE_SUCCESS,
  PRODUCT_CATEGORIES_UPDATE_REQUEST,
  PRODUCT_CATEGORIES_UPDATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_TOP_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS
} from "../constants/productConstants";

export const listProducts =
    (keyword = '', pageNumber = '', brandsNeed, categoriesNeed) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`,
        {
          params: {
            brandsNeed,
            categoriesNeed
          }
      }
    );
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data
    });
    if(brandsNeed.length > 0) dispatch(updateBrands(data.brands, brandsNeed));
    if(categoriesNeed.length > 0) dispatch(updateCategories(data.categories, categoriesNeed));
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
}

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST });
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/products/top`);
    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    });
  }
}

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/products/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response && error.response.data.message
          ? error.message.data.message
          : error.message
    });
  }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/products/${id}`, config)
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload:
          error.response && error.response.data.message
              ? error.response.data.message
              : error.message
    })
  }
}

export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    //as it is an post request so sending empty object
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/products`,product ,config);
    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
          error.response && error.response.data.message
              ? error.response.data.message
              : error.message
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });

    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        'Context-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/products/${product._id}`, product ,config);
    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload:
          error.response && error.response.data.message
              ? error.response.data.message
              : error.message
    })
  }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });

    const { userLogin: { userInfo }} = getState();

    const config = {
      headers: {
        'Context-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/products/${productId}/reviews`, review ,config);
    dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
          error.response && error.response.data.message
              ? error.response.data.message
              : error.message
    })
  }
}

export const updateBrands = (brands, brandsNeed) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_BRANDS_UPDATE_REQUEST });
    const tempBrands = [...brands];
    const tempBrandsNeed = [...brandsNeed];

    tempBrands.map(item => {
      if(tempBrandsNeed.indexOf(item.value) > -1) {
        item.isChecked = true;
      }
    });
    dispatch({ type: PRODUCT_BRANDS_UPDATE_SUCCESS, payload: tempBrands });
  } catch (e) {

  }
}

export const updateCategories = (categories, categoriesNeed) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CATEGORIES_UPDATE_REQUEST });
    const tempCategories = [...categories];
    const tempCategoriesNeed = [...categoriesNeed];

    tempCategories.map(item => {
      if(tempCategoriesNeed.indexOf(item.value) > -1) {
        item.isChecked = true;
      }
    });
    dispatch({ type: PRODUCT_CATEGORIES_UPDATE_SUCCESS, payload: tempCategories });
  } catch (e) {

  }
}
