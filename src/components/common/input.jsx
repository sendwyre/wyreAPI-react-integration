import React from "react";

const Input = ({ type, name, label, value, size, error, onChange, onBlur }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        autoFocus={true}
        id={name}
        value={value}
        name={name}
        // placeholder={label}
        type={type}
        onChange={onChange}
        className="form-control"
      />
      <div>{error && <div className="alert alert-danger">{error}</div>}</div>
    </div>
  );
};

export default Input;
