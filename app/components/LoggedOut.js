import React, { useContext, useEffect } from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
function FormLoggedOut(props) {
  const initialState = {
    username: "",
    password: ""
  };
  function reducer(draft, action) {
    switch (action.type) {
      case "changeUsername":
        draft.username = action.value;
        break;
      case "changePassword":
        draft.password = action.value;
        break;
      case "Rest":
        draft.password = "";
        draft.username = "";
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const { username, password } = state;
  const appDispatch = useContext(DispatchContext);
  const ourRequest = Axios.CancelToken.source();
  async function handelSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post(
        "/login",
        {
          username,
          password
        },
        {
          cancelToken: ourRequest.token
        }
      );
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
      } else {
        console.log("Please Try Again");
      }
    } catch (e) {
      console.log(e.response.data);
    }
  }
  useEffect(() => {
    return () => {
      ourRequest.cancel("You Have Navigate Before Loading !");
      dispatch({ type: "Rest" });
    };
  }, []);

  return (
    <form onSubmit={handelSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            onChange={e => {
              dispatch({ type: "changeUsername", value: e.target.value });
            }}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            autoComplete="off"
            onChange={e => {
              dispatch({ type: "changePassword", value: e.target.value });
            }}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default FormLoggedOut;
