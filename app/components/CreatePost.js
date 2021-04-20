import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import Page from "./Page";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  async function handelSubmit(e) {
    e.preventDefault();
    try {
      const res = await Axios.post("/create-post", {
        title,
        body,
        token: state.user.token
      });
      setTitle("");
      setBody("");
      props.history.push(`/post/${res.data}`);
      dispatch({
        type: "addFlashMessage",
        value: "You Have Added New Post Congratulation !"
      });

      console.log("post Added");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <Page title="Create Post">
      <form onSubmit={handelSubmit}>
        <div className="form-group">
          <div
            hidden={title ? true : false}
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
            onChange={e => setTitle(e.target.value)}
            value={title}
          />
        </div>

        <div className="form-group">
          <div
            hidden={body ? true : false}
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
            onChange={e => setBody(e.target.value)}
            value={body}
          ></textarea>
        </div>

        <button className="btn btn-primary" disabled={!title || !body}>
          Save New Post
        </button>
      </form>
    </Page>
  );
}

export default withRouter(CreatePost);
