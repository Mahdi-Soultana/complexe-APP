import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function LoggedIn(props) {
  const state = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={() => appDispatch({ type: "openSreach" })}
        href="#"
        className="text-white mr-2 header-search-icon"
        data-for="search"
        data-tip="search"
      >
        <i className="fas fa-search"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      {"  "}
      <span
        className="mr-2 header-chat-icon text-white"
        data-for="chat"
        data-tip="chat"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      {"  "}
      <Link
        to={`/profile/${state.user.username}`}
        className="mr-2"
        data-tip="profile"
        data-for="profile"
      >
        <img className="small-header-avatar" src={state.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      {"   "}
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>

      <Link
        className="btn btn-sm btn-secondary"
        onClick={() => {
          appDispatch({ type: "logOut" });
        }}
        to="/"
      >
        Sign Out
      </Link>
    </div>
  );
}

export default LoggedIn;
