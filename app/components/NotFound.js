import React, { useState } from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

function NotFound() {
  return (
    <Page title="Page Not Found">
      <h3 className="text-center">Opps We Can't Find This Page !</h3>
      <p className="lead text-muted text-center">
        You Can Alwayse Visit <Link to="/">The Home </Link>age to Get a Fresh
        Start
      </p>
    </Page>
  );
}

export default NotFound;
