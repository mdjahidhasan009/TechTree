import React from "react";

const FormContainer = ({ children }) => {
  return (
      <div className="justify-content-center">
        <div className="form-container">
          {children}
        </div>
      </div>
  )
};

export default FormContainer;
