import React, { useContext } from "react";
import StateContext from "../StateContext";

function FlashMessage() {
  const { flashMessage } = useContext(StateContext);
  return (
    <div className="floating-alerts">
      {flashMessage.map((msg, i) => (
        <div
          key={i}
          className="alert alert-success text-center floating-alert shadow-sm"
        >
          {msg}
        </div>
      ))}
    </div>
  );
}

export default FlashMessage;
