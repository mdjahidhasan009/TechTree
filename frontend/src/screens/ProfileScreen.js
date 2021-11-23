import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";

import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { getMyOrderList } from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ProfileScreen = ({ location, history }) => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ message, setMessage ] = useState(null);

  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  const myOrderList = useSelector(state => state.myOrderList);
  const { loading: loadingOrders, error: errorOrders, orders } = myOrderList;

  useEffect(() => {
    if(!userInfo) {
      history.push('/login');
    } else {
      if(!user || !user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(getMyOrderList());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [history, userInfo, dispatch, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setMessage('Password do not match!')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  }

  return <div className="row">
    <div className="col-md-3">
      <h2>User Profile</h2>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Profile Updated</Message>}
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
              id="name"
              type="name"
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
          <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
          <input
              id="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button className='btn btn-primary'>Update</Button>
      </form>
    </div>
    <div className="col-md-9">
      <h2>My Orders</h2>
      {loadingOrders
        ? <Loader />
        : errorOrders
          ? <Message variant='danger'>{errorOrders}</Message>
          : (
            <div className="table-responsive">
              <table className='table-bordered'>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid
                            ? order.paidAt.substring(0, 10)
                            : (<i className='fas fa-times' style={{ color: 'red' }}/>)
                        }
                      </td>
                      <td>
                        {order.isDelivered
                            ? order.deliveredAt.substring(0, 10)
                            : (<i className='fas fa-times' style={{ color: 'red' }}/>)
                        }
                      </td>
                      <td>
                        <a href={`/order/${order._id}`}>
                          <button className='btn btn-primary btn-light'>Details</button>
                        </a>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          )
      }
    </div>
  </div>
}

export default ProfileScreen;
