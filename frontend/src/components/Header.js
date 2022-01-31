import React, {useEffect} from 'react';
import { Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../actions/userActions";
import SearchBox from './SearchBox';

import './stylesheets/Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  }

  useEffect(() => {
    const openNav = document.querySelector('.open-btn');
    const closeNav = document.querySelector('.close-btn');
    const menu = document.querySelector('.nav-list');

    const menuLeft = menu.getBoundingClientRect().left; //from left
    openNav.addEventListener('click', () => {
      if(menuLeft < 0) {
        menu.classList.add('show');
      }
    });

    closeNav.addEventListener('click', () => {
      if(menuLeft < 0) {
        menu.classList.remove('show');
      }
    });

  }, [])

  return (
      <nav className="nav">
        <div className="wrapper container">
          <div className="logo"><Link to="/">TechTree</Link></div>
          <ul className="nav-list">
            <div className="top">
              <label htmlFor="" className="nav_btn close-btn"><i className="fas fa-times" /></label>
            </div>
            <li><Link to="/">Home</Link></li>
            {userInfo ? (
              <li>
                <Link to="" className="desktop-item">
                  {userInfo.name} <span><i className="fas fa-chevron-down" /></span>
                </Link>
                <input type="checkbox" id="showdrop1" />
                <label htmlFor="showdrop1" className="mobile-item">
                  <span>{userInfo.name} <i className="fas fa-chevron-down" /></span>
                </label>
                <ul className="drop-menu1">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/login" onClick={logoutHandler}>Logout</Link></li>
                </ul>
              </li>
            ) : (
                <>
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/register">Register</Link></li>
                </>
            )}
            {userInfo && userInfo.isAdmin && (
              <li>
                <Link to="" className="desktop-item">
                  ADMIN <span><i className="fas fa-chevron-down" /></span>
                </Link>
                <input type="checkbox" id="showdrop2" />
                <label htmlFor="showdrop2" className="mobile-item">
                  ADMIN <span><i className="fas fa-chevron-down" /></span>
                </label>
                <ul className="drop-menu2">
                  <li><Link to="/admin/userlist">Users</Link></li>
                  <li><Link to="/admin/productlist">Products</Link></li>
                  <li><Link to="/admin/orderlist">Orders</Link></li>
                </ul>
              </li>
            )}
            <li className="icons">
              <Link to="/cart">
                <span>
                  <i className="fas fa-shopping-cart"><small className="count d-flex">{cartItems.length}</small></i>
              </span>
              </Link>
              <span>
                <Route render={({history}) => <SearchBox history={history} /> }/>
              </span>
            </li>
          </ul>
          <label htmlFor="" className="nav_btn open-btn"><i className="fas fa-bars" /></label>
        </div>
      </nav>
  )
}

export default Header;
