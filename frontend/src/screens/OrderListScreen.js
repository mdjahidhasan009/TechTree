import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderList } from "../actions/orderActions";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if(userInfo && userInfo.isAdmin) {
      dispatch(getOrderList());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, history]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        // <table striped bordered hover responsive className='table-sm'>
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <i className='fas fa-times' style={{ color: 'red' }} />
                )}
              </td>
              <td>
                {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                ) : (
                    <i className='fas fa-times' style={{ color: 'red' }} />
                )}
              </td>
              <td>
                {/*</LinkContainer>*/}
                <a href={`/order/${order._id}`}>
                  <button className='btn btn-primary btn-light'>Details</button>
                </a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default OrderListScreen;
