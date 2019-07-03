import React, { Component } from "react";
import { Helmet } from "react-helmet";

class BankAccountUserForm extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" />
          <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js" />
          <script src="https://verify.sendwyre.com/js/pm-widget-init.js" />
          <script src="https://unpkg.com/axios/dist/axios.min.js" />
          <script src={process.env.PUBLIC_URL + "WyrePmWidget.js"} />
        </Helmet>
      </div>
    );
  }
}

export default BankAccountUserForm;
