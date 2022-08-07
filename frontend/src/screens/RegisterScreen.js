import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { register } from '../actions/userActions';
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const RegisterScreen = ({ location, history }) => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ message, setMessage ] = useState(null);

  const dispatch = useDispatch();
  const userRegister = useSelector(state => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if(userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setMessage('Password do not match!')
    } else {
      dispatch(register(name, email, password));
    }
  }

  return (
      <FormContainer>
        <div className="auth-form">
          <h1>Sign Up</h1>
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
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
            <div className="form-group">
              <label className="form-label" htmlFor="passwordConfirmation">Confirm Password</label>
              <input
                id="passwordConfirmation"
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-default">Register</button>
          </form>
          <p>Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link></p>
        </div>

      </FormContainer>
  )
}

export default RegisterScreen;
