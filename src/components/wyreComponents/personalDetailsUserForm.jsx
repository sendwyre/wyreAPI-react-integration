import React from "react";
import Joi from "joi-browser";
import { updateWyrePersonalDetailsAccount } from "../../services/wyreApiService";
import { updateAccountValues } from "../../wyreapiconfig.json";
import UserProfile from "../userProfile";

class PersonalDetailsUserForm extends UserProfile {
  state = {
    data: {
      individualLegalName: "",
      individualDateOfBirth: "",
      individualSsn: ""
    },
    errors: { name: "" }
  };
  schema = {
    individualLegalName: Joi.string()
      .label("Legal Name")
      .regex(/^[a-zA-Z]{2,} [a-zA-Z]{2,}$/)
      .required()
      .options({
        language: {
          string: {
            regex: {
              base:
                "must be a valid first and last name with at least 2 characters per name"
            }
          }
        }
      }),
    individualDateOfBirth: Joi.string()
      .label("Date Of Birth")
      .regex(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
      .required()
      .options({
        language: {
          string: {
            regex: { base: "must be in the following format: YYYY-MM-DD" }
          }
        }
      }),
    individualSsn: Joi.string()
      .label("SSN")
      .regex(/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/)
      .required()
      .options({
        language: {
          string: {
            regex: {
              base: "must be in the following format XXX-XX-XXXX"
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
    try {
      let wyreAccountId = await JSON.parse(localStorage.getItem("wyreAccount"))
        .id;
      await updateWyrePersonalDetailsAccount(
        [
          {
            fieldId: updateAccountValues.legalName,
            value: this.state.data.individualLegalName
          },
          {
            fieldId: updateAccountValues.dateOfBirth,
            value: this.state.data.individualDateOfBirth
          },
          {
            fieldId: updateAccountValues.socialSecurityNumber,
            value: this.state.data.individualSsn
          }
        ],
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
        <h1>Submit your personal details</h1>
        <div className="row justify-content-center align-items-center">
          <div className="">
            <form
              onSubmit={this.handleSubmit}
              // className=" justify-content-center align-items-center"
            >
              {this.renderInput(
                "individualLegalName",
                'Legal Name "First Last"'
              )}
              {this.renderInput(
                "individualDateOfBirth",
                "Date of Birth YYYY-MM-DD"
              )}
              {this.renderInput("individualSsn", "US Social Security Number")}
              {this.renderButton("Send")}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonalDetailsUserForm;
