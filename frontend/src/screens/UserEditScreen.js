import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { getUserDetails, updateUser } from '../actions/userActions';
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { USER_UPDATE_RESET } from "../constants/userConstants";

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ isAdmin, setIsAdmin ] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector(state => state.userUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if(successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userlist');
    } else {
      if(!user.name || user._id !== userId) dispatch(getUserDetails(userId));
      else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, history, user, userId, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  }

  return (
    <>
      <Link to='/admin/userList' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
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
                    disabled="true"
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
                    disabled="true"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                    id="isAdmin"
                    type="checkbox"
                    className="form-check-input"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <label title="" htmlFor="isAdmin" className="form-check-label">Is Admin</label>
              </div>
              <button className='btn btn-primary'>Update</button>
            </form>
            )
        }
      </FormContainer>
    </>
  )
}

export default UserEditScreen;
