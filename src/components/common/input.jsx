import React from "react";

const Input = ({ type, name, label, value, size, error, onChange, onBlur }) => {
  return (
    <div className="form-group">
      {/* <div className={"col-" + size}> */}
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      {/* ref, references the reference object, username created above */}
      {/* <div className={"col-" + size}> */}
      <div>
        <input
          autoFocus={true}
          id={name}
          value={value}
          name={name}
          // placeholder={label}
          type={type}
          onChange={onChange}
          className="form-control"
          // onBlur={onBlur}
        />
        {/* If there is an error message, display the error */}
      </div>
      {/* <div className={"col-" + size}> */}
      <div>{error && <div className="alert alert-danger">{error}</div>}</div>
    </div>
  );
};

export default Input;
