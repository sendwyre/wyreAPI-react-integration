import React from "react";
import Joi from "joi-browser";
import { updateWyreAccount } from "../../services/wyreApiService";
import { updateAccountValues } from "../../wyreapiconfig.json";
import UserProfile from "../userProfile";

const US_CELLPHONE_PREFIX = "+1";

class CellPhoneUserForm extends UserProfile {
  state = {
    data: {
      cellPhoneNumber: ""
      // cellPhoneNumber1: "",
      // cellPhoneNumber2: ""
    },
    errors: { name: "" }
  };
  schema = {
    cellPhoneNumber: Joi.string()
      .trim()
      .regex(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/)
      .required()
      .label("cellPhoneAreaCode")
      .options({
        language: {
          string: {
            regex: {
              base: "must be a valid cellphone number. EX: 415-555-3333"
            }
          }
        }
      })
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  doSubmit = async () => {
    let cellPhoneNumber = US_CELLPHONE_PREFIX + this.state.data.cellPhoneNumber;
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
      <div className="container-fluid wyre-container">
        {this.renderWyreHeader("Valid Cellphone Number")}
        <div className="row justify-content-center align-items-center">
          <div className="wyre-personal-details-group">
            <form onSubmit={this.handleSubmit}>
              {this.renderInput(
                "cellPhoneNumber",
                "Cell phone number with Area Code"
              )}
              {this.renderButton("Submit")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CellPhoneUserForm;
