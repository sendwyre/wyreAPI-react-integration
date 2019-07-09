import React, { Component } from "react";
import wyre from "../services/wyreApiService";
import Input from "./common/input";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import { getWyreAccountInformation } from "../services/wyreApiService";
import { updateAccountValues } from "../wyreapiconfig.json";

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
    // const errors = { ...this.state.errors };
    // const errorMessage = this.validateProperty(input);
    // if (errorMessage) errors[input.name] = errorMessage;
    // else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
    // this.setState({ data, errors });
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
    // console.log(error.details);
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
            {this.makeDropDownOptionMenu(optionList)}
          </select>
        </div>
      </React.Fragment>
    );
  }

  makeDropDownOptionMenu(optionList) {
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

  renderButton(label) {
    return (
      <button
        // disabled={this.validate()}
        className="btn btn-primary"
      >
        {/* <button className="btn btn-primary"> */}
        {label}
      </button>
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
    // console.log("Parent Render", this.state, wyreAccount);
    return (
      <React.Fragment>
        <h1>Welcome</h1>
        <h1>{this.state.user.name}</h1>
        <h1>{this.state.user.email}</h1>
        <Link to="/emailUserForm">
          <span className="card">
            <h1>Email</h1>
            <p>
              {this.findWyreProfileFieldStatus(
                updateAccountValues.email,
                wyreAccount
              ) || ""}
            </p>
          </span>
        </Link>
        <Link to="/cellPhoneUserForm">
          <span className="card">
            <h1>Phone</h1>
            <p>
              {this.findWyreProfileFieldStatus(
                updateAccountValues.cellPhone,
                wyreAccount
              ) || ""}
            </p>
          </span>
        </Link>
        <Link to="/personalDetailsUserForm">
          <span className="card">
            <h1>Personal Details</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.dateOfBirth,
              wyreAccount
            ) || ""}
          </span>
        </Link>
        <Link to="/addressUserForm">
          <span className="card">
            <h1>Address</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.address,
              wyreAccount
            ) || ""}
          </span>
        </Link>
        <Link to={{ pathname: "/documentUserForm", state: { foo: "bar" } }}>
          <span className="card">
            <h1>Documents</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.governmentId,
              wyreAccount
            ) || ""}
          </span>
        </Link>
        <Link to="/bankAccountUserForm">
          <span className="card">
            <h1>Bank</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.paymentMethod,
              wyreAccount
            ) || ""}
          </span>
        </Link>
        <Link to="/proofOfAddressUserForm">
          <span className="card">
            <h1>Proof of Address</h1>
            {this.findWyreProfileFieldStatus(
              updateAccountValues.proofOfAddress,
              wyreAccount
            ) || ""}
          </span>
        </Link>
        <h1>Account Id: {wyreAccount.id}</h1>
        <h1>Account status: {wyreAccount.status}</h1>
      </React.Fragment>
    );
  }
}

export default UserProfile;
