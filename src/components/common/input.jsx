import React from "react";

const Input = ({ type, name, label, value, error, onChange }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {/* ref, references the reference object, username created above */}
      <input
        autoFocus={true}
        id={name}
        value={value}
        name={name}
        type={type}
        onChange={onChange}
        className="form-control"
      />
      {/* If there is an error message, display the error */}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
