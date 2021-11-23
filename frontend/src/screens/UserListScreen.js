import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { deleteUser, getUsersList } from "../actions/userActions";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector(state => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector(state => state.userDelete);
  const { success: deletedSuccessfully } = userDelete;

  useEffect(() => {
    if(userInfo && userInfo.isAdmin) {
      dispatch(getUsersList());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, deletedSuccessfully]);

  const deleteHandler = async (id) => {
    if(window.confirm('Are you sure?')) {
      dispatch(deleteUser(id));
    }
  }

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
        ) : (
          <div className="table-responsive">
            <table className='table-bordered'>
              <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>
                      {user.isAdmin ? (
                          <i className='fas fa-check' style={{ color: 'green' }}/>
                      ) : (
                          <i className='fas fa-times' style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>

                      <a href={`/admin/user/${user._id}/edit`}>
                        <button className='btn btn-primary btn-light'>
                          <i className="fas fa-edit" />
                        </button>
                      </a>
                      <button className='btn btn-primary' onClick={() => deleteHandler(user._id)}>
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
      )}
    </>
  )
}

export default UserListScreen;
