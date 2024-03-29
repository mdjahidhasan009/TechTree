import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { login } from '../actions/userActions';
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const LoginScreen = ({ location, history }) => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if(userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  }
  return (
    <FormContainer>
      <div className="auth-form">
        <h1>Sign In</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-default">Sign In</button>
        </form>
        <p>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </p>
      </div>

      <div className="auth-form dummy-password">
        <table>
          <thead>
            <tr>
              <th>User Type</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>Normal User</td>
            <td>new2@gmail.com</td>
            <td>123456</td>
          </tr>
          <tr>
            <td>Admin User</td>
            <td>admin@gmail.com</td>
            <td>123456</td>
          </tr>
          </tbody>
        </table>
      </div>
    </FormContainer>
  )
}

export default LoginScreen;
