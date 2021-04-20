import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import LoggedIn from "./loggedIn";
import FormLoggedOut from "./LoggedOut";
import StateContext from "../StateContext";

function Header(props) {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {" "}
            ComplexApp{" "}
          </Link>
        </h4>
        {props.login ? <LoggedIn /> : <FormLoggedOut />}
      </div>
    </header>
  );
}

export default Header;
