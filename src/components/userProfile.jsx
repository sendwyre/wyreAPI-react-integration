import React, { Component } from "react";
import wyre from "../services/wyreApiService";
import Input from "./common/input";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { getWyreAccountInformation } from "../services/wyreApiService";
import { updateAccountValues } from "../wyreapiconfig.json";
import logo from "../assets/wyre-logo.svg";
class UserProfile extends Component {
  state = {
    user: {},
    wyreAccount: {},
    defaultOptionValue: null
  };

  async componentWillMount() {
    if (localStorage.getItem("wyreSecretKey") === null) {
      const wyreAccountObject = await wyre.createWyreAccount();
      localStorage.setItem("wyreAccount", JSON.stringify(wyreAccountObject));
      this.setState({ wyreAccount: wyreAccountObject });
    } else {
      let wyreAccountObject = JSON.parse(localStorage.getItem("wyreAccount"));
      wyreAccountObject = await getWyreAccountInformation(wyreAccountObject.id);
      localStorage.setItem("wyreAccount", JSON.stringify(wyreAccountObject));
      this.setState({ wyreAccount: wyreAccountObject });
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleError = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    console.log("HANDLE ERRORS", errorMessage);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ errors });
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.schema, options);

    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  renderOption(optionList, name, label) {
    const defaultOptionValue = this.state.defaultOptionValue;
    return (
      <React.Fragment>
        <div>
          <label>{label}</label>
        </div>
        <div>
          <select onChange={this.handleChange} name={name}>
            <option value={defaultOptionValue}>{defaultOptionValue}</option>
            {this.makeDropDownOptionMenuForUSStates(optionList)}
          </select>
        </div>
      </React.Fragment>
    );
  }

  makeDropDownOptionMenuForUSStates(optionList) {
    return (
      <React.Fragment>
        {optionList.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </React.Fragment>
    );
  }

  renderInput(name, label, size, type = "text") {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        size={size}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        // onBlur={this.handleError}
      />
    );
  }

  renderWyreHeader(header) {
    return (
      <div className="wyre-card-header">
        <h1>{header}</h1>
      </div>
    );
  }

  renderButton(label) {
    return (
      <div className="wyre-submit-btn">
        <button className="btn btn-primary">{label}</button>
      </div>
    );
  }

  findWyreProfileFieldStatus(fieldId, wyreAccount) {
    let profileFields = wyreAccount.profileFields || [];

    for (let i = 0; i < profileFields.length; i++) {
      if (
        profileFields[i].fieldId === fieldId &&
        profileFields[i].note !== null
      )
        return profileFields[i].note;
      else if (profileFields[i].fieldId === fieldId)
        return profileFields[i].status;
    }
  }

  render() {
    let wyreAccount = this.state.wyreAccount;
    const linkStyle = { textDecoration: "none" };
    return (
      <div className="user-profile-container">
        <div className="user-profile-header">
          <h1>Verification Set Up</h1>
        </div>
        <Link to="/emailUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Email</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.email,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to="/cellPhoneUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Phone</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.cellPhone,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to="/personalDetailsUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Personal Details</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.dateOfBirth,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to="/addressUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Address</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.address,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to={{ pathname: "/documentUserForm" }} style={linkStyle}>
          <span className="card wyre-card">
            <h1>Documents</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.governmentId,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to="/bankAccountUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Bank</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.paymentMethod,
              wyreAccount
            )}
          </span>
        </Link>
        <Link to="/proofOfAddressUserForm" style={linkStyle}>
          <span className="card wyre-card">
            <h1>Proof of Address</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.proofOfAddress,
              wyreAccount
            )}
          </span>
        </Link>
        <div className="wyre-container-footer">
          <h1>Account Id: {wyreAccount.id}</h1>
          <h1>Account status: {wyreAccount.status}</h1>
          <div className="wyre-logo">
            Powered By: <img src={logo} alt="Wyre Logo" />
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
