import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';

import './stylesheets/Paginate.css';

const Paginate = ({ totalPages, page, isAdmin = false, keyword = ''}) => {

  return totalPages > 1 && (
    // Pagination
    <ul className="pagination">
      {[...Array(totalPages).keys()].map(x => (
          <LinkContainer
              key={x + 1}
              to={!isAdmin
                  ? keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
                  : `/admin/productlist/${x+1}`
              }
          >
            <span className={x+1 == page ? 'red' : ''}>{x + 1}</span>
          </LinkContainer>
      ))}
    </ul>
  )
}

export default Paginate;
