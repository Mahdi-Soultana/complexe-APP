import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import LoadingDot from "./LoadingDot";
import NotFound from "./NotFound";

function ProfilePosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { username } = useParams();
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    (async function getPosts() {
      try {
        const { data: posts } = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: ourRequest.token
        });

        setPosts(posts);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
    return () => {
      ourRequest.cancel("You Have Navigate Before Loading !");
    };
  }, []);

  if (!posts.length && isLoading) {
    return <LoadingDot />;
  }

  return (
    <>
      <div className="list-group">
        {posts.map(post => {
          const date = new Date(post.createdDate);
          const dateFormat = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;
          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={post.author.avatar} />{" "}
              <strong>{post.title}</strong>
              <span className="text-muted small"> on {dateFormat} </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default ProfilePosts;
