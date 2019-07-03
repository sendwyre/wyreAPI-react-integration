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
    errors: { name: "" }
  };
  schema = {
    street1: Joi.string()
      .label("street1")
      .required(),
    city: Joi.string()
      .label("city")
      .regex(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/)
      .required(),
    state: Joi.string()
      .label("state")
      .regex(
        /^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/
      )
      .required(),
    postalCode: Joi.string()
      .label("postalCode")
      .regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .required(),
    country: Joi.string()
      .label("country")
      .regex(/^US$/)
      .required()
  };

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
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
      <div>
        <h1>Submit a Valid Email Address</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("street1", "Street Address")}
          {this.renderInput("city", "City")}
          {this.renderInput("state", "State")}
          {this.renderInput("postalCode", "Postal Code")}
          {this.renderInput("country", 'Country - Must be "US"')}
          {this.renderButton("Submit")}
        </form>
      </div>
    );
  }
}

export default AddressUserForm;
