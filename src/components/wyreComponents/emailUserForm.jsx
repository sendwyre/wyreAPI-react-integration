import React from "react";
import Joi from "joi-browser";
import { updateWyreAccount } from "../../services/wyreApiService";
import { updateAccountValues } from "../../wyreapiconfig.json";
import UserProfile from "../userProfile";

class EmailUserForm extends UserProfile {
  state = {
    data: { email: "" },
    errors: { name: "" }
  };
  schema = {
    email: Joi.string()
      .email()
      .label("Email")
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
      let email = this.state.data.email;
      await updateWyreAccount(
        { fieldId: updateAccountValues.email, value: email },
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
        {this.renderWyreHeader("Valid Email Address")}
        <div className="row justify-content-center align-items-center">
          <div className="wyre-personal-details-group">
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("email", "Email")}
              {this.renderButton("Send")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailUserForm;
