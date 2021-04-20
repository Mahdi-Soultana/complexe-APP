import React, { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";
import Page from "./Page";
import Axios from "axios";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import LoadingDot from "./LoadingDot";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPage(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  function OurReducer(draft, action) {
    switch (action.type) {
      case "ChangeTitle":
        draft.title = action.value;
        break;
      case "ChangeBody":
        draft.body = action.value;

        break;
      case "SubmitForm":
        ++draft.submitCount;
        break;
      case "Rest":
        draft.updated = false;
        break;
      case "FinshedLoading":
        draft.isLoading = false;
        break;
      case "StartLoading":
        draft.isLoading = true;
        break;
      case "Updated":
        draft.updated = true;
        break;
      case "Found":
        draft.found = false;
        break;
    }
  }
  const initialState = {
    title: "",
    body: "",
    submitCount: 0,
    isLoading: true,
    updated: false,
    found: true
  };
  const [state, dispatch] = useImmerReducer(OurReducer, initialState);
  const { id } = useParams();
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function getPost() {
      try {
        const postRes = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token
        });
        if (!postRes.data) {
          dispatch({ type: "Found" });
        }
        if (
          postRes.data &&
          postRes.data.author.username != appState.user.username
        ) {
          appDispatch({
            type: "addFlashMessage",
            value: "You have Not the Premission to Edit this Post !"
          });
          props.history.push("/");
        }
        dispatch({ type: "ChangeBody", value: postRes.data.body });
        dispatch({ type: "ChangeTitle", value: postRes.data.title });
        dispatch({ type: "FinshedLoading" });
      } catch (e) {
        console.log(e);
      }
    })();
    return () => {
      dispatch({ type: "Rest" });
      ourRequest.cancel("You Have Navigate Before Loading !");
    };
  }, []);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    if (state.title.trim() && state.body.trim()) {
      dispatch({ type: "StartLoading" });
      (async function getPost() {
        try {
          const postRes = await Axios.post(
            `/post/${id}/edit`,
            {
              title: state.title,
              body: state.body,
              token: appState.user.token
            },
            {
              cancelToken: ourRequest.token
            }
          );
          dispatch({ type: "FinshedLoading" });
          appDispatch({
            type: "addFlashMessage",
            value: "Your Post Updated Successfully ."
          });
          dispatch({ type: "Rest" });
          props.history.push(`/profile/${appState.user.username}`);
        } catch (e) {
          console.log(e);
        }
      })();
    }
    return () => {
      dispatch({ type: "Rest" });
      ourRequest.cancel("You Have Navigate Before Loading !");
    };
  }, [state.submitCount]);
  if (state.isLoading && !state.title) {
    return (
      <Page title="Loading Upadte Post">
        <LoadingDot />
      </Page>
    );
  }
  if (!state.found) {
    return <NotFound />;
  }

  function handelSubmit(e) {
    e.preventDefault();
    dispatch({ type: "SubmitForm" });
  }
  console.log(state);

  return (
    <Page title="Update Post">
      <form onSubmit={handelSubmit}>
        <div className="form-group">
          <div
            hidden={state.title ? true : false}
            className="alert bg-danger text-white"
          >
            {" "}
            You Must Provie Title
          </div>
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onChange={e =>
              dispatch({ type: "ChangeTitle", value: e.target.value.trim() })
            }
            value={state.title}
            onKeyUp={() => dispatch({ type: "Updated" })}
          />
        </div>

        <div className="form-group">
          <div
            hidden={state.body ? true : false}
            className="alert bg-danger text-white"
          >
            {" "}
            You Must Provie Body
          </div>
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            onChange={e =>
              dispatch({ type: "ChangeBody", value: e.target.value.trim() })
            }
            onKeyUp={() => dispatch({ type: "Updated" })}
            value={state.body}
          ></textarea>
        </div>

        <button
          className="btn btn-primary"
          disabled={
            !state.updated || state.isLoading || !state.title || !state.body
          }
        >
          Save New Post
        </button>
      </form>
    </Page>
  );
}

export default withRouter(EditPage);
