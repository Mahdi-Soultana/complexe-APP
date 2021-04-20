import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import LoadingDot from "./LoadingDot";
import ReactMarkDown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
function ViewCreatePost(props) {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function getPost() {
      try {
        const postRes = await Axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token
        });
        setPost(postRes.data);
      } catch (e) {
        console.log(e);
      }
    })();
    return () => {
      setPost({});
      ourRequest.cancel("You Have Navigate Before Loading !");
    };
  }, []);

  const date = new Date(post.createdDate);
  const dateFormat = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  function dispalyControls() {
    if (appState.login) {
      console.log(post);
      return appState.user.username == post.author.username;
    } else {
      props.history.push(`/`);
      appDispatch({
        type: "addFlashMessage",
        value: "You Must LoggIn To See this Page "
      });
    }
    return false;
  }
  if (!post) {
    return <NotFound />;
  }
  if (!post.title) {
    return (
      <Page title="Loading Post">
        <LoadingDot />
      </Page>
    );
  }

  async function handelDelete() {
    try {
      const confirm = window.confirm("Are You Sure To Delete This Post ?");
      if (confirm) {
        const resDelete = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token }
        });
        if (resDelete.data == "Success") {
          props.history.push(`/profile/${appState.user.username}`);
          appDispatch({ type: "addFlashMessage", value: "Post Deleted !" });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {dispalyControls() && (
          <span className="pt-2">
            <Link
              data-tip="Edit"
              data-for="edit"
              to={`/post/${post._id}/edit`}
              className="text-primary mr-2"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            {"  "}
            <Link
              onClick={handelDelete}
              data-tip="Delete"
              data-for="delete"
              to={`/post/${post._id}`}
              className="delete-post-button text-danger"
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormat}
      </p>

      <div className="body-content">
        <ReactMarkDown
          source={post.body}
          allowedTypes={[
            "emphasis",
            "heading",
            "list",
            "listItem",
            "paragraph",
            "strong",
            "text"
          ]}
        />
      </div>
    </Page>
  );
}

export default withRouter(ViewCreatePost);
