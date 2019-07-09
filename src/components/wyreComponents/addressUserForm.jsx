import React from "react";
import Joi from "joi-browser";
import { updateWyreAccount } from "../../services/wyreApiService";
import { updateAccountValues } from "../../wyreapiconfig.json";
import UserProfile from "../userProfile";

class AddressUserForm extends UserProfile {
  state = {
    data: {
      street1: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    },
    states: [
      "AL",
      "AK",
      "AS",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FM",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PW",
      "PA",
      "PR",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY"
    ],
    errors: { name: "" }
  };
  schema = {
    street1: Joi.string()
      .label("street1")
      .required(),
    city: Joi.string()
      .label("city")
      .regex(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)
      .required()
      .options({
        language: {
          string: { regex: { base: "must be a valid US city" } }
        }
      }),
    state: Joi.string()
      .label("state")
      .regex(
        /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/
      )
      .required(),
    postalCode: Joi.string()
      .label("postalCode")
      .regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .required()
      .options({
        language: {
          string: { regex: { base: "must be a 5 digit US Zipcode" } }
        }
      }),
    country: Joi.string()
      .label("country")
      .regex(/^US$/)
      .required()
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    console.log(errors, this.state.data);
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      let wyreAccountId = await JSON.parse(localStorage.getItem("wyreAccount"))
        .id;
      let address = this.state.data;
      await updateWyreAccount(
        {
          fieldId: updateAccountValues.address,
          value: address
        },
        wyreAccountId
      );
      this.props.history.push("/userProfile");
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
        <h1>Submit a Valid US Address</h1>
        <div className="row justify-content-center align-items-center">
          <form
            onSubmit={this.handleSubmit}
            // className="needs-validation"
            // noValidate
          >
            {this.renderInput("street1", "Street Address")}
            {this.renderInput("city", "City")}
            {this.renderOption(this.state.states, "state", "State")}
            {/* {this.renderInput("state", "State")} */}
            {this.renderInput("postalCode", "Postal Code")}
            {/* {this.renderInput("country", 'Country - Must be "US"')} */}
            {this.renderOption(["US"], "country", "Country")}
            {this.renderButton("Submit")}
          </form>
        </div>
      </div>
    );
  }
}

export default AddressUserForm;
