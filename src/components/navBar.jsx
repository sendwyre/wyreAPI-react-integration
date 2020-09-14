import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Zakat Finance
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <React.Fragment>
            <li className="nav-item">
              <NavLink className="nav-link" to="/userProfile">
                New Wyre User
              </NavLink>
            </li>
          </React.Fragment>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
