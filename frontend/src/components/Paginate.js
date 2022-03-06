import React, { useEffect } from "react";

import "./stylesheets/Paginate.css";

const Paginate =
    ({ history, totalPages, pageNumber, isAdmin = false, keyword = '', brandsNeed, categoriesNeed}) => {
  const loadAnotherPage = (x) => {
    let forwardString = !isAdmin
      ? keyword
          ? `/search/${keyword}/page/${x + 1}`
          : `/page/${x + 1}`
      : `/admin/productlist/${x+1}`;

    const location = {
      pathname: forwardString,
      state: {
        brandsNeed,
        categoriesNeed
      }
    };

    history.push(location);
  }

  return totalPages > 1 && (keyword !== "" || pageNumber !== 0) && (
    // Pagination
    <ul className="pagination">
      {[...Array(totalPages).keys()].map(x => (
        <div
          key={x + 1}
          onClick={() => loadAnotherPage(x)}
        >
          <span className={x+1 === pageNumber ? 'selected' : ''}>{x + 1}</span>
        </div>
      ))}
    </ul>
  )
}

export default Paginate;
