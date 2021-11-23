import React from "react";

import './Message.css';

const Message = ({ variant, children }) => {
  return <div role={variant} className={`fade alert alert-${variant} show`}>
    {children}
  </div>;
}

Message.defaultProps = {
  variant: 'info'
}

export default Message;
