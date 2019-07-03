import React from "react";
import Joi from "joi-browser";
import { updateWyreAccount } from "../../services/wyreApiService";
import { updateAccountValues } from "../../wyreapiconfig.json";
import UserProfile from "../userProfile";

const US_CELLPHONE_PREFIX = "+1";

class CellPhoneUserForm extends UserProfile {
  state = {
    data: {
      cellPhoneAreaCode: "",
      cellPhoneNumber1: "",
      cellPhoneNumber2: ""
    },
    errors: { name: "" }
  };
  schema = {
    cellPhoneAreaCode: Joi.string()
      .trim()
      .regex(/^[0-9]{3}$/)
      .required()
      .label("Area Code"),
    cellPhoneNumber1: Joi.string()
      .trim()
      .regex(/^[0-9]{3}$/)
      .required()
      .label("cellPhoneNumber1"),
    cellPhoneNumber2: Joi.string()
      .trim()
      .regex(/^[0-9]{4}$/)
      .required()
      .label("cellPhoneNumber2")
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  doSubmit = async () => {
    let cellPhoneNumber =
      US_CELLPHONE_PREFIX +
      this.state.data.cellPhoneAreaCode +
      this.state.data.cellPhoneNumber1 +
      this.state.data.cellPhoneNumber2;
    try {
      let wyreAccountId = await JSON.parse(localStorage.getItem("wyreAccount"))
        .id;
      await updateWyreAccount(
        { fieldId: updateAccountValues.cellPhone, value: cellPhoneNumber },
        wyreAccountId
      );
      window.location = "/userProfile";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <p>Submit a Valid Cell Phone Number</p>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("cellPhoneAreaCode", "Area Code")}
          {this.renderInput("cellPhoneNumber1", "Cell Phone Number")}
          {this.renderInput("cellPhoneNumber2", "")}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}

export default CellPhoneUserForm;
