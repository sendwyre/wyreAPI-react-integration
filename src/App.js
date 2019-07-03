import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Home from "./components/home";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import UserProfile from "./components/userProfile";
import EmailUserForm from "./components/wyreComponents/emailUserForm";
import CellPhoneUserForm from "./components/wyreComponents/cellPhoneUserForm";
import PersonalDetailsUserForm from "./components/wyreComponents/personalDetailsUserForm";
import AddressUserForm from "./components/wyreComponents/addressUserForm";
import DocumentUserForm from "./components/wyreComponents/documentUserForm";
import BankAccountUserForm from "./components/wyreComponents/bankAccountUserForm";
import ProofOfAddressUserForm from "./components/wyreComponents/proofOfAddressUserForm";
import "./App.css";

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/userProfile" component={UserProfile} />
            <Route path="/emailUserForm" component={EmailUserForm} />
            <Route path="/cellPhoneUserForm" component={CellPhoneUserForm} />
            <Route
              path="/personalDetailsUserForm"
              component={PersonalDetailsUserForm}
            />
            <Route path="/addressUserForm" component={AddressUserForm} />
            <Route path="/documentUserForm" component={DocumentUserForm} />
            <Route
              path="/bankAccountUserForm"
              component={BankAccountUserForm}
            />
            <Route
              path="/proofOfAddressUserForm"
              component={ProofOfAddressUserForm}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact={true} to="/home" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
